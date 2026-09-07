import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { moodEntries } from './mood';

export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  moodEntryId: uuid('mood_entry_id').references(() => moodEntries.id),
  body: text('body').notNull().default(''),
  isDraft: boolean('is_draft').notNull().default(true),
  aiReflectionText: text('ai_reflection_text'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});