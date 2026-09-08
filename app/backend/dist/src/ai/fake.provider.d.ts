import { AiProvider, ReflectionRequest, ReflectionResult } from './ai-provider.interface';
declare const SAFETY_TRIGGER_PHRASE = "TRIGGER_SAFETY_TEST";
export declare class FakeAiProvider implements AiProvider {
    generateReflection(req: ReflectionRequest): Promise<ReflectionResult>;
    detectSafetyRisk(text: string): Promise<boolean>;
}
export { SAFETY_TRIGGER_PHRASE };
