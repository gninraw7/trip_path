import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse, Notification, NotificationListParams } from '@trip-path/shared-types';

/**
 * Notifications API 클라이언트 함수
 * 설계서 Section 6.9: 알림 API
 */

/** GET /notifications */
export async function getNotifications(params?: NotificationListParams) {
  return apiClient.get<PaginatedResponse<Notification>>('/notifications', params as any);
}

/** PATCH /notifications/read-all */
export async function markAllNotificationsRead() {
  return apiClient.patch<void>('/notifications/read-all');
}
