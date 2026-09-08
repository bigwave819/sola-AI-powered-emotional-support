import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InsightsService } from './insights.service';

@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private insightsService: InsightsService) { }

  @Get('weekly')
  weekly(@Req() req: any) {
    return this.insightsService.weekly(req.user.userId);
  }

  @Get('suggested-reminder-hour')
  suggestedReminderHour(@Req() req: any) {
    return this.insightsService.suggestedReminderHour(req.user.userId);
  }
}