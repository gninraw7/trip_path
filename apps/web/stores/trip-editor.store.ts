'use client';

import { create } from 'zustand';
import type { Trip, TripDay, TripPlace } from '@trip-path/shared-types';

/**
 * 여행 편집기 상태 관리
 * 실시간 협업 편집 시 로컬 상태 관리
 */
interface TripEditorState {
  trip: Trip | null;
  selectedDayId: string | null;
  isEditMode: boolean;
  connectedUsers: Array<{ userId: string; username: string; cursorPosition?: unknown }>;

  setTrip: (trip: Trip) => void;
  selectDay: (dayId: string) => void;
  setEditMode: (enabled: boolean) => void;
  addConnectedUser: (user: { userId: string; username: string }) => void;
  removeConnectedUser: (userId: string) => void;
  updateCursor: (userId: string, position: unknown) => void;

  // 장소 관련 로컬 낙관적 업데이트
  addPlaceOptimistic: (dayId: string, place: TripPlace) => void;
  removePlaceOptimistic: (dayId: string, tripPlaceId: string) => void;
  reorderPlacesOptimistic: (dayId: string, places: TripPlace[]) => void;
}

export const useTripEditorStore = create<TripEditorState>((set, get) => ({
  trip: null,
  selectedDayId: null,
  isEditMode: false,
  connectedUsers: [],

  setTrip: (trip) => set({ trip, selectedDayId: trip.days?.[0]?.id || null }),

  selectDay: (dayId) => set({ selectedDayId: dayId }),

  setEditMode: (enabled) => set({ isEditMode: enabled }),

  addConnectedUser: (user) =>
    set((state) => ({
      connectedUsers: [...state.connectedUsers.filter((u) => u.userId !== user.userId), user],
    })),

  removeConnectedUser: (userId) =>
    set((state) => ({
      connectedUsers: state.connectedUsers.filter((u) => u.userId !== userId),
    })),

  updateCursor: (userId, position) =>
    set((state) => ({
      connectedUsers: state.connectedUsers.map((u) =>
        u.userId === userId ? { ...u, cursorPosition: position } : u,
      ),
    })),

  addPlaceOptimistic: (dayId, place) =>
    set((state) => {
      if (!state.trip) return state;
      const days = state.trip.days.map((day) =>
        day.id === dayId ? { ...day, places: [...day.places, place] } : day,
      );
      return { trip: { ...state.trip, days } };
    }),

  removePlaceOptimistic: (dayId, tripPlaceId) =>
    set((state) => {
      if (!state.trip) return state;
      const days = state.trip.days.map((day) =>
        day.id === dayId
          ? { ...day, places: day.places.filter((p) => p.id !== tripPlaceId) }
          : day,
      );
      return { trip: { ...state.trip, days } };
    }),

  reorderPlacesOptimistic: (dayId, places) =>
    set((state) => {
      if (!state.trip) return state;
      const days = state.trip.days.map((day) =>
        day.id === dayId ? { ...day, places } : day,
      );
      return { trip: { ...state.trip, days } };
    }),
}));
