import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthDto } from './dto/oauth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserRole, AuthProvider } from '@trip-path/shared-types';

/**
 * 인증 서비스
 * 설계서 Section 6.2: Auth API
 * BR-USER-001: 이메일 인증
 * 설계서 Section 8.3: bcrypt cost factor 12
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 이메일 회원가입
   * 설계서 Section 6.2: POST /auth/register
   */
  async register(dto: RegisterDto) {
    // 이메일 중복 검사
    const existingEmail = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: '이미 사용 중인 이메일입니다.',
      });
    }

    // 사용자명 중복 검사
    const existingUsername = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException({
        code: 'USERNAME_ALREADY_EXISTS',
        message: '이미 사용 중인 사용자명입니다.',
      });
    }

    // 비밀번호 해싱 (bcrypt, cost factor 12)
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.usersRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
      role: UserRole.MEMBER,
      provider: AuthProvider.LOCAL,
      isEmailVerified: false,
    });

    const savedUser = await this.usersRepository.save(user);

    // TODO: 이메일 인증 메일 발송 (BR-USER-001)

    return {
      userId: savedUser.id,
      email: savedUser.email,
      message: '이메일 인증 메일이 발송되었습니다.',
    };
  }

  /**
   * 이메일/비밀번호 로그인
   * 설계서 Section 6.2: POST /auth/login
   */
  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    // 마지막 로그인 시간 갱신
    await this.usersRepository.update(user.id, { lastLoginAt: new Date() });

    return this.generateTokenResponse(user);
  }

  /**
   * 소셜 로그인
   * 설계서 Section 6.2: POST /auth/oauth/{provider}
   * BR-USER-001: 소셜 로그인 시 이메일 인증 면제
   */
  async oauthLogin(provider: string, dto: OAuthDto) {
    // TODO: 각 OAuth 제공자별 토큰 교환 및 사용자 정보 조회 구현
    // Google, Kakao, Naver 각각의 OAuth 흐름 구현 필요
    this.logger.log(`OAuth login attempt: provider=${provider}`);

    throw new BadRequestException({
      code: 'NOT_IMPLEMENTED',
      message: 'OAuth 로그인은 아직 구현되지 않았습니다.',
    });
  }

  /**
   * 토큰 갱신
   * 설계서 Section 6.2: POST /auth/refresh
   * 설계서 Section 8.3: Refresh Token 단일 사용 후 교체
   */
  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret-dev'),
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub, isActive: true },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      // TODO: Redis에서 refresh token 유효성 검증 및 교체

      const accessToken = this.generateAccessToken(user);

      return {
        accessToken,
        expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRATION', 3600),
      };
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: '유효하지 않은 리프레시 토큰입니다.',
      });
    }
  }

  /**
   * 로그아웃
   * 설계서 Section 6.2: POST /auth/logout
   */
  async logout(userId: string) {
    // TODO: Redis에서 refresh token 삭제
    this.logger.log(`User logged out: ${userId}`);
  }

  private generateTokenResponse(user: User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRATION', 3600),
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    };
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'access-secret-dev'),
        expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRATION', 3600),
      },
    );
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret-dev'),
        expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRATION', 2592000),
      },
    );
  }
}
