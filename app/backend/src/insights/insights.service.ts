import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { moodEntries } from '../db/schema/mood';
import { journalEntries } from '../db/schema/journal';
import { eq, and, gte, desc } from 'drizzle-orm';

@Injectable()
export class InsightsService {
  async suggestedReminderHour(userId: string): Promise<number> {
    const moods = await db.select({ createdAt: moodEntries.createdAt }).from(moodEntries).where(eq(moodEntries.userId, userId));
    const journals = await db.select({ createdAt: journalEntries.createdAt }).from(journalEntries).where(eq(journalEntries.userId, userId));

    const allTimestamps = [...moods, ...journals].map((r) => r.createdAt.getHours());

    if (allTimestamps.length === 0) {
      return 19; // 🧭 cold-start default: early evening, a reasonable generic wind-down time
    }

    const counts: Record<number, number> = {};
    for (const h of allTimestamps) counts[h] = (counts[h] ?? 0) + 1;

    return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  }

  async weekly(userId: string) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const moods = await db
      .select()
      .from(moodEntries)
      .where(and(eq(moodEntries.userId, userId), gte(moodEntries.createdAt, sevenDaysAgo)))
      .orderBy(desc(moodEntries.createdAt));

    const journals = await db
      .select()
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.userId, userId),
          eq(journalEntries.isDraft, false),
          gte(journalEntries.createdAt, sevenDaysAgo),
        ),
      )
      .orderBy(desc(journalEntries.createdAt));

    const avgMood = moods.length
      ? Math.round((moods.reduce((sum, m) => sum + m.score, 0) / moods.length) * 10) / 10
      : null;

    const streak = await this.computeStreak(userId);

    const tagCounts: Record<string, number> = {};
    for (const m of moods) {
      for (const tag of m.tags ?? []) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    return {
      averageMood: avgMood,
      moodTrend: moods.map((m) => ({ score: m.score, date: m.createdAt })).reverse(),
      journalCount: journals.length,
      currentStreak: streak,
      topTags,
    };
  }

  private async computeStreak(userId: string) {
    // Consecutive days (ending today or yesterday) with at least one
    // mood check-in OR finalized journal entry.
    const moods = await db
      .select({ createdAt: moodEntries.createdAt })
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId));

    const journals = await db
      .select({ createdAt: journalEntries.createdAt })
      .from(journalEntries)
      .where(and(eq(journalEntries.userId, userId), eq(journalEntries.isDraft, false)));

    const activeDates = new Set(
      [...moods, ...journals].map((r) => r.createdAt.toISOString().slice(0, 10)),
    );

    let streak = 0;
    const cursor = new Date();

    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (activeDates.has(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else if (streak === 0 && key === new Date().toISOString().slice(0, 10)) {
        // today has no activity yet — check yesterday before giving up,
        // so the streak doesn't zero out just because they haven't opened
        // the app yet today
        cursor.setDate(cursor.getDate() - 1);
        continue;
      } else {
        break;
      }
    }

    return streak;
  }
}

