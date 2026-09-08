"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const users_1 = require("../db/schema/users");
const preferences_1 = require("../db/schema/preferences");
const drizzle_orm_1 = require("drizzle-orm");
let UsersService = class UsersService {
    async getMe(userId) {
        const [user] = await client_1.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.id, userId));
        const [preferences] = await client_1.db
            .select()
            .from(preferences_1.userPreferences)
            .where((0, drizzle_orm_1.eq)(preferences_1.userPreferences.userId, userId));
        return {
            id: user.id,
            email: user.email,
            preferredName: user.preferredName,
            ageConfirmed: user.ageConfirmed,
            onboardingCompleted: !!preferences?.onboardingCompletedAt,
        };
    }
    async completeOnboarding(userId, payload) {
        await client_1.db
            .update(users_1.users)
            .set({
            ageConfirmed: payload.ageConfirmed,
            preferredName: payload.preferredName,
        })
            .where((0, drizzle_orm_1.eq)(users_1.users.id, userId));
        const [existing] = await client_1.db
            .select()
            .from(preferences_1.userPreferences)
            .where((0, drizzle_orm_1.eq)(preferences_1.userPreferences.userId, userId));
        const values = {
            userId,
            motivations: payload.motivations,
            baselineMood: payload.baselineMood,
            reflectionPreference: payload.reflectionPreference,
            timeCommitment: payload.timeCommitment,
            notificationsEnabled: payload.notificationsEnabled,
            onboardingCompletedAt: new Date(),
        };
        if (existing) {
            await client_1.db.update(preferences_1.userPreferences).set(values).where((0, drizzle_orm_1.eq)(preferences_1.userPreferences.userId, userId));
        }
        else {
            await client_1.db.insert(preferences_1.userPreferences).values(values);
        }
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map