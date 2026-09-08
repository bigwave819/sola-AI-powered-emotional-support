import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    requestMagicLink(email: string): Promise<{
        sent: boolean;
    }>;
    verifyMagicLink(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
    loginWithGoogle(idToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
    loginWithApple(identityToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
}
