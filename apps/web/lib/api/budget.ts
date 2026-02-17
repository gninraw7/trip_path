import { apiClient } from '../api-client';
import type { ApiResponse, BudgetSummary, Budget, CreateBudgetRequest } from '@trip-path/shared-types';

/**
 * Budget API 클라이언트 함수
 * 설계서 Section 6.7: 예산 API
 */

/** GET /trips/:tripId/budget */
export async function getBudget(tripId: string) {
  return apiClient.get<ApiResponse<BudgetSummary>>(`/trips/${tripId}/budget`);
}

/** POST /trips/:tripId/budget */
export async function addBudget(tripId: string, data: CreateBudgetRequest) {
  return apiClient.post<ApiResponse<Budget>>(`/trips/${tripId}/budget`, data);
}
