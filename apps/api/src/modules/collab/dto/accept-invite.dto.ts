import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteDto {
  @ApiProperty({ description: '초대 토큰' })
  @IsString()
  inviteToken: string;
}
