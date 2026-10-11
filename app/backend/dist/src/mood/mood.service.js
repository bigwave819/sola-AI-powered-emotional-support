"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const mood_1 = require("../db/schema/mood");
const drizzle_orm_1 = require("drizzle-orm");
let MoodService = class MoodService {
    async create(userId, payload) {
        const [entry] = await client_1.db
            .insert(mood_1.moodEntries)
            .values({
            userId,
            score: payload.score,
            tags: payload.tags ?? [],
            note: payload.note,
        })
            .returning();
        return entry;
    }
    async history(userId, limit = 30) {
        return client_1.db
            .select()
            .from(mood_1.moodEntries)
            .where((0, drizzle_orm_1.eq)(mood_1.moodEntries.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(mood_1.moodEntries.createdAt))
            .limit(limit);
    }
};
exports.MoodService = MoodService;
exports.MoodService = MoodService = __decorate([
    (0, common_1.Injectable)()
], MoodService);
//# sourceMappingURL=mood.service.js.map