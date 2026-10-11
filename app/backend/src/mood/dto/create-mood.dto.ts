import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsArray, IsString, MaxLength } from 'class-validator';

export class CreateMoodDto {
  @ApiProperty({ minimum: 1, maximum: 10, description: 'Mood score, 1 (lowest) to 10 (highest)' })
  @IsInt()
  @Min(1)
  @Max(10)
  score!: number;

  @ApiPropertyOptional({ type: [String], example: ['work', 'sleep'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
