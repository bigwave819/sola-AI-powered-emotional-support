import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),

  motivations: text('motivations').array(),          // e.g. ['stress', 'overthinking']
  baselineMood: integer('baseline_mood'),             // 1-10
  reflectionPreference: text('reflection_preference'), // 'writing' | 'talking' | 'quick' | 'guided'
  timeCommitment: text('time_commitment'),             // '2min' | '5min' | '10min' | 'whenever'
  notificationsEnabled: boolean('notifications_enabled').notNull().default(false),

  onboardingCompletedAt: timestamp('onboarding_completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});