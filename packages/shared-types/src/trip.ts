import { TripStatus, TripVisibility, TransportMode, ExpenseCategory } from './enums';
import { AuthUser } from './user';
import { PlaceSummary } from './place';
import { CollaboratorSummary } from './collab';

/** 여행 경로 (설계서 Section 5.2 trips 테이블) */
export interface Trip {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  status: TripStatus;
  visibility: TripVisibility;
  startDate: string;
  endDate: string;
  destinationCountry: string | null;
  destinationCity: string | null;
  totalBudget: number | null;
  currency: string;
  cloneCount: number;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  owner: AuthUser;
  days: TripDay[];
  collaborators: CollaboratorSummary[];
  createdAt: string;
  updatedAt: string;
}

/** 여행 목록 아이템 (요약) */
export interface TripSummary {
  id: string;
  title: string;
  coverImageUrl: string | null;
  status: TripStatus;
  visibility: TripVisibility;
  startDate: string;
  endDate: string;
  destinationCountry: string | null;
  destinationCity: string | null;
  cloneCount: number;
  viewCount: number;
  likeCount: number;
  owner: AuthUser;
  createdAt: string;
}

/** 여행 일별 일정 (trip_days 테이블) */
export interface TripDay {
  id: string;
  dayNumber: number;
  travelDate: string;
  note: string | null;
  places: TripPlace[];
}

/** 일정 내 장소 (trip_places 테이블) */
export interface TripPlace {
  id: string;
  orderIndex: number;
  visitTime: string | null;
  stayDurationMin: number | null;
  transportMode: TransportMode | null;
  transportDurationMin: number | null;
  transportDistanceKm: number | null;
  expenseAmount: number | null;
  expenseCategory: ExpenseCategory | null;
  note: string | null;
  place: PlaceSummary;
}

/** 여행 생성 요청 (POST /trips) */
export interface CreateTripRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  destinationCountry?: string;
  destinationCity?: string;
  totalBudget?: number;
  currency?: string;
  visibility?: TripVisibility;
}

/** 여행 수정 요청 (PATCH /trips/{tripId}) */
export interface UpdateTripRequest {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  startDate?: string;
  endDate?: string;
  destinationCountry?: string;
  destinationCity?: string;
  totalBudget?: number;
  currency?: string;
  visibility?: TripVisibility;
  status?: TripStatus;
}

/** 장소 추가 요청 (POST /trips/{tripId}/days/{dayId}/places) */
export interface AddTripPlaceRequest {
  placeId: string;
  orderIndex: number;
  visitTime?: string;
  stayDurationMin?: number;
  transportMode?: TransportMode;
  note?: string;
  force?: boolean;
}

/** 장소 순서 변경 요청 (PUT /trips/{tripId}/days/{dayId}/places/reorder) */
export interface ReorderPlacesRequest {
  placeOrders: Array<{
    tripPlaceId: string;
    orderIndex: number;
  }>;
}

/** 여행 클론 요청 (POST /trips/{tripId}/clone) */
export interface CloneTripRequest {
  title?: string;
  startDate?: string;
}

/** 좋아요 토글 응답 */
export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

/** 경로 최적화 요청 (POST /trips/{tripId}/route/optimize) */
export interface OptimizeRouteRequest {
  dayId: string;
  transportMode: TransportMode;
  optimizeFor: 'DISTANCE' | 'DURATION';
}

/** 경로 최적화 응답 */
export interface OptimizeRouteResponse {
  optimizedOrder: string[];
  totalDistanceKm: number;
  totalDurationMin: number;
  savings: {
    distanceKm: number;
    durationMin: number;
  };
}
