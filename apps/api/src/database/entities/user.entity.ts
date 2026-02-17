import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRole, AuthProvider } from '@trip-path/shared-types';
import { Trip } from './trip.entity';
import { Collaborator } from './collaborator.entity';
import { TripLike } from './trip-like.entity';
import { TripBookmark } from './trip-bookmark.entity';
import { Comment } from './comment.entity';
import { Follow } from './follow.entity';
import { Notification } from './notification.entity';
import { PlaceFavorite } from './place-favorite.entity';

/**
 * 사용자 엔티티
 * 설계서 Section 5.2: Table users
 */
@Entity('users')
@Index('idx_users_deleted_at', ['deletedAt'], { where: '"deleted_at" IS NULL' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  @Index('idx_users_username')
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('idx_users_email')
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
  passwordHash: string | null;

  @Column({ type: 'varchar', length: 50, name: 'display_name' })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'avatar_url' })
  avatarUrl: string | null;

  @Column({ type: 'varchar', length: 20, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ type: 'varchar', length: 20, nullable: true })
  provider: AuthProvider | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'provider_id' })
  providerId: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt: Date | null;

  // Relations
  @OneToMany(() => Trip, (trip) => trip.owner)
  trips: Trip[];

  @OneToMany(() => Collaborator, (collab) => collab.user)
  collaborations: Collaborator[];

  @OneToMany(() => TripLike, (like) => like.user)
  likes: TripLike[];

  @OneToMany(() => TripBookmark, (bookmark) => bookmark.user)
  bookmarks: TripBookmark[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];

  @OneToMany(() => PlaceFavorite, (fav) => fav.user)
  placeFavorites: PlaceFavorite[];
}
