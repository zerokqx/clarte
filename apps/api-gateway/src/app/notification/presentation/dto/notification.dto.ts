import { ApiProperty } from '@nestjs/swagger';

export class NotificationDTO {
  @ApiProperty()
  public readonly id!: string;

  @ApiProperty()
  public readonly title!: string;

  @ApiProperty()
  public readonly text!: string;

  @ApiProperty()
  public readonly createdAt!: string;

  constructor(partial: Partial<NotificationDTO>) {
    Object.assign(this, partial);
  }
}
