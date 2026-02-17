import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 회원가입 DTO
 * 설계서 Section 6.2: POST /auth/register
 * BR-CON-001: 사용자명 유니크 제약 (영문, 숫자, 언더스코어, 3~30자)
 * BR-CON-002: 비밀번호 복잡도 제약
 */
export class RegisterDto {
  @ApiProperty({ example: 'tripplanner', description: '사용자명 (3~30자, 영문/숫자/언더스코어)' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '사용자명은 영문, 숫자, 언더스코어만 허용됩니다.' })
  username: string;

  @ApiProperty({ example: 'user@example.com', description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: '비밀번호 (최소 8자, 대소문자+숫자+특수문자)' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 각 1개 이상 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({ example: '여행 플래너', description: '표시 이름' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayName: string;
}
