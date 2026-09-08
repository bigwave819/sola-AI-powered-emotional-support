import { InsightsService } from './insights.service';
export declare class InsightsController {
    private insightsService;
    constructor(insightsService: InsightsService);
    weekly(req: any): Promise<{
        averageMood: number | null;
        moodTrend: {
            score: number;
            date: Date;
        }[];
        journalCount: number;
        currentStreak: number;
        topTags: string[];
    }>;
    suggestedReminderHour(req: any): Promise<number>;
}
