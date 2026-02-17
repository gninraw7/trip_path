import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Place } from './place.entity';

/**
 * 장소 즐겨찾기 엔티티
 * 설계서 Section 5.2: Table place_favorites
 */
@Entity('place_favorites')
@Unique(['userId', 'placeId'])
export class PlaceFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'place_id' })
  placeId: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.placeFavorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Place, (place) => place.favorites)
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
