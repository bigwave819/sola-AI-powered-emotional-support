import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AppleLoginDto } from './dto/apple-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    loginWithGoogle(dto: GoogleLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
    loginWithApple(dto: AppleLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        sent: boolean;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        isNewUser: boolean;
    }>;
}
