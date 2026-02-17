'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../../../lib/api';

/**
 * 알림 페이지
 * 설계서 Section 6.9: GET /notifications
 */
export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">알림</h1>
        <button
          onClick={() => markAllRead.mutate()}
          className="text-sm text-primary hover:underline"
        >
          모두 읽음 처리
        </button>
      </div>

      {isLoading && <p className="text-muted-foreground">로딩 중...</p>}

      {data?.data && data.data.length === 0 && (
        <p className="text-center text-muted-foreground py-8">알림이 없습니다.</p>
      )}

      <div className="space-y-2">
        {data?.data?.map((notification: any) => (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 ${
              !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
            }`}
          >
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.body}</p>
            <time className="text-xs text-muted-foreground">
              {new Date(notification.createdAt).toLocaleString('ko-KR')}
            </time>
          </div>
        ))}
      </div>
    </div>
  );
}
