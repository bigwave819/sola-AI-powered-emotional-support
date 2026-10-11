import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({ description: 'Google identity token (ID token) from the mobile client' })
  @IsString()
  idToken!: string;
}