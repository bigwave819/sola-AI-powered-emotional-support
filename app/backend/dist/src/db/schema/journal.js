"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalEntries = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const mood_1 = require("./mood");
exports.journalEntries = (0, pg_core_1.pgTable)('journal_entries', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    moodEntryId: (0, pg_core_1.uuid)('mood_entry_id').references(() => mood_1.moodEntries.id),
    body: (0, pg_core_1.text)('body').notNull().default(''),
    isDraft: (0, pg_core_1.boolean)('is_draft').notNull().default(true),
    aiReflectionText: (0, pg_core_1.text)('ai_reflection_text'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
//# sourceMappingURL=journal.js.map