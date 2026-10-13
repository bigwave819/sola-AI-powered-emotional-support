import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';
export declare class MoodController {
    private moodService;
    constructor(moodService: MoodService);
    create(req: any, dto: CreateMoodDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        score: number;
        tags: string[] | null;
        note: string | null;
    }>;
    history(req: any, limit?: string): Promise<{
        id: string;
        userId: string;
        score: number;
        tags: string[] | null;
        note: string | null;
        createdAt: Date;
    }[]>;
}
