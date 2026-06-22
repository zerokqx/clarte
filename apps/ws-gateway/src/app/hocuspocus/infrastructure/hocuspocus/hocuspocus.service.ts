import { Server } from '@hocuspocus/server';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class HocusPocusService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(HocusPocusService.name);
  private server: Server;

  onModuleInit() {
    this.server = new Server({
      port: 1234,
      onConnect: async () => {
        this.logger.log('Hocuspocus server is started');
      },
    });
  }
}
