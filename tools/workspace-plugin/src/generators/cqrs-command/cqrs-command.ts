import { formatFiles, generateFiles, readProjectConfiguration, names, type Tree } from '@nx/devkit';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { CqrsCommandSchema } from './schema';

const generatorDir = dirname(fileURLToPath(import.meta.url));

export async function cqrsCommandGenerator(tree: Tree, options: CqrsCommandSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);
  const projectRoot = projectConfig.root;

  const resolvedNames = names(options.name);

  const targetPath = join(projectRoot, 'src/application/commands', resolvedNames.fileName);

  generateFiles(tree, join(generatorDir, 'files'), targetPath, {
    ...options,
    ...resolvedNames,
  });

  await formatFiles(tree);
}

export default cqrsCommandGenerator;
