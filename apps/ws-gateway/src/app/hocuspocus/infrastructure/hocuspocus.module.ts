import { Module } from '@nestjs/common';
import { HocuspocusAdapter } from './hocuspocus.adapter';
import {
  ConfigurableModuleClass,
  HOCUSPOCUS_SERVER,
} from '../application/ports';

const hocuspocusProvider = {
  provide: HOCUSPOCUS_SERVER,
  useClass: HocuspocusAdapter,
};

@Module({
  providers: [hocuspocusProvider],
  exports: [hocuspocusProvider],
})
export class HocuspocusModule extends ConfigurableModuleClass {}
