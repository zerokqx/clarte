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
        const source$ = options.noteClient.getBytes(data.documentName);
        const bytes = await lastValueFrom(source$);
        Logger.log(bytes)
        if (bytes && bytes.length > 0) {
          Y.applyUpdate(data.document, bytes);
        }
        return data.document;
      },
      async onStoreDocument(data) {
        const bytes = Y.encodeStateAsUpdate(data.document);
        // We get authorId from the context set in onAuthenticate
        const authorId = data.lastContext.sub || 'anonymous';
        const save$ = options.noteClient.saveNoteBytes(
          data.documentName,
          "",
          bytes,
        );
        await lastValueFrom(save$);
        Logger.log(`[Hocuspocus] Document ${data.documentName} saved successfully!`);
      },

      async onChange(data) {
        Logger.log(`[Hocuspocus] onChange: documentName=${data.documentName}`);
      },
      async onAuthenticate(data) {
        // const payload = await options.jwtValidator.validate(data.token);
        // const access$ = options.noteAccessChecker.check(
        //   payload.sub,
        //   data.documentName,
        // );
        // const access = await lastValueFrom(access$);
        // if (!access) throw new Error('Access denied');
        // return { sub: payload.sub };
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
