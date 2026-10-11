import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateJournalDto {
  @ApiProperty({ description: 'The journal entry text', maxLength: 20000 })
  @IsString()
  @MaxLength(20000)
  body!: string;
}