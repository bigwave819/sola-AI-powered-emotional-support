import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { CompleteExerciseDto } from './dto/complete-exercise.dto';

@ApiTags('exercises')
@ApiBearerAuth()
@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'List all exercises in the library' })
  @ApiResponse({ status: 200, description: 'List of exercises' })
  list() {
    return this.exercisesService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single exercise by id' })
  @ApiParam({ name: 'id', description: 'Exercise id' })
  @ApiResponse({ status: 200, description: 'The exercise' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  getOne(@Param('id') id: string) {
    return this.exercisesService.getOne(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Record a completed exercise session for the current user' })
  @ApiParam({ name: 'id', description: 'Exercise id' })
  @ApiResponse({ status: 201, description: 'Session recorded' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  complete(@Req() req: any, @Param('id') id: string, @Body() dto: CompleteExerciseDto) {
    return this.exercisesService.complete(req.user.userId, id, dto.durationSeconds);
  }
}