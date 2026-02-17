import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Follow } from '../../database/entities/follow.entity';
import { Trip } from '../../database/entities/trip.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

/**
 * 사용자 서비스
 * 설계서 Section 6.3: Users API
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Follow) private followsRepository: Repository<Follow>,
    @InjectRepository(Trip) private tripsRepository: Repository<Trip>,
  ) {}

  /** GET /users/me - 내 프로필 조회 */
  async getMyProfile(userId: string) {
    const user = await this.usersRepository.findOneOrFail({ where: { id: userId } });

    const [followerCount, followingCount, tripCount] = await Promise.all([
      this.followsRepository.count({ where: { followingId: userId } }),
      this.followsRepository.count({ where: { followerId: userId } }),
      this.tripsRepository.count({ where: { ownerId: userId } }),
    ]);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      followerCount,
      followingCount,
      tripCount,
      createdAt: user.createdAt,
    };
  }

  /** PATCH /users/me - 내 프로필 수정 */
  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    await this.usersRepository.update(userId, dto);
    return this.getMyProfile(userId);
  }

  /** GET /users/:username - 특정 사용자 프로필 조회 */
  async getPublicProfile(username: string, currentUserId?: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    const [followerCount, followingCount, publicTripCount] = await Promise.all([
      this.followsRepository.count({ where: { followingId: user.id } }),
      this.followsRepository.count({ where: { followerId: user.id } }),
      this.tripsRepository.count({
        where: { ownerId: user.id, visibility: 'PUBLIC' as any },
      }),
    ]);

    let isFollowing = false;
    if (currentUserId) {
      const follow = await this.followsRepository.findOne({
        where: { followerId: currentUserId, followingId: user.id },
      });
      isFollowing = !!follow;
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      followerCount,
      followingCount,
      publicTripCount,
      isFollowing,
    };
  }

  /** POST /users/:userId/follow - 팔로우 토글 */
  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException({
        code: 'CANNOT_FOLLOW_SELF',
        message: '자기 자신은 팔로우할 수 없습니다.',
      });
    }

    const existingFollow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      await this.followsRepository.remove(existingFollow);
      return { following: false };
    }

    const targetUser = await this.usersRepository.findOne({ where: { id: followingId } });
    if (!targetUser) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    const follow = this.followsRepository.create({ followerId, followingId });
    await this.followsRepository.save(follow);

    // TODO: 팔로우 알림 발송 (NotificationType.NEW_FOLLOWER)

    return { following: true };
  }
}
