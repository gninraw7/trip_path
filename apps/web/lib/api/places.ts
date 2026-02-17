import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse, Place, PlaceSearchResult, PlaceSearchParams } from '@trip-path/shared-types';

/**
 * Places API 클라이언트 함수
 * 설계서 Section 6.5: 장소 API
 */

/** GET /places/search */
export async function searchPlaces(params: PlaceSearchParams) {
  return apiClient.get<PaginatedResponse<PlaceSearchResult>>('/places/search', params as any);
}

/** GET /places/:placeId */
export async function getPlace(placeId: string) {
  return apiClient.get<ApiResponse<Place>>(`/places/${placeId}`);
}

/** POST /places/:placeId/favorite */
export async function toggleFavorite(placeId: string) {
  return apiClient.post<ApiResponse<{ favorited: boolean }>>(`/places/${placeId}/favorite`);
}
