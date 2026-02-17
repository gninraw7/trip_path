import { apiClient } from '../api-client';
import type {
  ApiResponse,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  OAuthRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@trip-path/shared-types';

/**
 * Auth API 클라이언트 함수
 * 설계서 Section 6.2: 인증 API
 */

/** POST /auth/register */
export async function register(data: RegisterRequest) {
  return apiClient.post<ApiResponse<{ userId: string; email: string; message: string }>>(
    '/auth/register',
    data,
  );
}

/** POST /auth/login */
export async function login(data: LoginRequest) {
  return apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
}

/** POST /auth/oauth/:provider */
export async function oauthLogin(provider: string, data: OAuthRequest) {
  return apiClient.post<ApiResponse<LoginResponse>>(`/auth/oauth/${provider}`, data);
}

/** POST /auth/refresh */
export async function refreshToken(data: RefreshTokenRequest) {
  return apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data);
}

/** POST /auth/logout */
export async function logout() {
  return apiClient.post<void>('/auth/logout');
}
