import { IsString, IsOptional, IsNumber, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 통합 검색 DTO
 * 설계서 Section 6.8: GET /search
 * BR-CON-009: 검색 키워드 최소 2자
 */
export class SearchDto {
  @ApiProperty({ description: '검색 키워드 (최소 2자)' })
  @IsString()
  @MinLength(2)
  q: string;

  @ApiPropertyOptional({ description: 'trips/places/users (기본: all)' })
  @IsOptional()
  @IsString()
  type?: 'trips' | 'places' | 'users';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit?: number = 20;
}
