interface OnboardingPayload {
    ageConfirmed: boolean;
    motivations: string[];
    baselineMood: number;
    reflectionPreference: string;
    timeCommitment: string;
    notificationsEnabled: boolean;
    preferredName?: string;
}
export declare class UsersService {
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        preferredName: string | null;
        ageConfirmed: boolean;
        onboardingCompleted: boolean;
    }>;
    completeOnboarding(userId: string, payload: OnboardingPayload): Promise<{
        success: boolean;
    }>;
}
export {};
