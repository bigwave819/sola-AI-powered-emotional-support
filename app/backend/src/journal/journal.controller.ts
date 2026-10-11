import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JournalService } from './journal.service';
import { UpdateJournalDto } from './dto/update-journal.dto';

@ApiTags('journal')
@ApiBearerAuth()
@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private journalService: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new draft journal entry' })
  @ApiResponse({ status: 201, description: 'Draft entry created' })
  create(@Req() req: any, @Query('moodEntryId') moodEntryId?: string) {
    return this.journalService.create(req.user.userId, moodEntryId);
  }

  @Get()
  @ApiOperation({ summary: 'List all finalized (non-draft) journal entries for the current user' })
  @ApiResponse({ status: 200, description: 'List of journal entries' })
  list(@Req() req: any) {
    return this.journalService.list(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single journal entry by id' })
  @ApiParam({ name: 'id', description: 'Journal entry id' })
  @ApiResponse({ status: 200, description: 'The journal entry' })
  @ApiResponse({ status: 403, description: 'Entry belongs to a different user' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  getOne(@Req() req: any, @Param('id') id: string) {
    return this.journalService.getOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the text body of a draft journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry id' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateJournalDto) {
    return this.journalService.update(req.user.userId, id, dto.body);
  }

  @Post(':id/finalize')
  @ApiOperation({ summary: 'Mark a journal entry as finalized (no longer a draft)' })
  @ApiParam({ name: 'id', description: 'Journal entry id' })
  finalize(@Req() req: any, @Param('id') id: string) {
    return this.journalService.finalize(req.user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently delete a journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry id' })
  delete(@Req() req: any, @Param('id') id: string) {
    return this.journalService.delete(req.user.userId, id);
  }

  @Post(':id/reflect')
  @ApiOperation({ summary: 'Request an AI reflection on this journal entry (counts against monthly AI quota)' })
  @ApiParam({ name: 'id', description: 'Journal entry id' })
  @ApiResponse({ status: 201, description: 'Reflection generated' })
  @ApiResponse({ status: 403, description: 'AI_QUOTA_EXCEEDED — monthly reflection limit reached for this tier' })
  reflect(@Req() req: any, @Param('id') id: string) {
    return this.journalService.reflect(req.user.userId, id);
  }
}