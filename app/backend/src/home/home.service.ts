import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { users } from '../db/schema/users';
import { moodEntries } from '../db/schema/mood';
import { journalEntries } from '../db/schema/journal';
import { eq, and, desc } from 'drizzle-orm';

@Injectable()
export class HomeService {
  async getSummary(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    const [latestMood] = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(1);

    const [draftJournal] = await db
      .select()
      .from(journalEntries)
      .where(and(eq(journalEntries.userId, userId), eq(journalEntries.isDraft, true)))
      .orderBy(desc(journalEntries.updatedAt))
      .limit(1);

    // "Talk to Your Past Self" — simple version: a random completed entry
    // from at least 7 days ago, if one exists.
    const pastEntries = await db
      .select()
      .from(journalEntries)
      .where(and(eq(journalEntries.userId, userId), eq(journalEntries.isDraft, false)))
      .orderBy(desc(journalEntries.createdAt));

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const eligiblePast = pastEntries.filter((e) => e.createdAt < sevenDaysAgo);
    const resurfacedEntry = eligiblePast.length
      ? eligiblePast[Math.floor(Math.random() * eligiblePast.length)]
      : null;

    return {
      greetingName: user.preferredName ?? null,
      latestMood: latestMood
        ? { score: latestMood.score, createdAt: latestMood.createdAt }
        : null,
      continueJournal: draftJournal
        ? { id: draftJournal.id, bodyPreview: draftJournal.body.slice(0, 80) }
        : null,
      resurfacedEntry: resurfacedEntry
        ? {
            id: resurfacedEntry.id,
            bodyPreview: resurfacedEntry.body.slice(0, 100),
            createdAt: resurfacedEntry.createdAt,
          }
        : null,
      // Exercises table doesn't exist yet (Phase 9) — hardcoded suggestion for now
      suggestedExercise: { id: 'breathing-basic', title: 'A quiet breath', durationMin: 3 },
    };
  }
}