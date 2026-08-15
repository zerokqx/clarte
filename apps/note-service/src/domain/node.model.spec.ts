import { Node, CreateNodeDto, RestoreNodeDto } from './node.model';
import { InvalidLabel } from './exceptions';

describe('Node Domain Entity', () => {
  const defaultCreateDto: CreateNodeDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    label: 'Initial note label',
    content: 'Initial note content',
    tags: ['tag1', 'tag2'],
    bytes: new Uint8Array([1, 2, 3]),
    authorId: 'user-123',
    parentId: null,
    linksTo: ['link-1'],
    type: 'file',
  };

  const defaultRestoreDto: RestoreNodeDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    label: 'Restored label',
    content: 'Restored content',
    tags: ['tag-restored'],
    bytes: new Uint8Array([4, 5, 6]),
    authorId: 'user-456',
    parentId: 'parent-1',
    linksTo: ['link-2'],
    type: 'folder',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
  };

  describe('Factory methods', () => {
    it('should correctly create a new Node entity with default timestamps and props', () => {
      const beforeCreation = new Date();
      const node = Node.create(defaultCreateDto);
      const afterCreation = new Date();

      expect(node.id).toBe(defaultCreateDto.id);
      expect(node.label).toBe(defaultCreateDto.label);
      expect(node.content).toBe(defaultCreateDto.content);
      expect(node.tags).toEqual(defaultCreateDto.tags);
      expect(node.bytes).toEqual(defaultCreateDto.bytes);
      expect(node.authorId).toBe(defaultCreateDto.authorId);
      expect(node.parentId).toBeNull();
      expect(node.linksTo).toEqual(['link-1']);
      expect(node.type).toBe('file');

      expect(node.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(node.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      expect(node.updatedAt).toEqual(node.createdAt);
    });

    it('should throw error when label is empty during create', () => {
      expect(() =>
        Node.create({
          id: '123e4567-e89b-12d3-a456-426614174000',
          label: '',
          authorId: 'user-123',
        }),
      ).toThrow(InvalidLabel);
    });

    it('should assign fallback values for optional properties during creation', () => {
      const minimalDto: CreateNodeDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        label: 'Minimal',
        authorId: 'user-123',
      };

      const node = Node.create(minimalDto);

      expect(node.content).toBe('');
      expect(node.tags).toEqual([]);
      expect(node.bytes).toBeNull();
      expect(node.parentId).toBeNull();
      expect(node.linksTo).toEqual([]);
      expect(node.type).toBe('file');
    });

    it('should restore an existing Node entity with exact timestamps and properties', () => {
      const node = Node.restore(defaultRestoreDto);

      expect(node.id).toBe(defaultRestoreDto.id);
      expect(node.label).toBe(defaultRestoreDto.label);
      expect(node.content).toBe(defaultRestoreDto.content);
      expect(node.tags).toEqual(defaultRestoreDto.tags);
      expect(node.bytes).toEqual(defaultRestoreDto.bytes);
      expect(node.authorId).toBe(defaultRestoreDto.authorId);
      expect(node.parentId).toBe(defaultRestoreDto.parentId);
      expect(node.linksTo).toEqual(defaultRestoreDto.linksTo);
      expect(node.type).toBe('folder');
      expect(node.createdAt).toEqual(defaultRestoreDto.createdAt);
      expect(node.updatedAt).toEqual(defaultRestoreDto.updatedAt);
    });
  });

  describe('Business methods / State mutation', () => {
    let node: Node;

    beforeEach(() => {
      node = Node.restore(defaultRestoreDto);
    });

    it('should update label and change updatedAt timestamp', () => {
      const oldUpdatedAt = node.updatedAt;
      const newLabel = 'Updated label';

      node.changeLabel(newLabel);

      expect(node.label).toBe(newLabel);
      expect(node.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update content and change updatedAt timestamp', () => {
      const oldUpdatedAt = node.updatedAt;
      const newContent = 'Updated content string';

      node.changeContent(newContent);

      expect(node.content).toBe(newContent);
      expect(node.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update tags and change updatedAt timestamp', () => {
      const oldUpdatedAt = node.updatedAt;
      const newTags = ['new-tag-1', 'new-tag-2'];

      node.changeTags(newTags);

      expect(node.tags).toEqual(newTags);
      expect(node.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update bytes and change updatedAt timestamp', () => {
      const oldUpdatedAt = node.updatedAt;
      const newBytes = new Uint8Array([9, 9, 9]);

      node.changeBytes(newBytes);

      expect(node.bytes).toEqual(newBytes);
      expect(node.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update parentId and change updatedAt timestamp', () => {
      const oldUpdatedAt = node.updatedAt;
      const newParentId = 'new-parent-456';

      node.changeParentId(newParentId);

      expect(node.parentId).toBe(newParentId);
      expect(node.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update linksTo and change updatedAt timestamp', () => {
      const oldUpdatedAt = node.updatedAt;
      const newLinks = ['link-3', 'link-4'];

      node.changeLinksTo(newLinks);

      expect(node.linksTo).toEqual(newLinks);
      expect(node.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update type and change updatedAt timestamp', () => {
      const oldUpdatedAt = node.updatedAt;

      node.changeType('file');

      expect(node.type).toBe('file');
      expect(node.updatedAt).not.toEqual(oldUpdatedAt);
    });
  });

  describe('toPlain()', () => {
    it('should return a plain object representation of Node', () => {
      const node = Node.restore(defaultRestoreDto);
      const plain = node.toPlain();

      expect(plain).toEqual({
        id: defaultRestoreDto.id,
        label: defaultRestoreDto.label,
        content: defaultRestoreDto.content,
        tags: defaultRestoreDto.tags,
        bytes: defaultRestoreDto.bytes,
        authorId: defaultRestoreDto.authorId,
        parentId: defaultRestoreDto.parentId,
        linksTo: defaultRestoreDto.linksTo,
        type: defaultRestoreDto.type,
        createdAt: defaultRestoreDto.createdAt,
        updatedAt: defaultRestoreDto.updatedAt,
      });
    });
  });
});
