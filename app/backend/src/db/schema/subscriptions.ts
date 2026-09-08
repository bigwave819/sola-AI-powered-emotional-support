import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('free'), // 'free' | 'active' | 'grace_period' | 'account_hold' | 'expired' | 'cancelled'
  productId: text('product_id'),                     // whatever RevenueCat reports — never hardcoded here
  currentPeriodEndsAt: timestamp('current_period_ends_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});