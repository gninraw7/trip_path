import { apiClient } from '../api-client';
import type {
  ApiResponse,
  PaginatedResponse,
  Trip,
  TripSummary,
  CreateTripRequest,
  UpdateTripRequest,
  AddTripPlaceRequest,
  ReorderPlacesRequest,
  CloneTripRequest,
  LikeResponse,
  OptimizeRouteRequest,
  OptimizeRouteResponse,
  TripPlace,
} from '@trip-path/shared-types';

/**
 * Trips API 클라이언트 함수
 * 설계서 Section 6.4: 여행 경로 API
 */

/** POST /trips */
export async function createTrip(data: CreateTripRequest) {
  return apiClient.post<ApiResponse<Trip>>('/trips', data);
}

/** GET /trips/:tripId */
export async function getTrip(tripId: string) {
  return apiClient.get<ApiResponse<Trip>>(`/trips/${tripId}`);
}

/** PATCH /trips/:tripId */
export async function updateTrip(tripId: string, data: UpdateTripRequest) {
  return apiClient.patch<ApiResponse<Trip>>(`/trips/${tripId}`, data);
}

/** DELETE /trips/:tripId */
export async function deleteTrip(tripId: string) {
  return apiClient.delete<void>(`/trips/${tripId}`);
}

/** GET /trips */
export async function getTrips(params?: Record<string, string | number | boolean | undefined>) {
  return apiClient.get<PaginatedResponse<TripSummary>>('/trips', params);
}

/** POST /trips/:tripId/days/:dayId/places */
export async function addTripPlace(tripId: string, dayId: string, data: AddTripPlaceRequest) {
  return apiClient.post<ApiResponse<TripPlace>>(`/trips/${tripId}/days/${dayId}/places`, data);
}

/** PUT /trips/:tripId/days/:dayId/places/reorder */
export async function reorderPlaces(tripId: string, dayId: string, data: ReorderPlacesRequest) {
  return apiClient.put<ApiResponse<TripPlace[]>>(`/trips/${tripId}/days/${dayId}/places/reorder`, data);
}

/** POST /trips/:tripId/clone */
export async function cloneTrip(tripId: string, data?: CloneTripRequest) {
  return apiClient.post<ApiResponse<Trip>>(`/trips/${tripId}/clone`, data);
}

/** POST /trips/:tripId/like */
export async function toggleLike(tripId: string) {
  return apiClient.post<ApiResponse<LikeResponse>>(`/trips/${tripId}/like`);
}

/** POST /trips/:tripId/route/optimize */
export async function optimizeRoute(tripId: string, data: OptimizeRouteRequest) {
  return apiClient.post<ApiResponse<OptimizeRouteResponse>>(`/trips/${tripId}/route/optimize`, data);
}
