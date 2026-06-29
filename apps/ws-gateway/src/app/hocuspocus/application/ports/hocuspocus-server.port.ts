import type { IncomingMessage } from 'http';
import type { Duplex } from 'node:stream';

export interface IHocuspocusServerPort {
  handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer): void;
}
