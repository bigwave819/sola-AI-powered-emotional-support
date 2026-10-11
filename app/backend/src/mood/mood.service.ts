import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { moodEntries } from '../db/schema/mood';
import { eq, desc } from 'drizzle-orm';

interface CreateMoodPayload {
  score: number;
  tags?: string[];
  note?: string;
}

@Injectable()
export class MoodService {
  async create(userId: string, payload: CreateMoodPayload) {
    const [entry] = await db
      .insert(moodEntries)
      .values({
        userId,
        score: payload.score,
        tags: payload.tags ?? [],
        note: payload.note,
      })
      .returning();
    return entry;
  }

  async history(userId: string, limit = 30) {
    return db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(limit);
  }
}