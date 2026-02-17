import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../database/entities/trip.entity';
import { Place } from '../../database/entities/place.entity';
import { User } from '../../database/entities/user.entity';
import { SearchDto } from './dto/search.dto';
import { TripVisibility } from '@trip-path/shared-types';

/**
 * 통합 검색 서비스
 * 설계서 Section 6.8: Search API
 * TODO: Elasticsearch 도입 시 풀텍스트 검색으로 전환 (Phase 3)
 */
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(Trip) private tripsRepository: Repository<Trip>,
    @InjectRepository(Place) private placesRepository: Repository<Place>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async search(query: SearchDto) {
    const keyword = `%${query.q}%`;
    const results: { trips: unknown[]; places: unknown[]; users: unknown[] } = {
      trips: [],
      places: [],
      users: [],
    };

    if (!query.type || query.type === 'trips') {
      results.trips = await this.tripsRepository
        .createQueryBuilder('trip')
        .leftJoinAndSelect('trip.owner', 'owner')
        .where('trip.visibility = :visibility', { visibility: TripVisibility.PUBLIC })
        .andWhere('trip.deletedAt IS NULL')
        .andWhere('(trip.title ILIKE :keyword OR trip.description ILIKE :keyword)', { keyword })
        .orderBy('trip.likeCount', 'DESC')
        .take(query.limit)
        .getMany();
    }

    if (!query.type || query.type === 'places') {
      results.places = await this.placesRepository
        .createQueryBuilder('place')
        .where('(place.name ILIKE :keyword OR place.nameLocal ILIKE :keyword)', { keyword })
        .take(query.limit)
        .getMany();
    }

    if (!query.type || query.type === 'users') {
      results.users = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.deletedAt IS NULL')
        .andWhere('(user.username ILIKE :keyword OR user.displayName ILIKE :keyword)', { keyword })
        .select(['user.id', 'user.username', 'user.displayName', 'user.avatarUrl', 'user.bio'])
        .take(query.limit)
        .getMany();
    }

    return results;
  }
}
