import { Injectable } from '@nestjs/common';
import { db } from '../db/client';
import { users } from '../db/schema/users';
import { userPreferences } from '../db/schema/preferences';
import { eq } from 'drizzle-orm';

interface OnboardingPayload {
  ageConfirmed: boolean;
  motivations: string[];
  baselineMood: number;
  reflectionPreference: string;
  timeCommitment: string;
  notificationsEnabled: boolean;
  preferredName?: string;
}

@Injectable()
export class UsersService {
  async completeOnboarding(userId: string, payload: OnboardingPayload) {
    await db
      .update(users)
      .set({
        ageConfirmed: payload.ageConfirmed,
        preferredName: payload.preferredName,
      })
      .where(eq(users.id, userId));

    const [existing] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    const values = {
      userId,
      motivations: payload.motivations,
      baselineMood: payload.baselineMood,
      reflectionPreference: payload.reflectionPreference,
      timeCommitment: payload.timeCommitment,
      notificationsEnabled: payload.notificationsEnabled,
      onboardingCompletedAt: new Date(),
    };

    if (existing) {
      await db.update(userPreferences).set(values).where(eq(userPreferences.userId, userId));
    } else {
      await db.insert(userPreferences).values(values);
    }

    return { success: true };
  }
}