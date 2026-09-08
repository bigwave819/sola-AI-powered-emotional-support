"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodEntries = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.moodEntries = (0, pg_core_1.pgTable)('mood_entries', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    score: (0, pg_core_1.integer)('score').notNull(),
    tags: (0, pg_core_1.text)('tags').array(),
    note: (0, pg_core_1.text)('note'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=mood.js.map