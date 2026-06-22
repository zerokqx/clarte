import { Server } from '@hocuspocus/server';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type {
  IHocuspocusOptions,
  IHocuspocusServerPort,
} from '../application/ports';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'node:stream';
import { InjectHocuspocusOptions } from '../application/decorators';
import { lastValueFrom } from 'rxjs';
import * as Y from 'yjs';

@Injectable()
export class HocuspocusAdapter
  implements IHocuspocusServerPort, OnModuleInit, OnModuleDestroy
{
  public readonly server: Server;

  constructor(
    @InjectHocuspocusOptions() private readonly options: IHocuspocusOptions,
  ) {
    this.server = new Server<{ sub: string }>({
      name: 'clarte-hocuspocus',
      async onConnect(data) {
        Logger.log(`[Hocuspocus] onConnect: documentName=${data.documentName}`);
      },
      async onLoadDocument(data) {
        const source$ = options.noteClient.getBytes(data.context.sub);
        const bytes = await lastValueFrom(source$);
        if (bytes) {
          Y.applyUpdate(data.document, bytes);
        }
        return data.document;
      },

      async onChange(data) {
        Logger.log(`[Hocuspocus] onChange: documentName=${data.documentName}`);
      },
      async onAuthenticate(data) {
        const payload = await options.jwtValidator.validate(data.token);
        const access$ = options.noteClient.checkAccess(
          payload.sub,
          data.documentName,
        );
        const access = await lastValueFrom(access$);
        if (!access) throw new Error('Access denided');
        return { sub: payload.sub };
      },
    });
  }

  public handleUpgrade(
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ): void {
    (this.server as any).crossws.handleUpgrade(request, socket, head);
  }

  async onModuleInit() {
    Logger.log('Hocuspocus server initialized');
  }

  async onModuleDestroy() {
    this.server.destroy();
  }
}
