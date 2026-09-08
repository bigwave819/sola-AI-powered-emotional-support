import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { users } from '../db/schema/users';
import { userPreferences } from '../db/schema/preferences';
import { moodEntries } from '../db/schema/mood';
import { journalEntries } from '../db/schema/journal';
import { exerciseSessions } from '../db/schema/exercises';
import { eq } from 'drizzle-orm';

@Injectable()
export class PrivacyService {
  async exportUserData(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    const moods = await db.select().from(moodEntries).where(eq(moodEntries.userId, userId));
    const journals = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId));
    const exercises = await db
      .select()
      .from(exerciseSessions)
      .where(eq(exerciseSessions.userId, userId));

    // Human-readable structured export — no raw DB internals like FK ids
    // beyond what the user would recognize as their own content.
    return {
      exportedAt: new Date().toISOString(),
      account: {
        email: user.email,
        preferredName: user.preferredName,
        memberSince: user.createdAt,
      },
      preferences: preferences ?? null,
      moodCheckIns: moods.map((m) => ({
        score: m.score,
        tags: m.tags,
        note: m.note,
        date: m.createdAt,
      })),
      journalEntries: journals
        .filter((j) => !j.isDraft)
        .map((j) => ({
          body: j.body,
          aiReflection: j.aiReflectionText,
          date: j.createdAt,
        })),
      exerciseSessions: exercises.map((e) => ({
        exerciseId: e.exerciseId,
        durationSeconds: e.durationSeconds,
        completedAt: e.completedAt,
      })),
    };
  }

  async deleteAccount(userId: string) {
    // 🧭 Immediate hard delete for now — the 14-day grace period question
    // is OPEN pending legal review. FK cascades (set on every table's
    // userId reference) handle removing preferences, mood, journal,
    // exercise sessions, refresh tokens, and safety events automatically.
    await db.delete(users).where(eq(users.id, userId));
    return { deleted: true, deletedAt: new Date().toISOString() };
  }
}