import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../database/entities/trip.entity';
import { TripDay } from '../../database/entities/trip-day.entity';
import { TripPlace } from '../../database/entities/trip-place.entity';
import { TripLike } from '../../database/entities/trip-like.entity';
import { TripBookmark } from '../../database/entities/trip-bookmark.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AddTripPlaceDto } from './dto/add-trip-place.dto';
import { ReorderPlacesDto } from './dto/reorder-places.dto';
import { CloneTripDto } from './dto/clone-trip.dto';
import { OptimizeRouteDto } from './dto/optimize-route.dto';
import { QueryTripsDto } from './dto/query-trips.dto';
import { TripStatus, TripVisibility } from '@trip-path/shared-types';
import { validateTripDuration, generateDayDates } from '@trip-path/shared-utils';

/**
 * 여행 경로 서비스
 * 설계서 Section 6.4: Trips API
 */
@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    @InjectRepository(Trip) private tripsRepository: Repository<Trip>,
    @InjectRepository(TripDay) private tripDaysRepository: Repository<TripDay>,
    @InjectRepository(TripPlace) private tripPlacesRepository: Repository<TripPlace>,
    @InjectRepository(TripLike) private tripLikesRepository: Repository<TripLike>,
    @InjectRepository(TripBookmark) private tripBookmarksRepository: Repository<TripBookmark>,
  ) {}

  /**
   * 여행 경로 생성
   * BR-TRIP-001: 필수 필드 검증
   * BR-TRIP-002: 여행 최대 기간 90일
   */
  async create(userId: string, dto: CreateTripDto) {
    // BR-TRIP-002: 여행 기간 검증
    const durationResult = validateTripDuration(dto.startDate, dto.endDate);
    if (!durationResult.valid) {
      throw new UnprocessableEntityException({
        code: 'INVALID_TRIP_DURATION',
        message: durationResult.message,
      });
    }

    const trip = this.tripsRepository.create({
      ownerId: userId,
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
      destinationCountry: dto.destinationCountry,
      destinationCity: dto.destinationCity,
      totalBudget: dto.totalBudget,
      currency: dto.currency || 'KRW',
      visibility: dto.visibility || TripVisibility.PRIVATE,
      status: TripStatus.DRAFT,
    });

    const savedTrip = await this.tripsRepository.save(trip);

    // 일별 일정 자동 생성
    const dates = generateDayDates(dto.startDate, dto.endDate);
    const days = dates.map((date, index) =>
      this.tripDaysRepository.create({
        tripId: savedTrip.id,
        dayNumber: index + 1,
        travelDate: date,
      }),
    );
    const savedDays = await this.tripDaysRepository.save(days);

    return {
      ...savedTrip,
      days: savedDays.map((day) => ({
        id: day.id,
        dayNumber: day.dayNumber,
        travelDate: day.travelDate,
        places: [],
      })),
    };
  }

  /** 여행 경로 상세 조회 */
  async findOne(tripId: string, userId?: string) {
    const trip = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ['owner', 'days', 'days.places', 'days.places.place', 'collaborators', 'collaborators.user'],
      order: { days: { dayNumber: 'ASC' } },
    });

    if (!trip) {
      throw new NotFoundException({
        code: 'TRIP_NOT_FOUND',
        message: '요청한 여행 경로를 찾을 수 없습니다.',
      });
    }

    // 비공개 여행 접근 권한 검사
    if (trip.visibility === TripVisibility.PRIVATE && trip.ownerId !== userId) {
      const isCollaborator = trip.collaborators?.some(
        (c) => c.userId === userId && c.status === 'ACCEPTED',
      );
      if (!isCollaborator) {
        throw new ForbiddenException({
          code: 'FORBIDDEN',
          message: '이 여행 경로에 접근할 권한이 없습니다.',
        });
      }
    }

    // 조회수 증가 (TODO: 동일 사용자 24시간 내 중복 카운트 방지 - BR-DER-002)
    await this.tripsRepository.increment({ id: tripId }, 'viewCount', 1);

    let isLiked = false;
    let isBookmarked = false;
    if (userId) {
      [isLiked, isBookmarked] = await Promise.all([
        this.tripLikesRepository.findOne({ where: { tripId, userId } }).then(Boolean),
        this.tripBookmarksRepository.findOne({ where: { tripId, userId } }).then(Boolean),
      ]);
    }

    return { ...trip, isLiked, isBookmarked };
  }

  /** 여행 경로 수정 */
  async update(tripId: string, userId: string, dto: UpdateTripDto) {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: '여행 경로를 찾을 수 없습니다.' });
    }

    // TODO: OWNER 또는 EDITOR 권한 검사 (BR-COLLAB-002)
    if (trip.ownerId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: '수정 권한이 없습니다.' });
    }

    // 날짜 변경 시 기간 검증
    if (dto.startDate || dto.endDate) {
      const startDate = dto.startDate || trip.startDate;
      const endDate = dto.endDate || trip.endDate;
      const durationResult = validateTripDuration(startDate, endDate);
      if (!durationResult.valid) {
        throw new UnprocessableEntityException({
          code: 'INVALID_TRIP_DURATION',
          message: durationResult.message,
        });
      }
    }

    await this.tripsRepository.update(tripId, dto as any);
    return this.findOne(tripId, userId);
  }

  /** 여행 경로 삭제 (소프트 삭제, BR-CON-004) */
  async remove(tripId: string, userId: string) {
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: '여행 경로를 찾을 수 없습니다.' });
    }
    if (trip.ownerId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'OWNER만 삭제할 수 있습니다.' });
    }
    await this.tripsRepository.softDelete(tripId);
  }

  /** 여행 경로 목록 조회 */
  async findAll(query: QueryTripsDto, userId?: string) {
    const qb = this.tripsRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.owner', 'owner')
      .where('trip.deletedAt IS NULL');

    if (query.visibility) {
      qb.andWhere('trip.visibility = :visibility', { visibility: query.visibility });
    }
    if (query.status) {
      qb.andWhere('trip.status = :status', { status: query.status });
    }
    if (query.search) {
      qb.andWhere('trip.title ILIKE :search', { search: `%${query.search}%` });
    }
    if (query.country) {
      qb.andWhere('trip.destinationCountry = :country', { country: query.country });
    }

    const sortField = query.sort === 'popularity' ? 'trip.likeCount' : `trip.${query.sort}`;
    qb.orderBy(sortField, query.order === 'asc' ? 'ASC' : 'DESC');

    const page = query.page || 1;
    const limit = query.limit || 20;
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

  /**
   * 장소 추가
   * BR-PLACE-001: 일별 최대 20개
   * BR-PLACE-002: 중복 장소 경고
   */
  async addPlace(tripId: string, dayId: string, userId: string, dto: AddTripPlaceDto) {
    // 권한 검사
    // TODO: OWNER 또는 EDITOR 검사

    // BR-PLACE-001: 일별 최대 20개 제한
    const existingCount = await this.tripPlacesRepository.count({
      where: { tripDayId: dayId },
    });
    if (existingCount >= 20) {
      throw new ConflictException({
        code: 'DAY_PLACE_LIMIT_EXCEEDED',
        message: '하루 최대 20개 장소까지 추가 가능합니다.',
      });
    }

    // BR-PLACE-002: 중복 장소 경고
    if (!dto.force) {
      const duplicate = await this.tripPlacesRepository.findOne({
        where: { tripDayId: dayId, placeId: dto.placeId },
      });
      if (duplicate) {
        throw new ConflictException({
          code: 'DUPLICATE_PLACE_WARNING',
          message: '이미 해당 날짜에 추가된 장소입니다. force=true로 중복 추가할 수 있습니다.',
        });
      }
    }

    const tripPlace = this.tripPlacesRepository.create({
      tripDayId: dayId,
      placeId: dto.placeId,
      orderIndex: dto.orderIndex,
      visitTime: dto.visitTime,
      stayDurationMin: dto.stayDurationMin,
      transportMode: dto.transportMode,
      note: dto.note,
    });

    const saved = await this.tripPlacesRepository.save(tripPlace);

    // 첫 장소 추가 시 상태 전환: DRAFT -> PLANNING (BR-DER-001)
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    if (trip && trip.status === TripStatus.DRAFT) {
      await this.tripsRepository.update(tripId, { status: TripStatus.PLANNING });
    }

    return saved;
  }

  /** 장소 순서 변경 */
  async reorderPlaces(tripId: string, dayId: string, userId: string, dto: ReorderPlacesDto) {
    // TODO: 권한 검사
    const updates = dto.placeOrders.map((item) =>
      this.tripPlacesRepository.update(item.tripPlaceId, { orderIndex: item.orderIndex }),
    );
    await Promise.all(updates);

    return this.tripPlacesRepository.find({
      where: { tripDayId: dayId },
      relations: ['place'],
      order: { orderIndex: 'ASC' },
    });
  }

  /**
   * 여행 클론
   * BR-SHARE-002: 공개 경로만 클론 가능
   */
  async clone(tripId: string, userId: string, dto: CloneTripDto) {
    const original = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ['days', 'days.places'],
    });

    if (!original) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: '여행 경로를 찾을 수 없습니다.' });
    }

    if (original.visibility !== TripVisibility.PUBLIC && original.ownerId !== userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: '비공개 여행 경로는 클론할 수 없습니다.',
      });
    }

    // 클론 생성
    const clonedTrip = this.tripsRepository.create({
      ownerId: userId,
      title: dto.title || `${original.title} (복제)`,
      description: original.description,
      startDate: dto.startDate || original.startDate,
      endDate: original.endDate,
      destinationCountry: original.destinationCountry,
      destinationCity: original.destinationCity,
      totalBudget: original.totalBudget,
      currency: original.currency,
      visibility: TripVisibility.PRIVATE,
      status: TripStatus.DRAFT,
      clonedFromId: original.id,
    });

    const savedTrip = await this.tripsRepository.save(clonedTrip);

    // TODO: 일별 일정과 장소 복제 구현

    // 원본 클론 카운트 증가
    await this.tripsRepository.increment({ id: tripId }, 'cloneCount', 1);

    return savedTrip;
  }

  /** 좋아요 토글 */
  async toggleLike(tripId: string, userId: string) {
    const existing = await this.tripLikesRepository.findOne({
      where: { tripId, userId },
    });

    if (existing) {
      await this.tripLikesRepository.remove(existing);
      await this.tripsRepository.decrement({ id: tripId }, 'likeCount', 1);
      const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
      return { liked: false, likeCount: trip?.likeCount || 0 };
    }

    const like = this.tripLikesRepository.create({ tripId, userId });
    await this.tripLikesRepository.save(like);
    await this.tripsRepository.increment({ id: tripId }, 'likeCount', 1);
    const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
    return { liked: true, likeCount: trip?.likeCount || 0 };
  }

  /**
   * 경로 최적화
   * 설계서 BR-CALC-002, BR-CALC-003 기반
   */
  async optimizeRoute(tripId: string, userId: string, dto: OptimizeRouteDto) {
    // TODO: Haversine 공식 기반 경로 최적화 구현
    // 설계서 BR-CALC-002: 두 지점 간 거리 계산
    // 설계서 BR-CALC-003: 이동 수단별 소요 시간 계산
    this.logger.log(`Route optimization requested for trip=${tripId}, day=${dto.dayId}`);

    return {
      optimizedOrder: [],
      totalDistanceKm: 0,
      totalDurationMin: 0,
      savings: { distanceKm: 0, durationMin: 0 },
    };
  }
}
