import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    completeOnboarding(req: any, body: any): Promise<{
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
