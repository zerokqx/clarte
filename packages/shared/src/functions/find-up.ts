import { existsSync } from 'fs';
import { dirname, join } from 'path';

export type FindUpType = 'file' | 'directory';

export interface FindUpOptions {
  type?: FindUpType;
  stopAt?: string;
}

export const findUp = (name: string, from: string, options: FindUpOptions = {}): string | null => {
  const { type = 'directory', stopAt } = options;
  const target = join(from, name);

  if (existsSync(target)) return target;

  const parent = dirname(from);
  if (parent === from || parent === stopAt) return null;

  return findUp(name, parent, options);
};
