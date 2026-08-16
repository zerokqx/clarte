import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNodeDTO {
  @ApiProperty({ description: 'Название заметки или имя папки', example: 'Моя первая заметка' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiPropertyOptional({ description: 'Текст / содержимое заметки', example: 'Привет, мир!' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Теги', example: ['work', 'ideas'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'ID родительской папки (null для корня)',
    example: null,
    type: String,
  })
  @IsString()
  @IsOptional()
  parentId?: string | null;

  @ApiPropertyOptional({ description: 'Ссылки на другие заметки', example: [], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  linksTo?: string[];

  @ApiPropertyOptional({
    description: 'Тип узла: file или folder',
    enum: ['file', 'folder'],
    default: 'file',
  })
  @IsIn(['file', 'folder'])
  @IsOptional()
  type?: 'file' | 'folder';
}
