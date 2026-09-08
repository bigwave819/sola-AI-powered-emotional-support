"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const subscriptions_1 = require("../db/schema/subscriptions");
const drizzle_orm_1 = require("drizzle-orm");
const ACTIVE_EVENTS = ['INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'PRODUCT_CHANGE'];
const GRACE_EVENTS = ['BILLING_ISSUE'];
const ENDED_EVENTS = ['CANCELLATION', 'EXPIRATION'];
let SubscriptionsService = class SubscriptionsService {
    async handleWebhookEvent(event) {
        const userId = event.app_user_id;
        const eventType = event.type;
        const productId = event.product_id ?? null;
        const expirationMs = event.expiration_at_ms;
        let status;
        if (ACTIVE_EVENTS.includes(eventType))
            status = 'active';
        else if (GRACE_EVENTS.includes(eventType))
            status = 'grace_period';
        else if (ENDED_EVENTS.includes(eventType))
            status = 'expired';
        else
            return;
        const [existing] = await client_1.db.select().from(subscriptions_1.subscriptions).where((0, drizzle_orm_1.eq)(subscriptions_1.subscriptions.userId, userId));
        const values = {
            userId,
            status,
            productId,
            currentPeriodEndsAt: expirationMs ? new Date(expirationMs) : null,
            updatedAt: new Date(),
        };
        if (existing) {
            await client_1.db.update(subscriptions_1.subscriptions).set(values).where((0, drizzle_orm_1.eq)(subscriptions_1.subscriptions.userId, userId));
        }
        else {
            await client_1.db.insert(subscriptions_1.subscriptions).values(values);
        }
    }
    async getEntitlement(userId) {
        const [record] = await client_1.db.select().from(subscriptions_1.subscriptions).where((0, drizzle_orm_1.eq)(subscriptions_1.subscriptions.userId, userId));
        if (!record)
            return { tier: 'free' };
        const isActive = (record.status === 'active' || record.status === 'grace_period') &&
            (!record.currentPeriodEndsAt || record.currentPeriodEndsAt > new Date());
        return { tier: isActive ? 'plus' : 'free', status: record.status };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)()
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map