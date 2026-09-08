"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const journal_1 = require("../db/schema/journal");
const users_1 = require("../db/schema/users");
const preferences_1 = require("../db/schema/preferences");
const drizzle_orm_1 = require("drizzle-orm");
const safety_service_1 = require("../safety/safety.service");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const FREE_TIER_MONTHLY_REFLECTION_LIMIT = Number(process.env.FREE_TIER_AI_LIMIT ?? 20);
const PLUS_TIER_MONTHLY_REFLECTION_LIMIT = Number(process.env.PLUS_TIER_AI_LIMIT ?? 500);
let JournalService = class JournalService {
    aiProvider;
    safetyService;
    subscriptionsService;
    constructor(aiProvider, safetyService, subscriptionsService) {
        this.aiProvider = aiProvider;
        this.safetyService = safetyService;
        this.subscriptionsService = subscriptionsService;
    }
    async create(userId, moodEntryId) {
        const [entry] = await client_1.db
            .insert(journal_1.journalEntries)
            .values({ userId, moodEntryId, body: '', isDraft: true })
            .returning();
        return entry;
    }
    async update(userId, entryId, body) {
        await this.assertOwnership(userId, entryId);
        const [entry] = await client_1.db
            .update(journal_1.journalEntries)
            .set({ body, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(journal_1.journalEntries.id, entryId))
            .returning();
        return entry;
    }
    async finalize(userId, entryId) {
        await this.assertOwnership(userId, entryId);
        const [entry] = await client_1.db
            .update(journal_1.journalEntries)
            .set({ isDraft: false, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(journal_1.journalEntries.id, entryId))
            .returning();
        return entry;
    }
    async delete(userId, entryId) {
        await this.assertOwnership(userId, entryId);
        await client_1.db.delete(journal_1.journalEntries).where((0, drizzle_orm_1.eq)(journal_1.journalEntries.id, entryId));
        return { success: true };
    }
    async list(userId) {
        return client_1.db
            .select()
            .from(journal_1.journalEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId), (0, drizzle_orm_1.eq)(journal_1.journalEntries.isDraft, false)))
            .orderBy((0, drizzle_orm_1.desc)(journal_1.journalEntries.createdAt));
    }
    async getOne(userId, entryId) {
        const entry = await this.assertOwnership(userId, entryId);
        return entry;
    }
    async reflect(userId, entryId) {
        const entry = await this.assertOwnership(userId, entryId);
        await this.assertAiQuotaAvailable(userId);
        const [user] = await client_1.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.id, userId));
        const [prefs] = await client_1.db
            .select()
            .from(preferences_1.userPreferences)
            .where((0, drizzle_orm_1.eq)(preferences_1.userPreferences.userId, userId));
        const result = await this.aiProvider.generateReflection({
            journalText: entry.body,
            reflectionStylePreference: prefs?.reflectionPreference,
            preferredName: user?.preferredName,
        });
        if (result.flaggedForSafety) {
            await this.safetyService.logEvent(userId, 'journal_reflection');
        }
        await client_1.db
            .update(journal_1.journalEntries)
            .set({ aiReflectionText: result.reflectionText, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(journal_1.journalEntries.id, entryId));
        return {
            reflectionText: result.reflectionText,
            flaggedForSafety: result.flaggedForSafety,
        };
    }
    async assertOwnership(userId, entryId) {
        const [entry] = await client_1.db.select().from(journal_1.journalEntries).where((0, drizzle_orm_1.eq)(journal_1.journalEntries.id, entryId));
        if (!entry)
            throw new common_1.NotFoundException('Journal entry not found');
        if (entry.userId !== userId)
            throw new common_1.ForbiddenException();
        return entry;
    }
    async assertAiQuotaAvailable(userId) {
        const entitlement = await this.subscriptionsService.getEntitlement(userId);
        const limit = entitlement.tier === 'plus'
            ? PLUS_TIER_MONTHLY_REFLECTION_LIMIT
            : FREE_TIER_MONTHLY_REFLECTION_LIMIT;
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const [{ value }] = await client_1.db
            .select({ value: (0, drizzle_orm_1.count)() })
            .from(journal_1.journalEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(journal_1.journalEntries.userId, userId), (0, drizzle_orm_1.isNotNull)(journal_1.journalEntries.aiReflectionText), (0, drizzle_orm_1.gte)(journal_1.journalEntries.createdAt, monthStart)));
        if (value >= limit) {
            throw new common_1.ForbiddenException({
                code: 'AI_QUOTA_EXCEEDED',
                message: 'AI reflection limit reached for this period',
            });
        }
    }
};
exports.JournalService = JournalService;
exports.JournalService = JournalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AiProvider')),
    __metadata("design:paramtypes", [Object, safety_service_1.SafetyService,
        subscriptions_service_1.SubscriptionsService])
], JournalService);
//# sourceMappingURL=journal.service.js.map