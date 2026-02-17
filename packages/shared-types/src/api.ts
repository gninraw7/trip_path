/**
 * API 공통 타입 (설계서 Section 6.1 공통 규약)
 */

/** 표준 API 응답 래퍼 */
export interface ApiResponse<T> {
  data: T;
}

/** 페이지네이션 메타 정보 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/** 표준 에러 응답 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
    timestamp: string;
    requestId: string;
  };
}

/** 공통 페이지네이션 쿼리 파라미터 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/** 회원가입 요청 (POST /auth/register) */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

/** 로그인 요청 (POST /auth/login) */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    role: string;
  };
}

/** 토큰 갱신 요청 (POST /auth/refresh) */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** 토큰 갱신 응답 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

/** OAuth 요청 (POST /auth/oauth/{provider}) */
export interface OAuthRequest {
  code: string;
  redirectUri: string;
}

/** 통합 검색 요청 (GET /search) */
export interface SearchParams {
  q: string;
  type?: 'trips' | 'places' | 'users';
  page?: number;
  limit?: number;
}

/** 통합 검색 응답 */
export interface SearchResponse {
  trips: unknown[];
  places: unknown[];
  users: unknown[];
}
