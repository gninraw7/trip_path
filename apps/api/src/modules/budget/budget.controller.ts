import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * 예산 컨트롤러
 * 설계서 Section 6.7: 예산 API
 */
@ApiTags('Budget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('trips/:tripId/budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  /** GET /trips/:tripId/budget - 예산 조회 */
  @Get()
  @ApiOperation({ summary: '예산 조회' })
  async getBudget(@Param('tripId') tripId: string) {
    return this.budgetService.getBudget(tripId);
  }

  /** POST /trips/:tripId/budget - 예산 항목 추가 */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '예산 항목 추가' })
  async addBudget(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBudgetDto,
  ) {
    return this.budgetService.addBudget(tripId, userId, dto);
  }
}
