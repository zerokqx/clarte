type ProtoNames = 'user' | 'auth' | 'notes' | 'todo';

/**
 * Возвращает абсолютный путь к proto-файлу из библиотеки shared-contracts.
 * @param protoName Имя файла (например, 'user' или 'user.proto')
 */
export function getProtoPath(protoName: ProtoNames): string {
  return `packages/shared-contracts/src/ports/proto/${protoName}.proto`;
}
