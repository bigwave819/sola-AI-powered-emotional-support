import { Injectable } from '@nestjs/common';
import { AiProvider, ReflectionRequest, ReflectionResult } from './ai-provider.interface';

// Deterministic — used only in tests. Triggers "safety" by a magic phrase
// so tests can control the outcome without depending on a real model's judgment.
const SAFETY_TRIGGER_PHRASE = 'TRIGGER_SAFETY_TEST';

@Injectable()
export class FakeAiProvider implements AiProvider {
  async generateReflection(req: ReflectionRequest): Promise<ReflectionResult> {
    return {
      reflectionText: `[fake reflection for: ${req.journalText.slice(0, 20)}]`,
      flaggedForSafety: req.journalText.includes(SAFETY_TRIGGER_PHRASE),
    };
  }

  async detectSafetyRisk(text: string): Promise<boolean> {
    return text.includes(SAFETY_TRIGGER_PHRASE);
  }
}

export { SAFETY_TRIGGER_PHRASE };