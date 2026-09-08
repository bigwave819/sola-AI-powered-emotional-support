import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwt;
    constructor(jwt: JwtService);
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
    private findOrCreateUser;
    private issueTokens;
    refresh(rawRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
}
