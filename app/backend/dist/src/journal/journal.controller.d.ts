import { JournalService } from './journal.service';
export declare class JournalController {
    private journalService;
    constructor(journalService: JournalService);
    create(req: any, moodEntryId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        updatedAt: Date;
    }>;
    list(req: any): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getOne(req: any, id: string): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: any, id: string, body: string): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    finalize(req: any, id: string): Promise<{
        id: string;
        userId: string;
        moodEntryId: string | null;
        body: string;
        isDraft: boolean;
        aiReflectionText: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(req: any, id: string): Promise<{
        success: boolean;
    }>;
    reflect(req: any, id: string): Promise<{
        reflectionText: string;
        flaggedForSafety: boolean;
    }>;
}
