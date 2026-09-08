import { AiProvider, ReflectionRequest, ReflectionResult } from './ai-provider.interface';
export declare class GeminiProvider implements AiProvider {
    generateReflection(req: ReflectionRequest): Promise<ReflectionResult>;
    detectSafetyRisk(text: string): Promise<boolean>;
}
