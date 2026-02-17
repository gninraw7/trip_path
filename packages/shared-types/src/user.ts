import { UserRole, AuthProvider } from './enums';

/** 사용자 기본 프로필 (설계서 Section 5.2 users 테이블) */
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  role: UserRole;
  provider: AuthProvider | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 공개 프로필 (GET /users/{username} 응답) */
export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  followerCount: number;
  followingCount: number;
  publicTripCount: number;
  isFollowing: boolean;
}

/** 내 프로필 (GET /users/me 응답) */
export interface MyProfile extends Omit<PublicProfile, 'isFollowing' | 'publicTripCount'> {
  email: string;
  role: UserRole;
  tripCount: number;
  createdAt: string;
}

/** 프로필 수정 요청 (PATCH /users/me) */
export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

/** 로그인 응답 사용자 요약 */
export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
}
