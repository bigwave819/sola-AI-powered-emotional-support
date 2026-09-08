export interface ReflectionRequest {
  journalText: string;
  reflectionStylePreference?: string | null; // from onboarding
  preferredName?: string | null;
}

export interface ReflectionResult {
  reflectionText: string;
  flaggedForSafety: boolean;
}

// Any provider (Anthropic, OpenAI, etc.) implements this — nothing outside
// this file should ever import an AI SDK directly.
export interface AiProvider {
  generateReflection(req: ReflectionRequest): Promise<ReflectionResult>;
  detectSafetyRisk(text: string): Promise<boolean>;
}