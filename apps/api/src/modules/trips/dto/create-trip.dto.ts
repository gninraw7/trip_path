import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TripVisibility } from '@trip-path/shared-types';

/**
 * 여행 경로 생성 DTO
 * 설계서 Section 6.4: POST /trips
 * BR-TRIP-001: 제목, 시작일, 종료일 필수
 */
export class CreateTripDto {
  @ApiProperty({ example: '도쿄 3박 4일 여행' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: '도쿄의 숨겨진 명소를 찾아서' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-05-04' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 'Japan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  destinationCountry?: string;

  @ApiPropertyOptional({ example: 'Tokyo' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  destinationCity?: string;

  @ApiPropertyOptional({ example: 1500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalBudget?: number;

  @ApiPropertyOptional({ example: 'KRW', default: 'KRW' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ enum: TripVisibility, default: TripVisibility.PRIVATE })
  @IsOptional()
  @IsEnum(TripVisibility)
  visibility?: TripVisibility;
}
