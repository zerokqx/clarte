import { ApiProperty } from '@nestjs/swagger';

export class UserMeDTO {
  @ApiProperty({ required: true })
  public readonly id!: string;
  @ApiProperty({ required: true })
  public readonly login!: string;
  @ApiProperty({ required: true })
  public readonly avatarUrl!: string;

  constructor(partial: Partial<UserMeDTO>) {
    Object.assign(this, partial);
  }
}
