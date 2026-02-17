import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CollabService } from './collab.service';
import { InviteCollaboratorDto } from './dto/invite-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * 협업 컨트롤러
 * 설계서 Section 6.6: 협업 API
 */
@ApiTags('Collaboration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('trips/:tripId/collaborators')
export class CollabController {
  constructor(private readonly collabService: CollabService) {}

  /** POST /trips/:tripId/collaborators - 협업자 초대 */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '협업자 초대' })
  async invite(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: InviteCollaboratorDto,
  ) {
    return this.collabService.invite(tripId, userId, dto);
  }

  /** PATCH /trips/:tripId/collaborators/:collaboratorId - 역할 변경 */
  @Patch(':collaboratorId')
  @ApiOperation({ summary: '협업자 역할 변경' })
  async updateRole(
    @Param('tripId') tripId: string,
    @Param('collaboratorId') collaboratorId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCollaboratorDto,
  ) {
    return this.collabService.updateRole(tripId, collaboratorId, userId, dto);
  }

  /** DELETE /trips/:tripId/collaborators/:collaboratorId - 협업자 제거 */
  @Delete(':collaboratorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '협업자 제거' })
  async remove(
    @Param('tripId') tripId: string,
    @Param('collaboratorId') collaboratorId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.collabService.remove(tripId, collaboratorId, userId);
  }

  /** POST /trips/:tripId/collaborators/accept - 초대 수락 */
  @Post('accept')
  @ApiOperation({ summary: '초대 수락' })
  async acceptInvite(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AcceptInviteDto,
  ) {
    return this.collabService.acceptInvite(tripId, userId, dto);
  }
}
