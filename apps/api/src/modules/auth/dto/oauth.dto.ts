import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * OAuth 로그인 DTO
 * 설계서 Section 6.2: POST /auth/oauth/{provider}
 */
export class OAuthDto {
  @ApiProperty({ description: 'OAuth 인가 코드' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'https://trip-path.com/oauth/callback' })
  @IsString()
  redirectUri: string;
}
