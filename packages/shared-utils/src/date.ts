/**
 * 날짜 관련 유틸리티
 * 설계서 BR-DATE-001: 여행 날짜 유효성 검증
 * 설계서 BR-TRIP-002: 여행 최대 기간 제한 (90일)
 */

/** 두 날짜 사이의 일 수 계산 */
export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/** 여행 기간 유효성 검증 (BR-TRIP-002: 최소 1일, 최대 90일) */
export function validateTripDuration(startDate: string, endDate: string): {
  valid: boolean;
  message?: string;
} {
  const days = daysBetween(startDate, endDate);

  if (days < 0) {
    return { valid: false, message: '종료일은 시작일과 같거나 이후여야 합니다.' };
  }

  if (days > 90) {
    return { valid: false, message: '여행 기간은 최대 90일입니다.' };
  }

  return { valid: true };
}

/** 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/** 여행 일차 배열 생성 (startDate ~ endDate) */
export function generateDayDates(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  const current = new Date(start);
  while (current <= end) {
    days.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}
