import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AddTripPlaceDto } from './dto/add-trip-place.dto';
import { ReorderPlacesDto } from './dto/reorder-places.dto';
import { CloneTripDto } from './dto/clone-trip.dto';
import { OptimizeRouteDto } from './dto/optimize-route.dto';
import { QueryTripsDto } from './dto/query-trips.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

/**
 * 여행 경로 컨트롤러
 * 설계서 Section 6.4: 여행 경로 API
 */
@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  /** POST /trips - 여행 경로 생성 */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: '여행 경로 생성' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateTripDto) {
    return this.tripsService.create(userId, dto);
  }

  /** GET /trips - 여행 경로 목록 조회 */
  @Public()
  @Get()
  @ApiOperation({ summary: '여행 경로 목록 조회' })
  async findAll(@Query() query: QueryTripsDto, @CurrentUser('id') userId?: string) {
    return this.tripsService.findAll(query, userId);
  }

  /** GET /trips/:tripId - 여행 경로 상세 조회 */
  @Public()
  @Get(':tripId')
  @ApiOperation({ summary: '여행 경로 상세 조회' })
  async findOne(@Param('tripId') tripId: string, @CurrentUser('id') userId?: string) {
    return this.tripsService.findOne(tripId, userId);
  }

  /** PATCH /trips/:tripId - 여행 경로 수정 */
  @UseGuards(JwtAuthGuard)
  @Patch(':tripId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '여행 경로 수정' })
  async update(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.update(tripId, userId, dto);
  }

  /** DELETE /trips/:tripId - 여행 경로 삭제 (소프트 삭제) */
  @UseGuards(JwtAuthGuard)
  @Delete(':tripId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: '여행 경로 삭제' })
  async remove(@Param('tripId') tripId: string, @CurrentUser('id') userId: string) {
    return this.tripsService.remove(tripId, userId);
  }

  /** POST /trips/:tripId/days/:dayId/places - 장소 추가 */
  @UseGuards(JwtAuthGuard)
  @Post(':tripId/days/:dayId/places')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: '일정에 장소 추가' })
  async addPlace(
    @Param('tripId') tripId: string,
    @Param('dayId') dayId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddTripPlaceDto,
  ) {
    return this.tripsService.addPlace(tripId, dayId, userId, dto);
  }

  /** PUT /trips/:tripId/days/:dayId/places/reorder - 장소 순서 변경 */
  @UseGuards(JwtAuthGuard)
  @Put(':tripId/days/:dayId/places/reorder')
  @ApiBearerAuth()
  @ApiOperation({ summary: '장소 순서 변경' })
  async reorderPlaces(
    @Param('tripId') tripId: string,
    @Param('dayId') dayId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReorderPlacesDto,
  ) {
    return this.tripsService.reorderPlaces(tripId, dayId, userId, dto);
  }

  /** POST /trips/:tripId/clone - 여행 경로 클론 */
  @UseGuards(JwtAuthGuard)
  @Post(':tripId/clone')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: '여행 경로 클론' })
  async clone(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CloneTripDto,
  ) {
    return this.tripsService.clone(tripId, userId, dto);
  }

  /** POST /trips/:tripId/like - 좋아요 토글 */
  @UseGuards(JwtAuthGuard)
  @Post(':tripId/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: '좋아요 토글' })
  async toggleLike(@Param('tripId') tripId: string, @CurrentUser('id') userId: string) {
    return this.tripsService.toggleLike(tripId, userId);
  }

  /** POST /trips/:tripId/route/optimize - 경로 최적화 */
  @UseGuards(JwtAuthGuard)
  @Post(':tripId/route/optimize')
  @ApiBearerAuth()
  @ApiOperation({ summary: '경로 최적화' })
  async optimizeRoute(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: OptimizeRouteDto,
  ) {
    return this.tripsService.optimizeRoute(tripId, userId, dto);
  }
}
