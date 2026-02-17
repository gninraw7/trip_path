import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../../database/entities/place.entity';
import { PlaceFavorite } from '../../database/entities/place-favorite.entity';
import { SearchPlacesDto } from './dto/search-places.dto';

/**
 * 장소 서비스
 * 설계서 Section 6.5: Places API
 */
@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(
    @InjectRepository(Place) private placesRepository: Repository<Place>,
    @InjectRepository(PlaceFavorite) private favoritesRepository: Repository<PlaceFavorite>,
  ) {}

  /**
   * 장소 검색
   * 설계서 Section 6.5: GET /places/search
   * TODO: 외부 API 연동 (Kakao Maps, Google Maps)
   * TODO: Elasticsearch 도입 시 풀텍스트 검색 전환
   */
  async search(query: SearchPlacesDto, userId?: string) {
    const qb = this.placesRepository.createQueryBuilder('place');

    // 키워드 검색 (PostgreSQL ILIKE)
    qb.where('(place.name ILIKE :q OR place.nameLocal ILIKE :q)', { q: `%${query.q}%` });

    if (query.category) {
      qb.andWhere('place.category = :category', { category: query.category });
    }
    if (query.country) {
      qb.andWhere('place.country = :country', { country: query.country });
    }

    // TODO: 위도/경도 기반 근처 검색 (PostGIS 활용)
    // if (query.lat && query.lng) { ... }

    const page = query.page || 1;
    const limit = query.limit || 10;
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /** 장소 상세 조회 */
  async findOne(placeId: string, userId?: string) {
    const place = await this.placesRepository.findOne({ where: { id: placeId } });
    if (!place) {
      throw new NotFoundException({
        code: 'PLACE_NOT_FOUND',
        message: '장소를 찾을 수 없습니다.',
      });
    }

    let isFavorited = false;
    if (userId) {
      const fav = await this.favoritesRepository.findOne({
        where: { userId, placeId },
      });
      isFavorited = !!fav;
    }

    return { ...place, isFavorited };
  }

  /** 장소 즐겨찾기 토글 */
  async toggleFavorite(placeId: string, userId: string) {
    const existing = await this.favoritesRepository.findOne({
      where: { placeId, userId },
    });

    if (existing) {
      await this.favoritesRepository.remove(existing);
      return { favorited: false };
    }

    const favorite = this.favoritesRepository.create({ placeId, userId });
    await this.favoritesRepository.save(favorite);
    return { favorited: true };
  }
}
