import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 토큰 갱신 DTO
 * 설계서 Section 6.2: POST /auth/refresh
 */
export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh Token' })
  @IsString()
  refreshToken: string;
}
