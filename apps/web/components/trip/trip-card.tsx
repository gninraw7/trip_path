import Link from 'next/link';
import type { TripSummary } from '@trip-path/shared-types';

/**
 * 여행 경로 카드 컴포넌트
 * 목록, 검색 결과 등에서 사용
 */
interface TripCardProps {
  trip: TripSummary;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        {/* 커버 이미지 */}
        <div className="h-40 bg-muted flex items-center justify-center">
          {trip.coverImageUrl ? (
            <img
              src={trip.coverImageUrl}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-sm">
              {trip.destinationCity || trip.destinationCountry || '여행'}
            </span>
          )}
        </div>

        {/* 정보 */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-1">{trip.title}</h3>
          <p className="text-sm text-muted-foreground">
            {trip.startDate} ~ {trip.endDate}
          </p>
          {trip.destinationCity && (
            <p className="text-sm text-muted-foreground">
              {trip.destinationCity}, {trip.destinationCountry}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{trip.likeCount} 좋아요</span>
            <span>{trip.viewCount} 조회</span>
            <span>{trip.cloneCount} 클론</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
