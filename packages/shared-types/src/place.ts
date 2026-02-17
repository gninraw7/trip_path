import { PlaceCategory, PlaceSource } from './enums';

/** 장소 상세 (설계서 Section 5.2 places 테이블) */
export interface Place {
  id: string;
  externalId: string | null;
  source: PlaceSource;
  name: string;
  nameLocal: string | null;
  category: PlaceCategory;
  subcategory: string | null;
  latitude: number;
  longitude: number;
  address: string;
  city: string | null;
  country: string | null;
  phone: string | null;
  website: string | null;
  openingHours: Record<string, { open: string; close: string }> | null;
  rating: number | null;
  reviewCount: number;
  coverImageUrl: string | null;
  images: string[] | null;
  isFavorited: boolean;
}

/** 장소 요약 (검색 결과, 일정 내 장소 정보) */
export interface PlaceSummary {
  id: string;
  name: string;
  nameLocal: string | null;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address: string;
  rating: number | null;
  reviewCount: number;
  coverImageUrl: string | null;
}

/** 장소 검색 결과 아이템 (GET /places/search) */
export interface PlaceSearchResult extends PlaceSummary {
  openNow: boolean;
  distanceKm: number | null;
}

/** 장소 검색 쿼리 파라미터 */
export interface PlaceSearchParams {
  q: string;
  category?: PlaceCategory;
  lat?: number;
  lng?: number;
  radius?: number;
  country?: string;
  page?: number;
  limit?: number;
}
