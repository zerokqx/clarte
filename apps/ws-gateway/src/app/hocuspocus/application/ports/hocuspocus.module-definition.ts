import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IHocuspocusOptions } from './hocuspocus.options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: HOCUSPOCUS_OPTIONS } =
  new ConfigurableModuleBuilder<IHocuspocusOptions>().build();
