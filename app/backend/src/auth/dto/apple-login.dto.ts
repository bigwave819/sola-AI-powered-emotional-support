import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AppleLoginDto {
  @ApiProperty({ description: 'Apple identity token from the mobile client' })
  @IsString()
  identityToken!: string;
}