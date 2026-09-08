export declare class HomeService {
    getSummary(userId: string): Promise<{
        greetingName: string | null;
        latestMood: {
            score: number;
            createdAt: Date;
        } | null;
        continueJournal: {
            id: string;
            bodyPreview: string;
        } | null;
        resurfacedEntry: {
            id: string;
            bodyPreview: string;
            createdAt: Date;
        } | null;
        suggestedExercise: {
            id: string;
            title: string;
            durationMin: number;
        };
    }>;
}
