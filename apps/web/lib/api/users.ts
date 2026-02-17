import { apiClient } from '../api-client';
import type { ApiResponse, MyProfile, PublicProfile, UpdateProfileRequest } from '@trip-path/shared-types';

/**
 * Users API 클라이언트 함수
 * 설계서 Section 6.3: 사용자 API
 */

/** GET /users/me */
export async function getMyProfile() {
  return apiClient.get<ApiResponse<MyProfile>>('/users/me');
}

/** PATCH /users/me */
export async function updateMyProfile(data: UpdateProfileRequest) {
  return apiClient.patch<ApiResponse<MyProfile>>('/users/me', data);
}

/** GET /users/:username */
export async function getPublicProfile(username: string) {
  return apiClient.get<ApiResponse<PublicProfile>>(`/users/${username}`);
}

/** POST /users/:userId/follow */
export async function toggleFollow(userId: string) {
  return apiClient.post<ApiResponse<{ following: boolean }>>(`/users/${userId}/follow`);
}
