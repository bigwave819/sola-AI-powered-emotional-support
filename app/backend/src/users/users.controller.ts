import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('me/onboarding')
  completeOnboarding(@Req() req: any, @Body() body: any) {
    // req.user.userId comes from JwtStrategy.validate() — never trust a userId from the body
    return this.usersService.completeOnboarding(req.user.userId, body);
  }
}