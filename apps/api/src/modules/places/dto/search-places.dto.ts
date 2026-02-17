import { IsString, IsOptional, IsNumber, IsEnum, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlaceCategory } from '@trip-path/shared-types';

/**
 * 장소 검색 DTO
 * 설계서 Section 6.5: GET /places/search
 * BR-CON-009: 검색 키워드 최소 2자
 */
export class SearchPlacesDto {
  @ApiProperty({ example: '센소지', description: '검색 키워드 (최소 2자)' })
  @IsString()
  @MinLength(2)
  q: string;

  @ApiPropertyOptional({ enum: PlaceCategory })
  @IsOptional()
  @IsEnum(PlaceCategory)
  category?: PlaceCategory;

  @ApiPropertyOptional({ description: '중심 위도' })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ description: '중심 경도' })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ default: 5, description: '검색 반경 (km)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  radius?: number = 5;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit?: number = 10;
}
