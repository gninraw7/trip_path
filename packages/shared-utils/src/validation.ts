/**
 * 유효성 검증 유틸리티
 * 설계서 Section 3.4 제약 조건 기반
 */

/** 사용자명 유효성 검증 (BR-CON-001: 영문, 숫자, 언더스코어, 3~30자) */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username);
}

/** 비밀번호 복잡도 검증 (BR-CON-002: 최소 8자, 영문 대소문자+숫자+특수문자 각 1개 이상) */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
  return true;
}

/** 이메일 형식 검증 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** 위도 유효성 검증 (BR-CON-003: -90 ~ 90) */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

/** 경도 유효성 검증 (BR-CON-003: -180 ~ 180) */
export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180;
}

/** 검색 키워드 유효성 검증 (BR-CON-009: 최소 2자) */
export function isValidSearchKeyword(keyword: string): boolean {
  return keyword.trim().length >= 2;
}

/** 댓글 유효성 검증 (BR-CON-008: 최대 500자) */
export function isValidComment(content: string): boolean {
  return content.trim().length > 0 && content.length <= 500;
}
