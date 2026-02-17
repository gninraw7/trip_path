import { IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BudgetCategory } from '@trip-path/shared-types';

/**
 * 예산 항목 추가 DTO
 * 설계서 Section 6.7: POST /trips/{tripId}/budget
 * BR-BUDGET-001: 카테고리별 예산 합계 <= 총 예산
 */
export class CreateBudgetDto {
  @ApiProperty({ enum: BudgetCategory, example: BudgetCategory.ACCOMMODATION })
  @IsEnum(BudgetCategory)
  category: BudgetCategory;

  @ApiProperty({ example: 400000 })
  @IsNumber()
  @Min(0)
  plannedAmount: number;
}
