import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JournalService } from './journal.service';

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private journalService: JournalService) {}

  @Post()
  create(@Req() req: any, @Query('moodEntryId') moodEntryId?: string) {
    return this.journalService.create(req.user.userId, moodEntryId);
  }

  @Get()
  list(@Req() req: any) {
    return this.journalService.list(req.user.userId);
  }

  @Get(':id')
  getOne(@Req() req: any, @Param('id') id: string) {
    return this.journalService.getOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body('body') body: string) {
    return this.journalService.update(req.user.userId, id, body);
  }

  @Post(':id/finalize')
  finalize(@Req() req: any, @Param('id') id: string) {
    return this.journalService.finalize(req.user.userId, id);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.journalService.delete(req.user.userId, id);
  }

  @Post(':id/reflect')
  reflect(@Req() req: any, @Param('id') id: string) {
    return this.journalService.reflect(req.user.userId, id);
  }
}