import { nullThrow, Token } from '@clarte/shared';
import { findUp } from '../../functions';
import { DynamicModule, Module } from '@nestjs/common';

interface FolderPathModuleOptions {
  name: Token;
  folderName: string;
  from?: string;
}

@Module({})
class FolderPathModule {}

export function createFolderPathModule(options: FolderPathModuleOptions): DynamicModule {
  return {
    module: FolderPathModule,
    global: true,
    providers: [
      {
        provide: options.name,
        useValue: nullThrow(findUp, `${options.folderName} is not found`)(
          options.folderName,
          options.from ?? process.cwd(),
        ),
      },
    ],
    exports: [options.name],
  };
}


