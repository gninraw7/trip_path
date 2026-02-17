'use client';

import { useQuery } from '@tanstack/react-query';
import { budgetApi } from '../../lib/api';
import { formatCurrency, calculateBudgetUsageRate } from '@trip-path/shared-utils';

/**
 * 예산 개요 컴포넌트
 * 설계서 Section 6.7: GET /trips/{tripId}/budget
 * BR-BUDGET-001: 예산 80% 경고, 100% 초과 알림
 * TODO: recharts 차트 시각화 추가
 */
interface BudgetOverviewProps {
  tripId: string;
}

export function BudgetOverview({ tripId }: BudgetOverviewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['budget', tripId],
    queryFn: () => budgetApi.getBudget(tripId),
  });

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-muted rounded-lg" />;
  }

  if (!data?.data) return null;

  const budget = data.data;
  const isWarning = budget.usageRate >= 80;
  const isExceeded = budget.usageRate >= 100;

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold">예산 관리</h3>

      {/* 전체 예산 현황 */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>총 예산</span>
          <span>{formatCurrency(budget.totalBudget, budget.currency)}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              isExceeded ? 'bg-destructive' : isWarning ? 'bg-yellow-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(budget.usageRate, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>사용: {formatCurrency(budget.totalSpent, budget.currency)}</span>
          <span>잔여: {formatCurrency(budget.remainingBudget, budget.currency)}</span>
        </div>
        {isWarning && !isExceeded && (
          <p className="text-xs text-yellow-600 mt-1">예산의 80%를 사용했습니다.</p>
        )}
        {isExceeded && (
          <p className="text-xs text-destructive mt-1">예산을 초과했습니다!</p>
        )}
      </div>

      {/* 카테고리별 예산 */}
      <div className="space-y-2">
        {budget.categories.map((cat) => (
          <div key={cat.id} className="flex justify-between text-sm">
            <span>{cat.category}</span>
            <span>
              {formatCurrency(Number(cat.actualAmount), budget.currency)} /{' '}
              {formatCurrency(Number(cat.plannedAmount), budget.currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
