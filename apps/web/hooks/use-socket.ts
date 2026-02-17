'use client';

import { useEffect, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../lib/socket';
import { useTripEditorStore } from '../stores/trip-editor.store';
import type { WsServerEvent } from '@trip-path/shared-types';

/**
 * WebSocket 연결 및 실시간 협업 이벤트 훅
 * 설계서 Section 6.10: WebSocket API
 */
export function useCollabSocket(tripId: string | null) {
  const {
    addConnectedUser,
    removeConnectedUser,
    updateCursor,
    addPlaceOptimistic,
    removePlaceOptimistic,
  } = useTripEditorStore();

  useEffect(() => {
    if (!tripId) return;

    const socket = connectSocket();

    // 여행 편집 세션 참여
    socket.emit('trip:join', { tripId });

    // 서버 이벤트 리스너
    socket.on('trip:user_joined', (data: { userId: string; username: string }) => {
      addConnectedUser(data);
    });

    socket.on('trip:user_left', (data: { userId: string }) => {
      removeConnectedUser(data.userId);
    });

    socket.on('place:added', (data: any) => {
      // TODO: 낙관적 업데이트 적용
    });

    socket.on('place:removed', (data: any) => {
      // TODO: 낙관적 업데이트 적용
    });

    socket.on('place:reordered', (data: any) => {
      // TODO: 낙관적 업데이트 적용
    });

    socket.on('cursor:moved', (data: { userId: string; position: unknown }) => {
      updateCursor(data.userId, data.position);
    });

    socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      socket.emit('trip:leave', { tripId });
      socket.off('trip:user_joined');
      socket.off('trip:user_left');
      socket.off('place:added');
      socket.off('place:removed');
      socket.off('place:reordered');
      socket.off('cursor:moved');
      socket.off('error');
    };
  }, [tripId, addConnectedUser, removeConnectedUser, updateCursor]);

  const emitPlaceAdd = useCallback(
    (data: { dayId: string; placeId: string; orderIndex: number; operationId: string }) => {
      if (!tripId) return;
      getSocket().emit('place:add', { tripId, ...data });
    },
    [tripId],
  );

  const emitPlaceRemove = useCallback(
    (data: { tripPlaceId: string }) => {
      if (!tripId) return;
      getSocket().emit('place:remove', { tripId, ...data });
    },
    [tripId],
  );

  const emitCursorMove = useCallback(
    (position: unknown) => {
      if (!tripId) return;
      getSocket().emit('cursor:move', { tripId, position });
    },
    [tripId],
  );

  return { emitPlaceAdd, emitPlaceRemove, emitCursorMove };
}
