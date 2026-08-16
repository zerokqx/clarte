import { Marks } from '@clarte/shared';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { InjectNodeClient, type INodeClient } from '@/app/node/application';
import { CreateNodeDTO, NodeDTO } from './dto';
import { type IJwtPayload } from '@clarte/shared-contracts/interfaces';
import { AccessGuard } from '@clarte/shared-nest/guards';
import { User } from '@clarte/shared-nest/decorators';

@ApiTags('Nodes')
@Controller('nodes')
export class NodeController extends Marks.Controller.Private {
  constructor(
    @InjectNodeClient()
    private readonly nodeClient: INodeClient,
  ) {
    super();
  }

  @Post()
  @AccessGuard()
  @ApiOperation({ summary: 'Создать новый узел (заметку или папку)' })
  @ApiOkResponse({
    description: 'Успешно создано',
    schema: { properties: { id: { type: 'string' } } },
  })
  createNode(@User() user: IJwtPayload, @Body() body: CreateNodeDTO): Observable<{ id: string }> {
    return this.nodeClient
      .createNode(user.sub, {
        label: body.label,
        content: body.content,
        tags: body.tags ?? [],
        parentId: body.parentId ?? undefined,
        linksTo: body.linksTo ?? [],
        type: body.type,
      })
      .pipe(map((res) => ({ id: res.id })));
  }

  @Get()
  @AccessGuard()
  @ApiOperation({ summary: 'Получить все узлы (заметки и папки) текущего пользователя' })
  @ApiOkResponse({ type: [NodeDTO] })
  getAllUserNodes(@User() user: IJwtPayload): Observable<NodeDTO[]> {
    return this.nodeClient.getAllUserNodes(user.sub).pipe(
      map((res) =>
        (res.notes || []).map(
          (n) =>
            new NodeDTO({
              id: n.id,
              label: n.label,
              content: n.content,
              tags: n.tags,
              parentId: n.parentId,
              linksTo: n.linksTo,
              type: n.type,
              authorId: n.authorId,
              createdAt: n.createdAt,
              updatedAt: n.updatedAt,
            }),
        ),
      ),
    );
  }

  @Get(':id')
  @AccessGuard()
  @ApiOperation({ summary: 'Получить узел по ID' })
  @ApiOkResponse({ type: NodeDTO })
  getNodeById(@Param('id') id: string): Observable<NodeDTO> {
    return this.nodeClient.getNodeById(id).pipe(
      map(
        (n) =>
          new NodeDTO({
            id: n.id,
            label: n.label,
            content: n.content,
            tags: n.tags,
            parentId: n.parentId,
            linksTo: n.linksTo,
            type: n.type,
            authorId: n.authorId,
            createdAt: n.createdAt,
            updatedAt: n.updatedAt,
          }),
      ),
    );
  }
}
