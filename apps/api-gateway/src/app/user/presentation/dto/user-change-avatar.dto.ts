import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserChangeAvatarDTO {
  @ApiProperty()
  @IsString()
  public readonly avatarUrl!: string;

  constructor(partial: Partial<UserChangeAvatarDTO>) {
    Object.assign(this, partial);
  }
}
