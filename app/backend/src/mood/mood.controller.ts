import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @ApiOperation({ summary: "List the current user's mood check-in history" })
  @ApiResponse({ status: 200, description: 'List of mood entries' })
  history(@Req() req: any) {
    return this.moodService.history(req.user.userId);
  }
}