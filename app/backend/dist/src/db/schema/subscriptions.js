"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.subscriptions = (0, pg_core_1.pgTable)('subscriptions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().unique().references(() => users_1.users.id, { onDelete: 'cascade' }),
    status: (0, pg_core_1.text)('status').notNull().default('free'),
    productId: (0, pg_core_1.text)('product_id'),
    currentPeriodEndsAt: (0, pg_core_1.timestamp)('current_period_ends_at'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
//# sourceMappingURL=subscriptions.js.map