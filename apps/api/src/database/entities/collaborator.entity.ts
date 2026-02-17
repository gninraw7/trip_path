import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { CollaboratorRole, CollaboratorStatus } from '@trip-path/shared-types';
import { Trip } from './trip.entity';
import { User } from './user.entity';

/**
 * 협업자 엔티티
 * 설계서 Section 5.2: Table collaborators
 * BR-COLLAB-001, BR-COLLAB-002: 협업 초대 및 권한 체계
 * BR-CON-005: 협업자 최대 20명
 */
@Entity('collaborators')
@Unique(['tripId', 'userId'])
export class Collaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'trip_id' })
  @Index('idx_collaborators_trip_id')
  tripId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  @Index('idx_collaborators_user_id')
  userId: string;

  @Column({ type: 'varchar', length: 20, default: CollaboratorRole.VIEWER })
  role: CollaboratorRole;

  @Column({ type: 'varchar', length: 20, default: CollaboratorStatus.PENDING })
  status: CollaboratorStatus;

  @Column({ type: 'uuid', name: 'invited_by' })
  invitedBy: string;

  @Column({ type: 'timestamptz', name: 'invited_at', default: () => 'now()' })
  invitedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'joined_at' })
  joinedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Trip, (trip) => trip.collaborators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => User, (user) => user.collaborations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invited_by' })
  inviter: User;
}
