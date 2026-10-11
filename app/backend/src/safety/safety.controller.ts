import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SafetyService } from './safety.service';

@ApiTags('safety')
@Controller('safety')
@UseGuards(JwtAuthGuard)
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Get('resources')
  @ApiOperation({ summary: 'Get crisis support resources' })
  @ApiResponse({ status: 200, description: 'List of crisis resources' })
  getResources() {
    return this.safetyService.getCrisisResources();
  }
}