'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../../lib/api';

/**
 * 통합 검색 페이지
 * 설계서 Section 6.8: GET /search
 */
export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<'trips' | 'places' | 'users' | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['search', keyword, searchType],
    queryFn: () => searchApi.search({ q: keyword, type: searchType }),
    enabled: keyword.length >= 2,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">검색</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
          placeholder="여행, 장소, 사용자 검색 (최소 2자)"
        />
        <select
          value={searchType || ''}
          onChange={(e) => setSearchType(e.target.value as any || undefined)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="">전체</option>
          <option value="trips">여행</option>
          <option value="places">장소</option>
          <option value="users">사용자</option>
        </select>
      </div>

      {isLoading && <p className="text-muted-foreground">검색 중...</p>}

      {data?.data && (
        <div className="space-y-8">
          {/* 여행 결과 */}
          {data.data.trips.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">여행 경로</h2>
              {/* TODO: TripCard 컴포넌트 렌더링 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.data.trips.map((trip: any) => (
                  <div key={trip.id} className="border rounded-lg p-4">
                    {trip.title}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 장소 결과 */}
          {data.data.places.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">장소</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.data.places.map((place: any) => (
                  <div key={place.id} className="border rounded-lg p-4">
                    {place.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 사용자 결과 */}
          {data.data.users.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">사용자</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.data.users.map((user: any) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    {user.displayName} (@{user.username})
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
