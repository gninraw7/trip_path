import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { SearchPlacesDto } from './dto/search-places.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

/**
 * 장소 컨트롤러
 * 설계서 Section 6.5: 장소 API
 */
@ApiTags('Places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  /** GET /places/search - 장소 검색 */
  @Public()
  @Get('search')
  @ApiOperation({ summary: '장소 검색' })
  async search(@Query() query: SearchPlacesDto, @CurrentUser('id') userId?: string) {
    return this.placesService.search(query, userId);
  }

  /** GET /places/:placeId - 장소 상세 조회 */
  @Public()
  @Get(':placeId')
  @ApiOperation({ summary: '장소 상세 조회' })
  async findOne(@Param('placeId') placeId: string, @CurrentUser('id') userId?: string) {
    return this.placesService.findOne(placeId, userId);
  }

  /** POST /places/:placeId/favorite - 즐겨찾기 토글 */
  @UseGuards(JwtAuthGuard)
  @Post(':placeId/favorite')
  @ApiBearerAuth()
  @ApiOperation({ summary: '장소 즐겨찾기 토글' })
  async toggleFavorite(
    @Param('placeId') placeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.placesService.toggleFavorite(placeId, userId);
  }
}
