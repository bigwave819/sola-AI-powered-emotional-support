import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SafetyService } from './safety.service';

@Controller('safety')
@UseGuards(JwtAuthGuard)
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Get('resources')
  getResources() {
    return this.safetyService.getCrisisResources();
  }
}