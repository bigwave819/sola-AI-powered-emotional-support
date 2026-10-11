import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Patch('me/onboarding')
  @ApiOperation({ summary: 'Submit onboarding answers for the current user' })
  @ApiResponse({ status: 200, description: 'Onboarding saved' })
  completeOnboarding(@Req() req: any, @Body() dto: CompleteOnboardingDto) {
    // req.user.userId comes from JwtStrategy.validate() — never trust a userId from the body
    return this.usersService.completeOnboarding(req.user.userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile and onboarding status' })
  @ApiResponse({ status: 200, description: 'User profile' })
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.userId);
  }
}