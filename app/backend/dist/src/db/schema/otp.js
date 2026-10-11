"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpCodes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.otpCodes = (0, pg_core_1.pgTable)('otp_codes', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    email: (0, pg_core_1.text)('email').notNull(),
    codeHash: (0, pg_core_1.text)('code_hash').notNull(),
    attempts: (0, pg_core_1.integer)('attempts').notNull().default(0),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    usedAt: (0, pg_core_1.timestamp)('used_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=otp.js.map