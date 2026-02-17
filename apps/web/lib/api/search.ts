import { apiClient } from '../api-client';
import type { ApiResponse, SearchParams, SearchResponse } from '@trip-path/shared-types';

/**
 * Search API 클라이언트 함수
 * 설계서 Section 6.8: 검색 API
 */

/** GET /search */
export async function search(params: SearchParams) {
  return apiClient.get<ApiResponse<SearchResponse>>('/search', params as any);
}
