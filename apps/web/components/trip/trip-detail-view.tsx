'use client';

import { useState } from 'react';
import type { Trip } from '@trip-path/shared-types';
import { TripDayPanel } from './trip-day-panel';
import { useCollabSocket } from '../../hooks/use-socket';
import { useTripEditorStore } from '../../stores/trip-editor.store';

/**
 * 여행 경로 상세 뷰 컴포넌트
 * 일별 일정, 장소 목록, 예산, 협업자 등을 표시
 */
interface TripDetailViewProps {
  trip: Trip;
}

export function TripDetailView({ trip }: TripDetailViewProps) {
  const { selectedDayId, selectDay, connectedUsers } = useTripEditorStore();
  const { emitPlaceAdd, emitPlaceRemove } = useCollabSocket(trip.id);

  const currentDay = trip.days?.find((d) => d.id === selectedDayId) || trip.days?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 여행 헤더 */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{trip.title}</h1>
            {trip.description && (
              <p className="text-muted-foreground mt-2">{trip.description}</p>
            )}
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>{trip.startDate} ~ {trip.endDate}</span>
              {trip.destinationCity && (
                <span>{trip.destinationCity}, {trip.destinationCountry}</span>
              )}
              <span className="capitalize">{trip.status.toLowerCase()}</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-md text-sm hover:bg-accent">
              {trip.isLiked ? '좋아요 취소' : '좋아요'} ({trip.likeCount})
            </button>
            <button className="px-4 py-2 border rounded-md text-sm hover:bg-accent">
              {trip.isBookmarked ? '북마크 해제' : '북마크'}
            </button>
            <button className="px-4 py-2 border rounded-md text-sm hover:bg-accent">
              클론
            </button>
          </div>
        </div>

        {/* 접속 중인 협업자 */}
        {connectedUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">접속 중:</span>
            {connectedUsers.map((u) => (
              <span
                key={u.userId}
                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {u.username}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 일별 탭 */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {trip.days?.map((day) => (
          <button
            key={day.id}
            onClick={() => selectDay(day.id)}
            className={`px-4 py-2 rounded-md text-sm whitespace-nowrap ${
              currentDay?.id === day.id
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-accent'
            }`}
          >
            Day {day.dayNumber} ({day.travelDate})
          </button>
        ))}
      </div>

      {/* 선택된 일차의 장소 목록 */}
      {currentDay && <TripDayPanel day={currentDay} />}
    </div>
  );
}
