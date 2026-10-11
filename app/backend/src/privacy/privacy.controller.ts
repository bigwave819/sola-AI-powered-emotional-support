import { Controller, Delete, Get, Req, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrivacyService } from './privacy.service';

@ApiTags('privacy')
@ApiBearerAuth()
@Controller('privacy')
@UseGuards(JwtAuthGuard)
export class PrivacyController {
  constructor(private privacyService: PrivacyService) {}

  @Get('export')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="sola-export.json"')
  @ApiOperation({ summary: 'Download a full portable export of the current user\u2019s data (JSON file)' })
  @ApiResponse({ status: 200, description: 'User data export as a downloadable JSON file' })
  export(@Req() req: any) {
    return this.privacyService.exportUserData(req.user.userId);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Permanently delete the current user\u2019s account and all associated data' })
  @ApiResponse({ status: 200, description: 'Account deleted (cascade removes mood, journal, exercises, tokens, safety events)' })
  deleteAccount(@Req() req: any) {
    return this.privacyService.deleteAccount(req.user.userId);
  }
}