import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PlaceCategory, PlaceSource } from '@trip-path/shared-types';
import { TripPlace } from './trip-place.entity';
import { PlaceFavorite } from './place-favorite.entity';

/**
 * 장소 엔티티
 * 설계서 Section 5.2: Table places
 * BR-CON-003: 위도(-90~90), 경도(-180~180) 유효성
 */
@Entity('places')
@Index('idx_places_external_id', ['externalId', 'source'], {
  where: '"external_id" IS NOT NULL',
})
@Index('idx_places_location', ['latitude', 'longitude'])
@Index('idx_places_category', ['category'])
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'external_id' })
  externalId: string | null;

  @Column({ type: 'varchar', length: 50, default: PlaceSource.MANUAL })
  source: PlaceSource;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'name_local' })
  nameLocal: string | null;

  @Column({ type: 'varchar', length: 50 })
  category: PlaceCategory;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subcategory: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website: string | null;

  @Column({ type: 'jsonb', nullable: true, name: 'opening_hours' })
  openingHours: Record<string, { open: string; close: string }> | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number | null;

  @Column({ type: 'int', default: 0, name: 'review_count' })
  reviewCount: number;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'cover_image_url' })
  coverImageUrl: string | null;

  @Column({ type: 'jsonb', nullable: true })
  images: string[] | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => TripPlace, (tp) => tp.place)
  tripPlaces: TripPlace[];

  @OneToMany(() => PlaceFavorite, (fav) => fav.place)
  favorites: PlaceFavorite[];
}
