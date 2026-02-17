'use client';

import { use } from 'react';
import { usePlace } from '../../../../hooks/use-places';

/**
 * 장소 상세 페이지
 * 설계서 Section 6.5: GET /places/{placeId}
 */
export default function PlaceDetailPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = use(params);
  const { data, isLoading, error } = usePlace(placeId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-2">장소를 찾을 수 없습니다</h1>
      </div>
    );
  }

  const place = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{place.name}</h1>
      {place.nameLocal && (
        <p className="text-lg text-muted-foreground">{place.nameLocal}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          {/* TODO: 지도 표시 */}
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            지도 영역 (위도: {place.latitude}, 경도: {place.longitude})
          </div>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">장소 정보</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">카테고리</dt>
                <dd>{place.category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">주소</dt>
                <dd>{place.address}</dd>
              </div>
              {place.phone && (
                <div>
                  <dt className="text-muted-foreground">전화번호</dt>
                  <dd>{place.phone}</dd>
                </div>
              )}
              {place.rating && (
                <div>
                  <dt className="text-muted-foreground">평점</dt>
                  <dd>{place.rating} / 5.0 ({place.reviewCount}개 리뷰)</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
