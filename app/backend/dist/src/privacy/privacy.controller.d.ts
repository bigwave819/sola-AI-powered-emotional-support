import { PrivacyService } from './privacy.service';
export declare class PrivacyController {
    private privacyService;
    constructor(privacyService: PrivacyService);
    export(req: any): Promise<{
        exportedAt: string;
        account: {
            email: string;
            preferredName: string | null;
            memberSince: Date;
        };
        preferences: {
            id: string;
            userId: string;
            motivations: string[] | null;
            baselineMood: number | null;
            reflectionPreference: string | null;
            timeCommitment: string | null;
            notificationsEnabled: boolean;
            onboardingCompletedAt: Date | null;
            createdAt: Date;
        };
        moodCheckIns: {
            score: number;
            tags: string[] | null;
            note: string | null;
            date: Date;
        }[];
        journalEntries: {
            body: string;
            aiReflection: string | null;
            date: Date;
        }[];
        exerciseSessions: {
            exerciseId: string;
            durationSeconds: number;
            completedAt: Date;
        }[];
    }>;
    deleteAccount(req: any): Promise<{
        deleted: boolean;
        deletedAt: string;
    }>;
}
