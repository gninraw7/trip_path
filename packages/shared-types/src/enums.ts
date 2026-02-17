/**
 * 공통 Enum 정의
 * 설계서 Section 3, 5의 상태/역할 값 기반
 */

/** 사용자 역할 (BR-USER-002) */
export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  PLANNER = 'PLANNER',
  ADMIN = 'ADMIN',
}

/** OAuth 제공자 */
export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
}

/** 여행 상태 (BR-DER-001 상태 전환 다이어그램) */
export enum TripStatus {
  DRAFT = 'DRAFT',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/** 여행 공개 설정 */
export enum TripVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED',
}

/** 장소 카테고리 */
export enum PlaceCategory {
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  ATTRACTION = 'ATTRACTION',
  SHOPPING = 'SHOPPING',
  TRANSPORT = 'TRANSPORT',
}

/** 장소 데이터 소스 */
export enum PlaceSource {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  MANUAL = 'MANUAL',
  TRIPADVISOR = 'TRIPADVISOR',
}

/** 이동 수단 */
export enum TransportMode {
  WALK = 'WALK',
  BIKE = 'BIKE',
  CAR = 'CAR',
  TRANSIT = 'TRANSIT',
  NONE = 'NONE',
}

/** 협업자 역할 (BR-COLLAB-002) */
export enum CollaboratorRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

/** 협업 초대 상태 */
export enum CollaboratorStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  REMOVED = 'REMOVED',
}

/** 예산 카테고리 */
export enum BudgetCategory {
  ACCOMMODATION = 'ACCOMMODATION',
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ATTRACTION = 'ATTRACTION',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER',
}

/** 비용 카테고리 (장소별 비용) */
export enum ExpenseCategory {
  ACCOMMODATION = 'ACCOMMODATION',
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ATTRACTION = 'ATTRACTION',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER',
}

/** 알림 타입 */
export enum NotificationType {
  COLLABORATION_INVITE = 'COLLABORATION_INVITE',
  TRIP_DDAY = 'TRIP_DDAY',
  BUDGET_WARNING = 'BUDGET_WARNING',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  TRIP_LIKED = 'TRIP_LIKED',
  TRIP_COMMENTED = 'TRIP_COMMENTED',
  TRIP_CLONED = 'TRIP_CLONED',
}

/** 경로 최적화 기준 */
export enum OptimizeFor {
  DISTANCE = 'DISTANCE',
  DURATION = 'DURATION',
}

/** 여행 목록 정렬 기준 */
export enum TripSortBy {
  CREATED_AT = 'createdAt',
  POPULARITY = 'popularity',
  START_DATE = 'startDate',
}

/** 정렬 순서 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
