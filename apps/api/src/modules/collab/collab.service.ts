import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collaborator } from '../../database/entities/collaborator.entity';
import { Trip } from '../../database/entities/trip.entity';
import { User } from '../../database/entities/user.entity';
import { InviteCollaboratorDto } from './dto/invite-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CollaboratorStatus } from '@trip-path/shared-types';

/**
 * 협업 서비스
 * 설계서 Section 6.6: Collaboration API
 * BR-COLLAB-001, BR-COLLAB-002, BR-CON-005
 */
@Injectable()
export class CollabService {
  private readonly logger = new Logger(CollabService.name);

  constructor(
    @InjectRepository(Collaborator) private collabRepository: Repository<Collaborator>,
    @InjectRepository(Trip) private tripsRepository: Repository<Trip>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  /** 협업자 초대 (BR-COLLAB-001: OWNER만 초대 가능) */
  async invite(tripId: string, userId: string, dto: InviteCollaboratorDto) {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: '여행 경로를 찾을 수 없습니다.' });
    }

    // OWNER 권한 확인
    if (trip.ownerId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'OWNER만 협업자를 초대할 수 있습니다.' });
    }

    // 초대 대상 사용자 조회
    const targetUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!targetUser) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: '초대 대상 사용자를 찾을 수 없습니다.' });
    }

    // 본인 초대 방지
    if (targetUser.id === userId) {
      throw new BadRequestException({ code: 'CANNOT_INVITE_SELF', message: '자기 자신은 초대할 수 없습니다.' });
    }

    // 중복 초대 방지
    const existing = await this.collabRepository.findOne({
      where: { tripId, userId: targetUser.id },
    });
    if (existing) {
      throw new ConflictException({ code: 'ALREADY_COLLABORATOR', message: '이미 협업자로 등록된 사용자입니다.' });
    }

    // BR-CON-005: 협업자 최대 20명
    const count = await this.collabRepository.count({ where: { tripId } });
    if (count >= 20) {
      throw new ConflictException({ code: 'COLLABORATOR_LIMIT', message: '협업자는 최대 20명까지 가능합니다.' });
    }

    const collaborator = this.collabRepository.create({
      tripId,
      userId: targetUser.id,
      role: dto.role,
      status: CollaboratorStatus.PENDING,
      invitedBy: userId,
    });

    const saved = await this.collabRepository.save(collaborator);

    // TODO: 협업 초대 알림 발송 (NotificationType.COLLABORATION_INVITE)
    // TODO: 초대 이메일 발송

    return saved;
  }

  /** 협업자 역할 변경 */
  async updateRole(tripId: string, collaboratorId: string, userId: string, dto: UpdateCollaboratorDto) {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip || trip.ownerId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'OWNER만 역할을 변경할 수 있습니다.' });
    }

    await this.collabRepository.update(collaboratorId, { role: dto.role });
    return this.collabRepository.findOne({ where: { id: collaboratorId } });
  }

  /** 협업자 제거 */
  async remove(tripId: string, collaboratorId: string, userId: string) {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip || trip.ownerId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'OWNER만 협업자를 제거할 수 있습니다.' });
    }

    await this.collabRepository.delete(collaboratorId);
  }

  /** 초대 수락 */
  async acceptInvite(tripId: string, userId: string, dto: AcceptInviteDto) {
    // TODO: inviteToken 검증 로직 구현
    const collaborator = await this.collabRepository.findOne({
      where: { tripId, userId, status: CollaboratorStatus.PENDING },
    });

    if (!collaborator) {
      throw new NotFoundException({ code: 'INVITE_NOT_FOUND', message: '초대를 찾을 수 없습니다.' });
    }

    collaborator.status = CollaboratorStatus.ACCEPTED;
    collaborator.joinedAt = new Date();
    await this.collabRepository.save(collaborator);

    return {
      tripId,
      role: collaborator.role,
      joinedAt: collaborator.joinedAt,
    };
  }
}
