import type { AiProvider } from '../ai/ai-provider.interface';
import { SafetyService } from '../safety/safety.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
export declare class JournalService {
    private aiProvider;
    private safetyService;
    private subscriptionsService;
    constructor(aiProvider: AiProvider, safetyService: SafetyService, subscriptionsService: SubscriptionsService);
    create(userId: string, moodEntryId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        updatedAt: Date;
    }>;
    update(userId: string, entryId: string, body: string): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    finalize(userId: string, entryId: string): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(userId: string, entryId: string): Promise<{
        success: boolean;
    }>;
    list(userId: string): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getOne(userId: string, entryId: string): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reflect(userId: string, entryId: string): Promise<{
        reflectionText: string;
        flaggedForSafety: boolean;
    }>;
    private assertOwnership;
    private assertAiQuotaAvailable;
}
