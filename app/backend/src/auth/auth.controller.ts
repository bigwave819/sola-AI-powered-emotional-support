import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AppleLoginDto } from './dto/apple-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

// NOTE: no @ApiBearerAuth on this controller — every route here is
// pre-authentication (used to *obtain* tokens, not to call with them).
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  @ApiOperation({ summary: 'Sign in with a Google identity token' })
  @ApiResponse({ status: 201, description: 'Tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  loginWithGoogle(@Body() dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto.idToken);
  }

  @Post('apple')
  @ApiOperation({ summary: 'Sign in with an Apple identity token' })
  @ApiResponse({ status: 201, description: 'Tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid Apple token' })
  loginWithApple(@Body() dto: AppleLoginDto) {
    return this.authService.loginWithApple(dto.identityToken);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rotate a refresh token into a new access/refresh pair' })
  @ApiResponse({ status: 201, description: 'New tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('otp/request')
  @ApiOperation({ summary: 'Email a 6-digit OTP code to the given address' })
  @ApiResponse({ status: 201, description: 'Code sent' })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.email);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify a 6-digit OTP code and issue tokens' })
  @ApiResponse({ status: 201, description: 'Tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid or expired code' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.code);
  }
}