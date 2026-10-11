import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InsightsService } from './insights.service';

@ApiTags('insights')
@ApiBearerAuth()
@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private insightsService: InsightsService) { }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly mood/journal insights for the current user' })
  @ApiResponse({ status: 200, description: 'Weekly insight summary' })
  weekly(@Req() req: any) {
    return this.insightsService.weekly(req.user.userId);
  }

  @Get('suggested-reminder-hour')
  @ApiOperation({ summary: 'Suggest an hour of day for check-in reminders, based on the user\u2019s history' })
  @ApiResponse({ status: 200, description: 'Suggested reminder hour' })
  suggestedReminderHour(@Req() req: any) {
    return this.insightsService.suggestedReminderHour(req.user.userId);
  }
}