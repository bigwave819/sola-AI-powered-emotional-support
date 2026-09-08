import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../db/client';
import { journalEntries } from '../db/schema/journal';
import { users } from '../db/schema/users';
import { userPreferences } from '../db/schema/preferences';
import { eq, and, desc, gte, isNotNull, count } from 'drizzle-orm';
import type { AiProvider } from '../ai/ai-provider.interface';
import { SafetyService } from '../safety/safety.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

const FREE_TIER_MONTHLY_REFLECTION_LIMIT = Number(process.env.FREE_TIER_AI_LIMIT ?? 20);
const PLUS_TIER_MONTHLY_REFLECTION_LIMIT = Number(process.env.PLUS_TIER_AI_LIMIT ?? 500);

@Injectable()
export class JournalService {
  constructor(
    @Inject('AiProvider') private aiProvider: AiProvider, 
    private safetyService: SafetyService,
    private subscriptionsService: SubscriptionsService,
  ) { }

  async create(userId: string, moodEntryId?: string) {
    const [entry] = await db
      .insert(journalEntries)
      .values({ userId, moodEntryId, body: '', isDraft: true })
      .returning();
    return entry;
  }

  async update(userId: string, entryId: string, body: string) {
    await this.assertOwnership(userId, entryId);

    const [entry] = await db
      .update(journalEntries)
      .set({ body, updatedAt: new Date() })
      .where(eq(journalEntries.id, entryId))
      .returning();
    return entry;
  }

  async finalize(userId: string, entryId: string) {
    await this.assertOwnership(userId, entryId);
    const [entry] = await db
      .update(journalEntries)
      .set({ isDraft: false, updatedAt: new Date() })
      .where(eq(journalEntries.id, entryId))
      .returning();
    return entry;
  }

  async delete(userId: string, entryId: string) {
    await this.assertOwnership(userId, entryId);
    await db.delete(journalEntries).where(eq(journalEntries.id, entryId));
    return { success: true };
  }

  async list(userId: string) {
    return db
      .select()
      .from(journalEntries)
      .where(and(eq(journalEntries.userId, userId), eq(journalEntries.isDraft, false)))
      .orderBy(desc(journalEntries.createdAt));
  }

  async getOne(userId: string, entryId: string) {
    const entry = await this.assertOwnership(userId, entryId);
    return entry;
  }

  async reflect(userId: string, entryId: string) {
    const entry = await this.assertOwnership(userId, entryId);

    await this.assertAiQuotaAvailable(userId);

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    const result = await this.aiProvider.generateReflection({
      journalText: entry.body,
      reflectionStylePreference: prefs?.reflectionPreference,
      preferredName: user?.preferredName,
    });

    if (result.flaggedForSafety) {
      await this.safetyService.logEvent(userId, 'journal_reflection');
    }

    await db
      .update(journalEntries)
      .set({ aiReflectionText: result.reflectionText, updatedAt: new Date() })
      .where(eq(journalEntries.id, entryId));

    return {
      reflectionText: result.reflectionText,
      flaggedForSafety: result.flaggedForSafety,
    };
  }

  // ---------- guards ----------

  private async assertOwnership(userId: string, entryId: string) {
    const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, entryId));
    if (!entry) throw new NotFoundException('Journal entry not found');
    if (entry.userId !== userId) throw new ForbiddenException(); // the isolation guarantee, enforced explicitly
    return entry;
  }

  private async assertAiQuotaAvailable(userId: string) {
    const entitlement = await this.subscriptionsService.getEntitlement(userId);
    const limit =
      entitlement.tier === 'plus'
        ? PLUS_TIER_MONTHLY_REFLECTION_LIMIT
        : FREE_TIER_MONTHLY_REFLECTION_LIMIT;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [{ value }] = await db
      .select({ value: count() })
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.userId, userId),
          isNotNull(journalEntries.aiReflectionText),
          gte(journalEntries.createdAt, monthStart),
        ),
      );

    if (value >= limit) {
      throw new ForbiddenException({
        code: 'AI_QUOTA_EXCEEDED',
        message: 'AI reflection limit reached for this period',
      });
    }
  }
}