import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from '../../database/entities/trip.entity';
import { TripDay } from '../../database/entities/trip-day.entity';
import { TripPlace } from '../../database/entities/trip-place.entity';
import { TripLike } from '../../database/entities/trip-like.entity';
import { TripBookmark } from '../../database/entities/trip-bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripDay, TripPlace, TripLike, TripBookmark])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
