"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPreferences = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.userPreferences = (0, pg_core_1.pgTable)('user_preferences', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().unique().references(() => users_1.users.id, { onDelete: 'cascade' }),
    motivations: (0, pg_core_1.text)('motivations').array(),
    baselineMood: (0, pg_core_1.integer)('baseline_mood'),
    reflectionPreference: (0, pg_core_1.text)('reflection_preference'),
    timeCommitment: (0, pg_core_1.text)('time_commitment'),
    notificationsEnabled: (0, pg_core_1.boolean)('notifications_enabled').notNull().default(false),
    onboardingCompletedAt: (0, pg_core_1.timestamp)('onboarding_completed_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=preferences.js.map