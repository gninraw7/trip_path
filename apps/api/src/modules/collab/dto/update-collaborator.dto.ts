import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CollaboratorRole } from '@trip-path/shared-types';

export class UpdateCollaboratorDto {
  @ApiProperty({ enum: CollaboratorRole })
  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}
