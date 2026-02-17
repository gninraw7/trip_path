import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { TripStatus, TripVisibility } from '@trip-path/shared-types';
import { User } from './user.entity';
import { TripDay } from './trip-day.entity';
import { Collaborator } from './collaborator.entity';
import { Budget } from './budget.entity';
import { TripLike } from './trip-like.entity';
import { TripBookmark } from './trip-bookmark.entity';
import { Comment } from './comment.entity';

/**
 * 여행 경로 엔티티
 * 설계서 Section 5.2: Table trips
 * 설계서 BR-CON-004: 소프트 삭제
 */
@Entity('trips')
@Index('idx_trips_visibility_status', ['visibility', 'status'], {
  where: '"deleted_at" IS NULL',
})
@Index('idx_trips_created_at', ['createdAt'])
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'owner_id' })
  @Index('idx_trips_owner_id')
  ownerId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'cover_image_url' })
  coverImageUrl: string | null;

  @Column({ type: 'date', name: 'start_date' })
  @Index('idx_trips_start_date')
  startDate: string;

  @Column({ type: 'date', name: 'end_date' })
  endDate: string;

  @Column({ type: 'varchar', length: 20, default: TripStatus.DRAFT })
  status: TripStatus;

  @Column({ type: 'varchar', length: 20, default: TripVisibility.PRIVATE })
  visibility: TripVisibility;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'destination_country' })
  destinationCountry: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'destination_city' })
  destinationCity: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'total_budget' })
  totalBudget: number | null;

  @Column({ type: 'varchar', length: 3, default: 'KRW' })
  currency: string;

  @Column({ type: 'int', default: 0, name: 'clone_count' })
  cloneCount: number;

  @Column({ type: 'int', default: 0, name: 'view_count' })
  viewCount: number;

  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'uuid', nullable: true, name: 'cloned_from_id' })
  clonedFromId: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt: Date | null;

  // Relations
  @ManyToOne(() => User, (user) => user.trips)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Trip, { nullable: true })
  @JoinColumn({ name: 'cloned_from_id' })
  clonedFrom: Trip | null;

  @OneToMany(() => TripDay, (day) => day.trip, { cascade: true })
  days: TripDay[];

  @OneToMany(() => Collaborator, (collab) => collab.trip)
  collaborators: Collaborator[];

  @OneToMany(() => Budget, (budget) => budget.trip)
  budgets: Budget[];

  @OneToMany(() => TripLike, (like) => like.trip)
  likes: TripLike[];

  @OneToMany(() => TripBookmark, (bookmark) => bookmark.trip)
  bookmarks: TripBookmark[];

  @OneToMany(() => Comment, (comment) => comment.trip)
  comments: Comment[];
}
