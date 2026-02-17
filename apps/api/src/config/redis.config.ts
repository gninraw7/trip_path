import { registerAs } from '@nestjs/config';

/**
 * Redis 설정
 * 설계서 Section 7.3: Redis 7 (Cache, Session, Bull Queue, Rate Limiting)
 */
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
}));
