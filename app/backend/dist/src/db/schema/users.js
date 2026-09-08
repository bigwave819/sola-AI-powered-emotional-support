"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.magicLinkTokens = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    preferredName: (0, pg_core_1.text)('preferred_name'),
    authProvider: (0, pg_core_1.text)('auth_provider').notNull(),
    ageConfirmed: (0, pg_core_1.boolean)('age_confirmed').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
exports.magicLinkTokens = (0, pg_core_1.pgTable)('magic_link_tokens', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    email: (0, pg_core_1.text)('email').notNull(),
    token: (0, pg_core_1.text)('token').notNull().unique(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    usedAt: (0, pg_core_1.timestamp)('used_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
exports.refreshTokens = (0, pg_core_1.pgTable)('refresh_tokens', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    tokenHash: (0, pg_core_1.text)('token_hash').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    revokedAt: (0, pg_core_1.timestamp)('revoked_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=users.js.map