export declare class InsightsService {
    suggestedReminderHour(userId: string): Promise<number>;
    weekly(userId: string): Promise<{
        averageMood: number | null;
        moodTrend: {
            score: number;
            date: Date;
        }[];
        journalCount: number;
        currentStreak: number;
        topTags: string[];
    }>;
    private computeStreak;
}
