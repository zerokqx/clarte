import { ApiProperty } from '@nestjs/swagger';

export class TodoDTO {
  @ApiProperty()
  public readonly id!: string;

  @ApiProperty()
  public readonly userId!: string;

  @ApiProperty()
  public readonly title!: string;

  @ApiProperty()
  public readonly description!: string;

  @ApiProperty()
  public readonly isCompleted!: boolean;

  @ApiProperty()
  public readonly dueDate!: string;

  @ApiProperty()
  public readonly createdAt!: string;

  @ApiProperty()
  public readonly updatedAt!: string;

  constructor(partial: Partial<TodoDTO>) {
    Object.assign(this, partial);
  }
}
