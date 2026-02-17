import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../../database/entities/budget.entity';
import { Trip } from '../../database/entities/trip.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';

/**
 * 예산 서비스
 * 설계서 Section 6.7: Budget API
 * BR-BUDGET-001: 예산 설정 및 초과 알림
 * BR-CALC-001: 예산 잔여액/사용률 계산
 */
@Injectable()
export class BudgetService {
  private readonly logger = new Logger(BudgetService.name);

  constructor(
    @InjectRepository(Budget) private budgetRepository: Repository<Budget>,
    @InjectRepository(Trip) private tripsRepository: Repository<Trip>,
  ) {}

  /** GET /trips/:tripId/budget - 예산 조회 */
  async getBudget(tripId: string) {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: '여행 경로를 찾을 수 없습니다.' });
    }

    const categories = await this.budgetRepository.find({ where: { tripId } });

    const totalSpent = categories.reduce((sum, b) => sum + Number(b.actualAmount), 0);
    const totalBudget = Number(trip.totalBudget) || 0;

    return {
      totalBudget,
      currency: trip.currency,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      usageRate: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 1000) / 10 : 0,
      categories: categories.map((b) => ({
        ...b,
        usageRate:
          Number(b.plannedAmount) > 0
            ? Math.round((Number(b.actualAmount) / Number(b.plannedAmount)) * 1000) / 10
            : 0,
      })),
    };
  }

  /** POST /trips/:tripId/budget - 예산 항목 추가 */
  async addBudget(tripId: string, userId: string, dto: CreateBudgetDto) {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: '여행 경로를 찾을 수 없습니다.' });
    }

    // BR-BUDGET-001: 카테고리 합계가 총 예산 초과 검증
    if (trip.totalBudget) {
      const existingBudgets = await this.budgetRepository.find({ where: { tripId } });
      const currentTotal = existingBudgets.reduce((sum, b) => sum + Number(b.plannedAmount), 0);

      if (currentTotal + dto.plannedAmount > Number(trip.totalBudget)) {
        throw new UnprocessableEntityException({
          code: 'BUDGET_CATEGORY_EXCEEDS_TOTAL',
          message: '카테고리별 예산의 합이 총 예산을 초과합니다.',
        });
      }
    }

    const budget = this.budgetRepository.create({
      tripId,
      category: dto.category,
      plannedAmount: dto.plannedAmount,
    });

    return this.budgetRepository.save(budget);
  }
}
