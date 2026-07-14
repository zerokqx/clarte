import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { cqrsGeneratorGenerator } from './cqrs-generator';
import { CqrsGeneratorGeneratorSchema } from './schema';

describe('cqrs-generator generator', () => {
  let tree: Tree;
  const options: CqrsGeneratorGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await cqrsGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
