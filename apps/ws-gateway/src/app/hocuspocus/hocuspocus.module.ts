import { Server } from '@hocuspocus/server';
import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Module({})
export class HocusPocusModuel implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(Co)
  private server: Server;

  onModuleInit() {
    this.server = new Server({
      port: 1234,
      onConnect()
    });
  }
}
