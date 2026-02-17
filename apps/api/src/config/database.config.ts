import { registerAs } from '@nestjs/config';

/**
 * 데이터베이스 설정
 * 설계서 Section 7.3: PostgreSQL 16, TypeORM
 */
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  name: process.env.DATABASE_NAME || 'trippath',
  username: process.env.DATABASE_USER || 'trippath',
  password: process.env.DATABASE_PASSWORD || 'trippath_secret',
}));
