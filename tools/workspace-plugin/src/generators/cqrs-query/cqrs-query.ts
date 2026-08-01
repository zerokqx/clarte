import { formatFiles, generateFiles, readProjectConfiguration, names, type Tree } from '@nx/devkit';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { CqrsQuerySchema } from './schema';

const generatorDir = dirname(fileURLToPath(import.meta.url));

export async function cqrsQueryGenerator(tree: Tree, options: CqrsQuerySchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);
  const projectRoot = projectConfig.root;

  const resolvedNames = names(options.name);

  const targetPath = join(projectRoot, 'src/application/queries', resolvedNames.fileName);

  generateFiles(tree, join(generatorDir, 'files'), targetPath, {
    ...options,
    ...resolvedNames,
  });

  await formatFiles(tree);
}

export default cqrsQueryGenerator;
