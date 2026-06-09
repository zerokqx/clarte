type ProtoNames = 'user' | 'auth';
/**
 * Возвращает абсолютный путь к proto-файлу из библиотеки shared.
 * @param protoName Имя файла (например, 'user' или 'user.proto')
 */
export function getProtoPath(protoName: ProtoNames): string {
  return `packages/shared/src/contracts/user/${protoName}.proto`;
}
