import { Marks } from '@clarte/shared';
import { Body, Controller, Get, Param, Patch, Post, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { InjectTodoClient, type ITodoClient } from '@/app/todo/application';
import { CreateTodoDTO, UpdateTodoDTO, TodoDTO } from './dto';
import { type IJwtPayload } from '@clarte/shared-contracts/interfaces';
import { AccessGuard } from '@clarte/shared-nest/guards';
import { User } from '@clarte/shared-nest/decorators';

@Controller('todos')
export class TodoController extends Marks.Controller.Private {
  constructor(
    @InjectTodoClient()
    private readonly todoClient: ITodoClient,
  ) {
    super();
  }

  @Post()
  @AccessGuard()
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiOkResponse({ description: 'Успешно создано', schema: { properties: { id: { type: 'string' } } } })
  createTodo(
    @User() user: IJwtPayload,
    @Body() body: CreateTodoDTO,
  ): Observable<{ id: string }> {
    return this.todoClient.createTodo({
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      userId: user.sub,
    }).pipe(
      map((res) => ({ id: res.id })),
    );
  }

  @Patch(':id')
  @AccessGuard()
  @ApiOperation({ summary: 'Обновить существующую задачу' })
  @ApiOkResponse({ description: 'Успешно обновлено' })
  updateTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: IJwtPayload,
    @Body() body: UpdateTodoDTO,
  ): Observable<void> {
    return this.todoClient.updateTodo({
      id,
      userId: user.sub,
      title: body.title,
      description: body.description,
      dueDate: body.due_date,
      isCompleted: body.is_completed,
    });
  }

  @Get()
  @AccessGuard()
  @ApiOperation({ summary: 'Получить список задач текущего пользователя' })
  @ApiOkResponse({ type: [TodoDTO] })
  getUserTodos(@User() user: IJwtPayload): Observable<TodoDTO[]> {
    return this.todoClient.getUserTodos(user.sub).pipe(
      map((res) =>
        (res.todos || []).map(
          (t) =>
            new TodoDTO({
              id: t.id,
              userId: t.userId,
              title: t.title,
              description: t.description,
              isCompleted: t.isCompleted,
              dueDate: t.dueDate,
              createdAt: t.createdAt,
              updatedAt: t.updatedAt,
            }),
        ),
      ),
    );
  }
}
