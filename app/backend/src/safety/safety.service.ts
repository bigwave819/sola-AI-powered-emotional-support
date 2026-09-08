import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { safetyEvents } from '../db/schema/safety';

@Injectable()
export class SafetyService {
  async logEvent(userId: string, context: string) {
    // Metadata only — the actual journal text is NEVER passed to this method,
    // by design, so there's no way for it to accidentally get logged here.
    await db.insert(safetyEvents).values({ userId, context });
  }

  // Region-aware later — hardcoded to US for now, matches your commercial focus
  getCrisisResources() {
    return [
      { label: 'Call or text 988', description: 'Suicide & Crisis Lifeline (US), available 24/7' },
      { label: 'Text HOME to 741741', description: 'Crisis Text Line, free and confidential' },
      { label: 'Call 911', description: 'For immediate emergency danger' },
    ];
  }
}