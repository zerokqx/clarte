import { ITodoReadRepository } from '@/application';
import { TodoReadModel } from '@/application/models';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TodoRepositoryRead implements ITodoReadRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getTodoById(id: string): Promise<TodoReadModel | null> {
    const result = await this.dataSource.query(
      `SELECT
        id,
        user_id AS "userId",
        is_completed AS "isCompleted",
        title,
        description,
        due_date AS "dueDate",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
       FROM todos
       WHERE id = $1
       LIMIT 1`,
      [id],
    );

    if (!result || result.length === 0) {
      return null;
    }
    const row = result[0];

    return new TodoReadModel(
      row.id,
      row.userId,
      row.isCompleted,
      row.title,
      row.description,
      row.dueDate,
      row.createdAt,
      row.updatedAt,
    );
  }

  async getAllTodosByUserId(userId: string): Promise<TodoReadModel[]> {
    const result = await this.dataSource.query(
      `SELECT
        id,
        user_id AS "userId",
        is_completed AS "isCompleted",
        title,
        description,
        due_date AS "dueDate",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
       FROM todos
       WHERE user_id = $1`,
      [userId],
    );

    return (result || []).map(
      (row: {
        id: string;
        userId: string;
        isCompleted: boolean;
        title: string;
        description: string;
        dueDate: Date;
        createdAt: Date;
        updatedAt: Date;
      }) =>
        new TodoReadModel(
          row.id,
          row.userId,
          row.isCompleted,
          row.title,
          row.description,
          row.dueDate,
          row.createdAt,
          row.updatedAt,
        ),
    );
  }
}
