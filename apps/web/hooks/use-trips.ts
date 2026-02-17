'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '../lib/api';
import type { CreateTripRequest, UpdateTripRequest } from '@trip-path/shared-types';

/**
 * 여행 관련 커스텀 훅 (TanStack Query)
 * 설계서 Section 7.1: TanStack Query (서버 상태 캐싱)
 */

/** 여행 목록 조회 */
export function useTrips(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => tripsApi.getTrips(params),
  });
}

/** 여행 상세 조회 */
export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripsApi.getTrip(tripId),
    enabled: !!tripId,
  });
}

/** 여행 생성 */
export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTripRequest) => tripsApi.createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

/** 여행 수정 */
export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTripRequest) => tripsApi.updateTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

/** 여행 삭제 */
export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => tripsApi.deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

/** 좋아요 토글 */
export function useToggleLike(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tripsApi.toggleLike(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

/** 여행 클론 */
export function useCloneTrip(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: { title?: string; startDate?: string }) => tripsApi.cloneTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
