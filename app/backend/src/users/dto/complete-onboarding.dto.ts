import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsArray, IsString, IsOptional, Max, Min, MaxLength, IsIn } from 'class-validator';

// Field names/shapes mirror the OnboardingPayload interface in users.service.ts.
export class CompleteOnboardingDto {
  @ApiProperty({ description: 'Confirm the user is of required age' })
  @IsBoolean()
  ageConfirmed!: boolean;

  @ApiProperty({ description: 'What the user wants from Sola', type: [String] })
  @IsArray()
  @IsString({ each: true })
  motivations!: string[];

  @ApiProperty({ description: 'Starting mood score', minimum: 1, maximum: 10 })
  @IsInt()
  @Min(1)
  @Max(10)
  baselineMood!: number;

  @ApiProperty({ description: 'Preferred AI reflection style', enum: ['writing', 'talking', 'quick', 'guided'], example: 'writing' })
  @IsString()
  @IsIn(['writing', 'talking', 'quick', 'guided'])
  reflectionPreference!: string;

  @ApiProperty({ description: 'How much time the user commits', enum: ['2min', '5min', '10min', 'whenever'], example: '5min' })
  @IsString()
  @IsIn(['2min', '5min', '10min', 'whenever'])
  timeCommitment!: string;

  @ApiProperty({ description: 'Whether notifications are enabled' })
  @IsBoolean()
  notificationsEnabled!: boolean;

  @ApiProperty({ description: 'What Sola should call the user', required: false, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  preferredName?: string;
}