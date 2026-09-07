import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get()
  list() {
    return this.exercisesService.list();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.exercisesService.getOne(id);
  }

  @Post(':id/complete')
  complete(@Req() req: any, @Param('id') id: string, @Body('durationSeconds') durationSeconds: number) {
    return this.exercisesService.complete(req.user.userId, id, durationSeconds);
  }
}