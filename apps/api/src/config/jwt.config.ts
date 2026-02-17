import { registerAs } from '@nestjs/config';

/**
 * JWT 설정
 * 설계서 Section 8.3 보안 고려사항:
 * - Access Token: 1시간 만료
 * - Refresh Token: 30일 만료, Redis 저장, 단일 사용 후 교체
 */
export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-dev',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-dev',
  accessExpiration: parseInt(process.env.JWT_ACCESS_EXPIRATION || '3600', 10),
  refreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION || '2592000', 10),
}));
