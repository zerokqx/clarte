import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { cqrsCommandGenerator } from './cqrs-command';
import { CqrsCommandSchema } from './schema';

describe('cqrs-command generator', () => {
  let tree: Tree;
  const options: CqrsCommandSchema = { name: 'test', projectName: 'test-project' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await cqrsCommandGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test-project');
    expect(config).toBeDefined();
  });
});
