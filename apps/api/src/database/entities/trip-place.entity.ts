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
import { TransportMode, ExpenseCategory } from '@trip-path/shared-types';
import { TripDay } from './trip-day.entity';
import { Place } from './place.entity';

/**
 * 일정 내 장소 엔티티
 * 설계서 Section 5.2: Table trip_places
 * BR-PLACE-001: 일별 최대 장소 20개
 */
@Entity('trip_places')
@Unique(['tripDayId', 'orderIndex'])
export class TripPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'trip_day_id' })
  @Index('idx_trip_places_trip_day_id')
  tripDayId: string;

  @Column({ type: 'uuid', name: 'place_id' })
  placeId: string;

  @Column({ type: 'int', name: 'order_index' })
  orderIndex: number;

  @Column({ type: 'time', nullable: true, name: 'visit_time' })
  visitTime: string | null;

  @Column({ type: 'int', nullable: true, name: 'stay_duration_min' })
  stayDurationMin: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'transport_mode' })
  transportMode: TransportMode | null;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    name: 'transport_duration_min',
  })
  transportDurationMin: number | null;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 3,
    nullable: true,
    name: 'transport_distance_km',
  })
  transportDistanceKm: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'expense_amount' })
  expenseAmount: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'expense_category' })
  expenseCategory: ExpenseCategory | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TripDay, (day) => day.places, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_day_id' })
  tripDay: TripDay;

  @ManyToOne(() => Place, (place) => place.tripPlaces)
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
