import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TripVisibility, TripStatus, TripSortBy, SortOrder } from '@trip-path/shared-types';

/**
 * 여행 목록 쿼리 DTO
 * 설계서 Section 6.4: GET /trips
 */
export class QueryTripsDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: TripVisibility })
  @IsOptional()
  @IsEnum(TripVisibility)
  visibility?: TripVisibility;

  @ApiPropertyOptional({ enum: TripStatus })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ enum: TripSortBy, default: TripSortBy.CREATED_AT })
  @IsOptional()
  @IsEnum(TripSortBy)
  sort?: TripSortBy = TripSortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
