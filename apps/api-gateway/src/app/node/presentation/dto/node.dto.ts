import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NodeDTO {
  @ApiProperty({ description: 'Уникальный идентификатор узла' })
  id!: string;

  @ApiProperty({ description: 'Название заметки или имя папки' })
  label!: string;

  @ApiPropertyOptional({ description: 'Текст заметки' })
  content?: string;

  @ApiProperty({ description: 'Теги', type: [String] })
  tags!: string[];

  @ApiPropertyOptional({ description: 'ID родительской папки', type: String, nullable: true })
  parentId?: string | null;

  @ApiProperty({ description: 'Ссылки на другие заметки', type: [String] })
  linksTo!: string[];

  @ApiProperty({ description: 'Тип узла', enum: ['file', 'folder'] })
  type!: string;

  @ApiProperty({ description: 'ID автора' })
  authorId!: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt!: string;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt!: string;

  constructor(props: NodeDTO) {
    Object.assign(this, props);
  }
}
