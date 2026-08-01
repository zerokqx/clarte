import { Todo } from './todo.model';
import { LengthTitleInvalidException } from './exceptions';

describe('Todo Domain Entity', () => {
  const defaultCreateDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    isCompleted: false,
    title: 'Valid title text',
    description: 'Valid description text',
    dueDate: new Date('2024-01-02T12:00:00Z'),
  };

  const defaultRestoreDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    isCompleted: true,
    title: 'Restored title',
    description: 'Restored desc',
    dueDate: new Date('2024-01-02T12:00:00Z'),
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-01-01T12:00:00Z'),
    isDeleted: true,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('create()', () => {
    it('должен успешно создавать задачу с валидными данными', () => {
      const todo = Todo.create(defaultCreateDto);

      expect(todo.id).toBe(defaultCreateDto.id);
      expect(todo.userId).toBe(defaultCreateDto.userId);
      expect(todo.title).toBe(defaultCreateDto.title);
      expect(todo.description).toBe(defaultCreateDto.description);
      expect(todo.dueDate).toEqual(defaultCreateDto.dueDate);
      expect(todo.isCompleted).toBe(defaultCreateDto.isCompleted);
      expect(todo.isDeleted).toBe(false);
      expect(todo.createdAt).toEqual(new Date('2024-01-01T12:00:00Z'));
      expect(todo.updatedAt).toEqual(new Date('2024-01-01T12:00:00Z'));
    });

    it('должен выбрасывать ошибку при невалидном title', () => {
      expect(() => {
        Todo.create({ ...defaultCreateDto, title: 'short' });
      }).toThrow(LengthTitleInvalidException);
    });
  });

  describe('restore()', () => {
    it('должен корректно восстанавливать задачу из сырых данных', () => {
      const todo = Todo.restore(defaultRestoreDto);

      expect(todo.id).toBe(defaultRestoreDto.id);
      expect(todo.userId).toBe(defaultRestoreDto.userId);
      expect(todo.title).toBe(defaultRestoreDto.title);
      expect(todo.description).toBe(defaultRestoreDto.description);
      expect(todo.dueDate).toEqual(defaultRestoreDto.dueDate);
      expect(todo.isCompleted).toBe(defaultRestoreDto.isCompleted);
      expect(todo.isDeleted).toBe(defaultRestoreDto.isDeleted);
      expect(todo.createdAt).toEqual(defaultRestoreDto.createdAt);
      expect(todo.updatedAt).toEqual(defaultRestoreDto.updatedAt);
    });
  });

  describe('behavior methods', () => {
    let todo: Todo;

    beforeEach(() => {
      todo = Todo.restore({ ...defaultRestoreDto });
      jest.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    });

    it('changeTitle() должен обновлять заголовок и updatedAt', () => {
      const newTitle = 'New valid title text';
      todo.changeTitle(newTitle);
      expect(todo.title).toBe(newTitle);
      expect(todo.updatedAt).toEqual(new Date('2025-01-01T12:00:00Z'));
    });

    it('changeDescription() должен обновлять описание и updatedAt', () => {
      const newDesc = 'New valid desc text!';
      todo.changeDescription(newDesc);
      expect(todo.description).toBe(newDesc);
      expect(todo.updatedAt).toEqual(new Date('2025-01-01T12:00:00Z'));
    });

    it('changeDueDate() должен обновлять дату и updatedAt', () => {
      const newDate = new Date('2025-01-02T12:00:00Z');
      todo.changeDueDate(newDate);
      expect(todo.dueDate).toEqual(newDate);
      expect(todo.updatedAt).toEqual(new Date('2025-01-01T12:00:00Z'));
    });

    it('completed() должен делать задачу выполненной', () => {
      todo.uncompleted(); // Сначала сделаем невыполненной
      todo.completed();
      expect(todo.isCompleted).toBe(true);
      expect(todo.updatedAt).toEqual(new Date('2025-01-01T12:00:00Z'));
    });

    it('uncompleted() должен делать задачу невыполненной', () => {
      todo.uncompleted();
      expect(todo.isCompleted).toBe(false);
      expect(todo.updatedAt).toEqual(new Date('2025-01-01T12:00:00Z'));
    });

    it('delete() должен помечать задачу удаленной', () => {
      todo.delete();
      expect(todo.isDeleted).toBe(true);
      expect(todo.updatedAt).toEqual(new Date('2025-01-01T12:00:00Z'));
    });
  });

  describe('toPlain()', () => {
    it('должен возвращать плоский объект свойств задачи', () => {
      const todo = Todo.restore(defaultRestoreDto);
      const plain = todo.toPlain();

      expect(plain).toEqual({
        id: defaultRestoreDto.id,
        userId: defaultRestoreDto.userId,
        isCompleted: defaultRestoreDto.isCompleted,
        title: defaultRestoreDto.title,
        description: defaultRestoreDto.description,
        dueDate: defaultRestoreDto.dueDate.toISOString(),
        createdAt: defaultRestoreDto.createdAt.toISOString(),
        updatedAt: defaultRestoreDto.updatedAt.toISOString(),
      });
    });
  });
});
