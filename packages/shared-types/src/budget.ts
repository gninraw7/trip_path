import { BudgetCategory } from './enums';

/** 예산 항목 (설계서 Section 5.2 budgets 테이블) */
export interface Budget {
  id: string;
  tripId: string;
  category: BudgetCategory;
  plannedAmount: number;
  actualAmount: number;
  usageRate: number;
}

/** 예산 전체 조회 응답 (GET /trips/{tripId}/budget) */
export interface BudgetSummary {
  totalBudget: number;
  currency: string;
  totalSpent: number;
  remainingBudget: number;
  usageRate: number;
  categories: Budget[];
}

/** 예산 항목 추가 요청 (POST /trips/{tripId}/budget) */
export interface CreateBudgetRequest {
  category: BudgetCategory;
  plannedAmount: number;
}

/** 예산 항목 수정 요청 */
export interface UpdateBudgetRequest {
  plannedAmount?: number;
  actualAmount?: number;
}
