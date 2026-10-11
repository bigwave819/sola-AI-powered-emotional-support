import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ description: 'Email address to send the OTP code to', example: 'user@example.com' })
  @IsEmail()
  email!: string;
}
