import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BudgetCategory } from '@trip-path/shared-types';
import { Trip } from './trip.entity';

/**
 * 예산 엔티티
 * 설계서 Section 5.2: Table budgets
 * BR-BUDGET-001: 예산 설정 및 초과 알림
 */
@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'trip_id' })
  tripId: string;

  @Column({ type: 'varchar', length: 50 })
  category: BudgetCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'planned_amount' })
  plannedAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'actual_amount' })
  actualAmount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Trip, (trip) => trip.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;
}
