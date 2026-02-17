import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollabController } from './collab.controller';
import { CollabService } from './collab.service';
import { CollabGateway } from './collab.gateway';
import { Collaborator } from '../../database/entities/collaborator.entity';
import { Trip } from '../../database/entities/trip.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collaborator, Trip, User])],
  controllers: [CollabController],
  providers: [CollabService, CollabGateway],
  exports: [CollabService],
})
export class CollabModule {}
