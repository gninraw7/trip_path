'use client';

import { useState } from 'react';
import { usePlaceSearch } from '../../hooks/use-places';
import type { PlaceSearchResult } from '@trip-path/shared-types';

/**
 * 장소 검색 컴포넌트
 * 설계서 Section 6.5: GET /places/search
 * BR-CON-009: 검색 키워드 최소 2자
 */
interface PlaceSearchProps {
  onSelect?: (place: PlaceSearchResult) => void;
}

export function PlaceSearch({ onSelect }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const { data, isLoading } = usePlaceSearch({ q: query });

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border border-input rounded-md bg-background"
        placeholder="장소 검색 (최소 2자)"
      />

      {isLoading && <p className="text-sm text-muted-foreground">검색 중...</p>}

      {data?.data && data.data.length > 0 && (
        <ul className="border rounded-md divide-y">
          {data.data.map((place) => (
            <li
              key={place.id}
              className="p-3 hover:bg-accent cursor-pointer"
              onClick={() => onSelect?.(place)}
            >
              <p className="font-medium">{place.name}</p>
              {place.nameLocal && (
                <p className="text-sm text-muted-foreground">{place.nameLocal}</p>
              )}
              <p className="text-sm text-muted-foreground">{place.address}</p>
              <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                <span>{place.category}</span>
                {place.rating && <span>평점: {place.rating}</span>}
                {place.distanceKm && <span>{place.distanceKm}km</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
