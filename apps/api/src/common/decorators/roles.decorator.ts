import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@trip-path/shared-types';

export const ROLES_KEY = 'roles';

/**
 * 역할 기반 접근 제어 데코레이터
 * 설계서 BR-USER-002: 사용자 역할 권한 매트릭스
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
