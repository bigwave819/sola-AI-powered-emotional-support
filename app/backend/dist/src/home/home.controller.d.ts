import { HomeService } from './home.service';
export declare class HomeController {
    private homeService;
    constructor(homeService: HomeService);
    getSummary(req: any): Promise<{
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
