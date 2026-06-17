import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Название задачи', example: 'Купить хлеб' })
  readonly title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Описание задачи', example: 'Купить ржаной хлеб в булочной' })
  readonly description?: string;

  @IsISO8601()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Дата выполнения задачи (ISO-8601)', example: '2026-06-21T18:00:00.000Z' })
  readonly due_date?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Статус выполнения задачи', example: true })
  readonly is_completed?: boolean;
}
