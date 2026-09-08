"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const mood_1 = require("../db/schema/mood");
const journal_1 = require("../db/schema/journal");
const drizzle_orm_1 = require("drizzle-orm");
let InsightsService = class InsightsService {
    async suggestedReminderHour(userId) {
        const moods = await client_1.db.select({ createdAt: mood_1.moodEntries.createdAt }).from(mood_1.moodEntries).where((0, drizzle_orm_1.eq)(mood_1.moodEntries.userId, userId));
        const journals = await client_1.db.select({ createdAt: journal_1.journalEntries.createdAt }).from(journal_1.journalEntries).where((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId));
        const allTimestamps = [...moods, ...journals].map((r) => r.createdAt.getHours());
        if (allTimestamps.length === 0) {
            return 19;
        }
        const counts = {};
        for (const h of allTimestamps)
            counts[h] = (counts[h] ?? 0) + 1;
        return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
    }
    async weekly(userId) {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const moods = await client_1.db
            .select()
            .from(mood_1.moodEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(mood_1.moodEntries.userId, userId), (0, drizzle_orm_1.gte)(mood_1.moodEntries.createdAt, sevenDaysAgo)))
            .orderBy((0, drizzle_orm_1.desc)(mood_1.moodEntries.createdAt));
        const journals = await client_1.db
            .select()
            .from(journal_1.journalEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId), (0, drizzle_orm_1.eq)(journal_1.journalEntries.isDraft, false), (0, drizzle_orm_1.gte)(journal_1.journalEntries.createdAt, sevenDaysAgo)))
            .orderBy((0, drizzle_orm_1.desc)(journal_1.journalEntries.createdAt));
        const avgMood = moods.length
            ? Math.round((moods.reduce((sum, m) => sum + m.score, 0) / moods.length) * 10) / 10
            : null;
        const streak = await this.computeStreak(userId);
        const tagCounts = {};
        for (const m of moods) {
            for (const tag of m.tags ?? []) {
                tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
            }
        }
        const topTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([tag]) => tag);
        return {
            averageMood: avgMood,
            moodTrend: moods.map((m) => ({ score: m.score, date: m.createdAt })).reverse(),
            journalCount: journals.length,
            currentStreak: streak,
            topTags,
        };
    }
    async computeStreak(userId) {
        const moods = await client_1.db
            .select({ createdAt: mood_1.moodEntries.createdAt })
            .from(mood_1.moodEntries)
            .where((0, drizzle_orm_1.eq)(mood_1.moodEntries.userId, userId));
        const journals = await client_1.db
            .select({ createdAt: journal_1.journalEntries.createdAt })
            .from(journal_1.journalEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId), (0, drizzle_orm_1.eq)(journal_1.journalEntries.isDraft, false)));
        const activeDates = new Set([...moods, ...journals].map((r) => r.createdAt.toISOString().slice(0, 10)));
        let streak = 0;
        const cursor = new Date();
        while (true) {
            const key = cursor.toISOString().slice(0, 10);
            if (activeDates.has(key)) {
                streak++;
                cursor.setDate(cursor.getDate() - 1);
            }
            else if (streak === 0 && key === new Date().toISOString().slice(0, 10)) {
                cursor.setDate(cursor.getDate() - 1);
                continue;
            }
            else {
                break;
            }
        }
        return streak;
    }
};
exports.InsightsService = InsightsService;
exports.InsightsService = InsightsService = __decorate([
    (0, common_1.Injectable)()
], InsightsService);
//# sourceMappingURL=insights.service.js.map