'use client';

import { use } from 'react';
import { useTrip } from '../../../../hooks/use-trips';
import { TripDetailView } from '../../../../components/trip/trip-detail-view';

/**
 * 여행 경로 상세 페이지
 * 설계서 Section 6.4: GET /trips/{tripId}
 */
export default function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const { data, isLoading, error } = useTrip(tripId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-2">여행 경로를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground">삭제되었거나 접근 권한이 없는 경로입니다.</p>
      </div>
    );
  }

  return <TripDetailView trip={data.data} />;
}
