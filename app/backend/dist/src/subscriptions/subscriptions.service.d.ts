export declare class SubscriptionsService {
    handleWebhookEvent(event: any): Promise<void>;
    getEntitlement(userId: string): Promise<{
        tier: "free";
        status?: undefined;
    } | {
        tier: "free" | "plus";
        status: string;
    }>;
}
