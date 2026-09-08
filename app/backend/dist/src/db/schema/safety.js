"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safetyEvents = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.safetyEvents = (0, pg_core_1.pgTable)('safety_events', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    context: (0, pg_core_1.text)('context').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=safety.js.map