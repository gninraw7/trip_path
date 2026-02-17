import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { NotificationType } from '@trip-path/shared-types';

/**
 * 알림 서비스
 * 설계서 Section 6.9: Notifications API
 * BR-CON-010: 알림 90일 보관 후 자동 삭제
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
  ) {}

  /** GET /notifications - 알림 목록 조회 */
  async findAll(userId: string, page: number = 1, limit: number = 20, isRead?: boolean) {
    const qb = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.recipientId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (isRead !== undefined) {
      qb.andWhere('notification.isRead = :isRead', { isRead });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /** PATCH /notifications/read-all - 모든 알림 읽음 처리 */
  async markAllAsRead(userId: string) {
    await this.notificationsRepository.update(
      { recipientId: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  /** 알림 생성 (내부 사용) */
  async create(
    recipientId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // BR-CON-010: 90일 보관

    const notification = this.notificationsRepository.create({
      recipientId,
      type,
      title,
      body,
      data: data || null,
      expiresAt,
    });

    return this.notificationsRepository.save(notification);
  }
}
