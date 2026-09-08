import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    webhook(authHeader: string, body: any): Promise<{
        received: boolean;
    }>;
    getMine(req: any): Promise<{
        tier: "free";
        status?: undefined;
    } | {
        tier: "free" | "plus";
        status: string;
    }>;
}
