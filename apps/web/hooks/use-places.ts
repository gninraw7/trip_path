'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { placesApi } from '../lib/api';
import type { PlaceSearchParams } from '@trip-path/shared-types';

/**
 * 장소 관련 커스텀 훅
 */

/** 장소 검색 */
export function usePlaceSearch(params: PlaceSearchParams, enabled: boolean = true) {
  return useQuery({
    queryKey: ['places', 'search', params],
    queryFn: () => placesApi.searchPlaces(params),
    enabled: enabled && params.q.length >= 2,
  });
}

/** 장소 상세 */
export function usePlace(placeId: string) {
  return useQuery({
    queryKey: ['place', placeId],
    queryFn: () => placesApi.getPlace(placeId),
    enabled: !!placeId,
  });
}

/** 즐겨찾기 토글 */
export function useToggleFavorite(placeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => placesApi.toggleFavorite(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['place', placeId] });
    },
  });
}
