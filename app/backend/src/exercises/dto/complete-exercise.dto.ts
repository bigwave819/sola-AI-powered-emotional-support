import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

// Min/Max bounds are my choice — the service currently accepts any number.
export class CompleteExerciseDto {
  @ApiProperty({ description: 'How long the exercise session lasted, in seconds', minimum: 0, maximum: 86400 })
  @IsInt()
  @Min(0)
  @Max(86400)
  durationSeconds!: number;
}