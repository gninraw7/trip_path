import { IsArray, ValidateNested, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PlaceOrderItem {
  @ApiProperty()
  @IsString()
  tripPlaceId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  orderIndex: number;
}

/**
 * 장소 순서 변경 DTO
 * 설계서 Section 6.4: PUT /trips/{tripId}/days/{dayId}/places/reorder
 */
export class ReorderPlacesDto {
  @ApiProperty({ type: [PlaceOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItem)
  placeOrders: PlaceOrderItem[];
}
