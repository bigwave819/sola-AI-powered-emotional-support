import { UsersService } from './users.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    completeOnboarding(req: any, dto: CompleteOnboardingDto): Promise<{
        success: boolean;
    }>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        preferredName: string | null;
        ageConfirmed: boolean;
        onboardingCompleted: boolean;
    }>;
}
