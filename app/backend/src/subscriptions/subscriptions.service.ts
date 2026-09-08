import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { subscriptions } from '../db/schema/subscriptions';
import { eq } from 'drizzle-orm';

// RevenueCat webhook event types we care about — see their docs for the full list
const ACTIVE_EVENTS = ['INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'PRODUCT_CHANGE'];
const GRACE_EVENTS = ['BILLING_ISSUE'];
const ENDED_EVENTS = ['CANCELLATION', 'EXPIRATION'];

@Injectable()
export class SubscriptionsService {
  async handleWebhookEvent(event: any) {
    // RevenueCat sends app_user_id — this MUST be your internal userId,
    // which means the mobile app has to call Purchases.logIn(userId) right
    // after our own auth completes (see mobile section below).
    const userId = event.app_user_id;
    const eventType = event.type;
    const productId = event.product_id ?? null;
    const expirationMs = event.expiration_at_ms;

    let status: string;
    if (ACTIVE_EVENTS.includes(eventType)) status = 'active';
    else if (GRACE_EVENTS.includes(eventType)) status = 'grace_period';
    else if (ENDED_EVENTS.includes(eventType)) status = 'expired';
    else return; // ignore event types we don't act on (e.g. TRANSFER, TEST)

    const [existing] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));

    const values = {
      userId,
      status,
      productId,
      currentPeriodEndsAt: expirationMs ? new Date(expirationMs) : null,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(subscriptions).set(values).where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values(values);
    }
  }

  async getEntitlement(userId: string) {
    const [record] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));

    if (!record) return { tier: 'free' as const };

    const isActive =
      (record.status === 'active' || record.status === 'grace_period') &&
      (!record.currentPeriodEndsAt || record.currentPeriodEndsAt > new Date());

    return { tier: isActive ? ('plus' as const) : ('free' as const), status: record.status };
  }
}