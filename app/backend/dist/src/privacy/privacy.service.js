"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const users_1 = require("../db/schema/users");
const preferences_1 = require("../db/schema/preferences");
const mood_1 = require("../db/schema/mood");
const journal_1 = require("../db/schema/journal");
const exercises_1 = require("../db/schema/exercises");
const drizzle_orm_1 = require("drizzle-orm");
let PrivacyService = class PrivacyService {
    async exportUserData(userId) {
        const [user] = await client_1.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.id, userId));
        const [preferences] = await client_1.db
            .select()
            .from(preferences_1.userPreferences)
            .where((0, drizzle_orm_1.eq)(preferences_1.userPreferences.userId, userId));
        const moods = await client_1.db.select().from(mood_1.moodEntries).where((0, drizzle_orm_1.eq)(mood_1.moodEntries.userId, userId));
        const journals = await client_1.db
            .select()
            .from(journal_1.journalEntries)
            .where((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId));
        const exercises = await client_1.db
            .select()
            .from(exercises_1.exerciseSessions)
            .where((0, drizzle_orm_1.eq)(exercises_1.exerciseSessions.userId, userId));
        return {
            exportedAt: new Date().toISOString(),
            account: {
                email: user.email,
                preferredName: user.preferredName,
                memberSince: user.createdAt,
            },
            preferences: preferences ?? null,
            moodCheckIns: moods.map((m) => ({
                score: m.score,
                tags: m.tags,
                note: m.note,
                date: m.createdAt,
            })),
            journalEntries: journals
                .filter((j) => !j.isDraft)
                .map((j) => ({
                body: j.body,
                aiReflection: j.aiReflectionText,
                date: j.createdAt,
            })),
            exerciseSessions: exercises.map((e) => ({
                exerciseId: e.exerciseId,
                durationSeconds: e.durationSeconds,
                completedAt: e.completedAt,
            })),
        };
    }
    async deleteAccount(userId) {
        await client_1.db.delete(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.id, userId));
        return { deleted: true, deletedAt: new Date().toISOString() };
    }
};
exports.PrivacyService = PrivacyService;
exports.PrivacyService = PrivacyService = __decorate([
    (0, common_1.Injectable)()
], PrivacyService);
//# sourceMappingURL=privacy.service.js.map