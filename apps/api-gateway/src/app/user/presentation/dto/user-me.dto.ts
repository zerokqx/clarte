import { ApiProperty } from '@nestjs/swagger';

export class UserMeDTO {
  @ApiProperty()
  public readonly id!: string;
  @ApiProperty()
  public readonly login!: string;
  @ApiProperty()
  public readonly avatarUrl!: string;

  constructor(partial: Partial<UserMeDTO>) {
    Object.assign(this, partial);
  }
}
