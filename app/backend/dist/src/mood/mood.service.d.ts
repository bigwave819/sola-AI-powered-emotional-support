interface CreateMoodPayload {
    score: number;
    tags?: string[];
    note?: string;
}
export declare class MoodService {
    create(userId: string, payload: CreateMoodPayload): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tags: string[] | null;
        score: number;
        note: string | null;
    }>;
    history(userId: string, limit?: number): Promise<{
        id: string;
        userId: string;
        score: number;
        tags: string[] | null;
        note: string | null;
        createdAt: Date;
    }[]>;
}
export {};
