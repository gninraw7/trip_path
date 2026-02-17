import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Trip } from './trip.entity';
import { TripPlace } from './trip-place.entity';

/**
 * 여행 일별 일정 엔티티
 * 설계서 Section 5.2: Table trip_days
 */
@Entity('trip_days')
@Unique(['tripId', 'dayNumber'])
export class TripDay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'trip_id' })
  @Index('idx_trip_days_trip_id')
  tripId: string;

  @Column({ type: 'int', name: 'day_number' })
  dayNumber: number;

  @Column({ type: 'date', name: 'travel_date' })
  travelDate: string;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Trip, (trip) => trip.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @OneToMany(() => TripPlace, (tp) => tp.tripDay, { cascade: true })
  places: TripPlace[];
}
