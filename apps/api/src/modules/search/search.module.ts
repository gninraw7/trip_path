import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Trip } from '../../database/entities/trip.entity';
import { Place } from '../../database/entities/place.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Place, User])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
