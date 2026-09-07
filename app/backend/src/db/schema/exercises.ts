import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const exerciseSessions = pgTable('exercise_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull(), // matches the static ID below, e.g. 'breathing-basic'
  durationSeconds: integer('duration_seconds').notNull(),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
});