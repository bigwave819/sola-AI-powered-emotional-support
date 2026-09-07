import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/client';
import { exerciseSessions } from '../db/schema/exercises';
import { EXERCISE_LIBRARY } from './exercise-library';

@Injectable()
export class ExercisesService {
  list() {
    return EXERCISE_LIBRARY;
  }

  getOne(id: string) {
    const exercise = EXERCISE_LIBRARY.find((e) => e.id === id);
    if (!exercise) throw new NotFoundException('Exercise not found');
    return exercise;
  }

  async complete(userId: string, exerciseId: string, durationSeconds: number) {
    this.getOne(exerciseId); // validates it exists

    const [session] = await db
      .insert(exerciseSessions)
      .values({ userId, exerciseId, durationSeconds })
      .returning();
    return session;
  }
}