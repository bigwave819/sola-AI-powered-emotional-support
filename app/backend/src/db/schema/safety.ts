import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const safetyEvents = pgTable('safety_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  context: text('context').notNull(), // e.g. 'journal_reflection' — WHERE it happened, never the content
  createdAt: timestamp('created_at').notNull().defaultNow(),
});