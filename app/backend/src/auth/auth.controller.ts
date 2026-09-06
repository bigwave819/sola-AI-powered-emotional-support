import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('magic-link/request')
  requestMagicLink(@Body('email') email: string) {
    return this.authService.requestMagicLink(email);
  }

  @Post('magic-link/verify')
  verifyMagicLink(@Body('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }

  @Post('google')
  loginWithGoogle(@Body('idToken') idToken: string) {
    return this.authService.loginWithGoogle(idToken);
  }

  @Post('apple')
  loginWithApple(@Body('identityToken') identityToken: string) {
    return this.authService.loginWithApple(identityToken);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}