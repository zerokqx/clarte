import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsISO8601 } from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Название задачи', example: 'Купить молоко' })
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Описание задачи', example: 'Купить 2 литра молока в магазине за углом' })
  readonly description!: string;

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty({ description: 'Дата выполнения задачи (ISO-8601)', example: '2026-06-20T18:00:00.000Z' })
  readonly dueDate!: string;
}
