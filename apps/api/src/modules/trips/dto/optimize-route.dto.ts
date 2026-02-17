import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransportMode } from '@trip-path/shared-types';

/**
 * 경로 최적화 DTO
 * 설계서 Section 6.4: POST /trips/{tripId}/route/optimize
 */
export class OptimizeRouteDto {
  @ApiProperty({ description: '최적화할 일차 ID' })
  @IsString()
  dayId: string;

  @ApiProperty({ enum: TransportMode })
  @IsEnum(TransportMode)
  transportMode: TransportMode;

  @ApiProperty({ enum: ['DISTANCE', 'DURATION'] })
  @IsString()
  optimizeFor: 'DISTANCE' | 'DURATION';
}
