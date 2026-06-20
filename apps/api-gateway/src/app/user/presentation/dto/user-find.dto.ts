import { ApiProperty } from '@nestjs/swagger';

export class UserFindDTO {
  @ApiProperty()
  public readonly id!: string;
  @ApiProperty()
  public readonly login!: string;
  @ApiProperty()
  public readonly avatarUrl!: string;

  constructor(partial: Partial<UserFindDTO>) {
    Object.assign(this, partial);
  }
}
