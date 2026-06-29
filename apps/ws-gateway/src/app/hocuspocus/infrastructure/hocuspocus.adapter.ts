import { Redis } from '@hocuspocus/extension-redis';
import { Server } from '@hocuspocus/server';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { IHocuspocusOptions, IHocuspocusServerPort } from '../application';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'node:stream';
import { InjectHocuspocusOptions } from '../application';
import { lastValueFrom } from 'rxjs';
import * as Y from 'yjs';

@Injectable()
export class HocuspocusAdapter implements IHocuspocusServerPort, OnModuleInit, OnModuleDestroy {
  public readonly server: Server;

  constructor(@InjectHocuspocusOptions() options: IHocuspocusOptions) {
    const redis = options.redis;
    this.server = new Server<{ sub: string }>({
      name: 'clarte-hocuspocus',
      extensions: [
        new Redis({
          port: redis.port,
          host: redis.host,
          options: {
            password: redis.password,
          },
        }),
      ],
      async onConnect(data) {
        Logger.log(`[Hocuspocus] onConnect: documentName=${data.documentName}`);
      },
      async onLoadDocument(data) {
        const source$ = options.noteClient.getBytes(data.documentName);
        const bytes = await lastValueFrom(source$);
        if (bytes && bytes.length > 0) {
          Y.applyUpdate(data.document, bytes);
        }
        return data.document;
      },
      async onStoreDocument(data) {
        const bytes = Y.encodeStateAsUpdate(data.document);
        const authorId = data.lastContext.sub || 'anonymous';
        const save$ = options.noteClient.saveNoteBytes(data.documentName, authorId, bytes);
        await lastValueFrom(save$);
        Logger.log(`[Hocuspocus] Document ${data.documentName} saved successfully!`);
      },

      async onChange(data) {
        Logger.log(`[Hocuspocus] onChange: documentName=${data.documentName}`);
      },
      async onAuthenticate(data) {
        const payload = await options.jwtValidator.validate(data.token);
        const access$ = options.noteClient.checkAccess(payload.sub, data.documentName);
        const access = await lastValueFrom(access$);
        if (!access) throw new Error('Access denied');
        return { sub: payload.sub };
      },
    });
  }

  public handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer): void {
    (this.server as any).crossws.handleUpgrade(request, socket, head);
  }

  async onModuleInit() {
    Logger.log('Hocuspocus server initialized');
  }

  async onModuleDestroy() {
    this.server.destroy();
  }
}
