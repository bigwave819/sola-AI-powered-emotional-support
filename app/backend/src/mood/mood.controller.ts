import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@ApiTags('mood')
@ApiBearerAuth()
@Controller('mood')
@UseGuards(JwtAuthGuard)
export class MoodController {
  constructor(private moodService: MoodService) {}

  @Post()
  @ApiOperation({ summary: 'Create a mood check-in entry' })
  @ApiResponse({ status: 201, description: 'Mood entry created' })
  create(@Req() req: any, @Body() dto: CreateMoodDto) {
    return this.moodService.create(req.user.userId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: "List the current user's mood check-in history (newest first)" })
  @ApiQuery({ name: 'limit', required: false, description: 'Max entries to return (1-500, default 30)' })
  @ApiResponse({ status: 200, description: 'List of mood entries' })
  history(@Req() req: any, @Query('limit') limit?: string) {
    const n = Number.parseInt(limit ?? '', 10);
    const safe = Number.isFinite(n) ? Math.min(Math.max(n, 1), 500) : 30;
    return this.moodService.history(req.user.userId, safe);
  }
}