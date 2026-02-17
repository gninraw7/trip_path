import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CollaboratorRole } from '@trip-path/shared-types';

/**
 * 협업자 초대 DTO
 * 설계서 Section 6.6: POST /trips/{tripId}/collaborators
 * BR-COLLAB-001: OWNER만 초대 가능
 */
export class InviteCollaboratorDto {
  @ApiProperty({ example: 'friend@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: CollaboratorRole, example: CollaboratorRole.EDITOR })
  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}
