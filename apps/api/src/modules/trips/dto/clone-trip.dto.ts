import { IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 여행 클론 DTO
 * 설계서 Section 6.4: POST /trips/{tripId}/clone
 * BR-SHARE-002: 공개 여행 경로 클론 규칙
 */
export class CloneTripDto {
  @ApiPropertyOptional({ example: '복제된 도쿄 여행' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
