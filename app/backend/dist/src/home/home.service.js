"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const users_1 = require("../db/schema/users");
const mood_1 = require("../db/schema/mood");
const journal_1 = require("../db/schema/journal");
const drizzle_orm_1 = require("drizzle-orm");
let HomeService = class HomeService {
    async getSummary(userId) {
        const [user] = await client_1.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.id, userId));
        const [latestMood] = await client_1.db
            .select()
            .from(mood_1.moodEntries)
            .where((0, drizzle_orm_1.eq)(mood_1.moodEntries.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(mood_1.moodEntries.createdAt))
            .limit(1);
        const [draftJournal] = await client_1.db
            .select()
            .from(journal_1.journalEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId), (0, drizzle_orm_1.eq)(journal_1.journalEntries.isDraft, true)))
            .orderBy((0, drizzle_orm_1.desc)(journal_1.journalEntries.updatedAt))
            .limit(1);
        const pastEntries = await client_1.db
            .select()
            .from(journal_1.journalEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId), (0, drizzle_orm_1.eq)(journal_1.journalEntries.isDraft, false)))
            .orderBy((0, drizzle_orm_1.desc)(journal_1.journalEntries.createdAt));
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const eligiblePast = pastEntries.filter((e) => e.createdAt < sevenDaysAgo);
        const resurfacedEntry = eligiblePast.length
            ? eligiblePast[Math.floor(Math.random() * eligiblePast.length)]
            : null;
        return {
            greetingName: user.preferredName ?? null,
            latestMood: latestMood
                ? { score: latestMood.score, createdAt: latestMood.createdAt }
                : null,
            continueJournal: draftJournal
                ? { id: draftJournal.id, bodyPreview: draftJournal.body.slice(0, 80) }
                : null,
            resurfacedEntry: resurfacedEntry
                ? {
                    id: resurfacedEntry.id,
                    bodyPreview: resurfacedEntry.body.slice(0, 100),
                    createdAt: resurfacedEntry.createdAt,
                }
                : null,
            suggestedExercise: { id: 'breathing-basic', title: 'A quiet breath', durationMin: 3 },
        };
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)()
], HomeService);
//# sourceMappingURL=home.service.js.map