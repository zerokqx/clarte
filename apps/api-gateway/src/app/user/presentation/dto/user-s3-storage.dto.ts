import { ApiProperty } from '@nestjs/swagger';

export class UserS3StorageDTO {
  @ApiProperty()
  public readonly urlPublic!: string;

  @ApiProperty()
  public readonly urlPresigned!: string;

  constructor(partial: Partial<UserS3StorageDTO>) {
    Object.assign(this, partial);
  }
}
