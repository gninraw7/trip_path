import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransportMode } from '@trip-path/shared-types';

/**
 * 장소 추가 DTO
 * 설계서 Section 6.4: POST /trips/{tripId}/days/{dayId}/places
 * BR-PLACE-001: 일별 최대 20개
 * BR-PLACE-002: 중복 장소 경고 (force 파라미터)
 */
export class AddTripPlaceDto {
  @ApiProperty({ description: '장소 UUID' })
  @IsString()
  placeId: string;

  @ApiProperty({ example: 0, description: '방문 순서 (0부터 시작)' })
  @IsNumber()
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({ example: '10:00' })
  @IsOptional()
  @IsString()
  visitTime?: string;

  @ApiPropertyOptional({ example: 90, description: '체류 시간(분)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stayDurationMin?: number;

  @ApiPropertyOptional({ enum: TransportMode })
  @IsOptional()
  @IsEnum(TransportMode)
  transportMode?: TransportMode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ default: false, description: '중복 장소 강제 추가' })
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}
