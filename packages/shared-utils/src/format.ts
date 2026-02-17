/**
 * 포맷팅 유틸리티
 */

/** 통화 포맷 (예: 1,500,000원) */
export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** 거리 포맷 (km/m) */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/** 시간 포맷 (X시간 Y분) */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

/**
 * 예산 사용률 계산
 * 설계서 BR-CALC-001: 예산 사용률 = (지출 합계 / 총 예산) * 100
 */
export function calculateBudgetUsageRate(spent: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((spent / total) * 1000) / 10;
}

/**
 * 일정 밀도 계산
 * 설계서 BR-CALC-005: 일정 밀도 = 장소 수 / 여행 일수
 */
export function calculateTripDensity(
  placeCount: number,
  dayCount: number,
): { density: number; warning: string | null } {
  if (dayCount <= 0) return { density: 0, warning: null };
  const density = placeCount / dayCount;

  let warning: string | null = null;
  if (density > 7) {
    warning = '일정이 과밀합니다';
  } else if (density < 2) {
    warning = '일정이 여유롭습니다';
  }

  return { density: Math.round(density * 10) / 10, warning };
}
