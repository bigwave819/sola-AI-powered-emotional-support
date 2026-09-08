export interface ReflectionRequest {
    journalText: string;
    reflectionStylePreference?: string | null;
    preferredName?: string | null;
}
export interface ReflectionResult {
    reflectionText: string;
    flaggedForSafety: boolean;
}
export interface AiProvider {
    generateReflection(req: ReflectionRequest): Promise<ReflectionResult>;
    detectSafetyRisk(text: string): Promise<boolean>;
}
