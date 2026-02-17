import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Budget } from '../../database/entities/budget.entity';
import { Trip } from '../../database/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Trip])],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
