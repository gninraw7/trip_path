import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Place } from '../../database/entities/place.entity';
import { PlaceFavorite } from '../../database/entities/place-favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, PlaceFavorite])],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
