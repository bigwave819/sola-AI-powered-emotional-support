export declare class SafetyService {
    logEvent(userId: string, context: string): Promise<void>;
    getCrisisResources(): {
        label: string;
        description: string;
    }[];
}
