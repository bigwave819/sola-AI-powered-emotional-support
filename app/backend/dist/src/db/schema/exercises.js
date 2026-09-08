"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseSessions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.exerciseSessions = (0, pg_core_1.pgTable)('exercise_sessions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    exerciseId: (0, pg_core_1.text)('exercise_id').notNull(),
    durationSeconds: (0, pg_core_1.integer)('duration_seconds').notNull(),
    completedAt: (0, pg_core_1.timestamp)('completed_at').notNull().defaultNow(),
});
//# sourceMappingURL=exercises.js.map