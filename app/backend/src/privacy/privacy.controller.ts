import { Controller, Delete, Get, Req, UseGuards, Header } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrivacyService } from './privacy.service';

@Controller('privacy')
@UseGuards(JwtAuthGuard)
export class PrivacyController {
  constructor(private privacyService: PrivacyService) {}

  @Get('export')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="sola-export.json"')
  export(@Req() req: any) {
    return this.privacyService.exportUserData(req.user.userId);
  }

  @Delete('account')
  deleteAccount(@Req() req: any) {
    return this.privacyService.deleteAccount(req.user.userId);
  }
}