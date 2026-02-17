import { NotificationType } from './enums';

/** 알림 (설계서 Section 5.2 notifications 테이블) */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

/** 알림 목록 쿼리 파라미터 */
export interface NotificationListParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}
