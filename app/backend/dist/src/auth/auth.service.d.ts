import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwt;
    constructor(jwt: JwtService);
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
    requestOtp(email: string): Promise<{
        sent: boolean;
    }>;
    verifyOtp(email: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
    private findOrCreateUser;
    private issueTokens;
    refresh(rawRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
}
