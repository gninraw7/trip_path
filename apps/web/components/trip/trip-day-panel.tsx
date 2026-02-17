'use client';

import type { TripDay, TripPlace } from '@trip-path/shared-types';

/**
 * 일별 일정 패널
 * 설계서 Section 2.1: 날짜별 일정 구성, 장소 추가/순서 변경
 * TODO: dnd-kit 드래그 앤 드롭으로 순서 변경 구현
 */
interface TripDayPanelProps {
  day: TripDay;
}

export function TripDayPanel({ day }: TripDayPanelProps) {
  return (
    <div className="space-y-4">
      {/* 메모 */}
      {day.note && (
        <p className="text-sm text-muted-foreground italic">{day.note}</p>
      )}

      {/* 장소 목록 */}
      {day.places.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
          <p>장소를 추가해보세요</p>
          <button className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
            장소 검색
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {day.places
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((tripPlace, index) => (
              <TripPlaceItem key={tripPlace.id} tripPlace={tripPlace} index={index} />
            ))}
        </div>
      )}

      {/* 장소 추가 버튼 */}
      {day.places.length > 0 && (
        <button className="w-full py-2 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary">
          + 장소 추가
        </button>
      )}
    </div>
  );
}

function TripPlaceItem({ tripPlace, index }: { tripPlace: TripPlace; index: number }) {
  return (
    <div className="flex items-start gap-4 border rounded-lg p-4">
      {/* 순서 번호 */}
      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
        {index + 1}
      </div>

      {/* 장소 정보 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium">{tripPlace.place.name}</h4>
        <p className="text-sm text-muted-foreground">{tripPlace.place.address}</p>

        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
          {tripPlace.visitTime && <span>방문: {tripPlace.visitTime}</span>}
          {tripPlace.stayDurationMin && <span>체류: {tripPlace.stayDurationMin}분</span>}
          {tripPlace.transportMode && tripPlace.transportMode !== 'NONE' && (
            <span>
              이동: {tripPlace.transportMode} ({tripPlace.transportDurationMin}분, {tripPlace.transportDistanceKm}km)
            </span>
          )}
        </div>

        {tripPlace.note && (
          <p className="text-sm mt-1 text-muted-foreground italic">{tripPlace.note}</p>
        )}
      </div>

      {/* 액션 */}
      <div className="flex-shrink-0 flex gap-1">
        <button className="p-1 hover:bg-accent rounded text-sm">수정</button>
        <button className="p-1 hover:bg-destructive/10 rounded text-sm text-destructive">삭제</button>
      </div>
    </div>
  );
}
