import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { Public } from '../../common/decorators/public.decorator';

/**
 * 통합 검색 컨트롤러
 * 설계서 Section 6.8: GET /search
 */
@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '통합 검색 (trips/places/users)' })
  async search(@Query() query: SearchDto) {
    return this.searchService.search(query);
  }
}
