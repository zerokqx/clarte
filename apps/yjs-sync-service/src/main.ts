import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from '@y/websocket-server/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4444;
  
  await app.listen(port);
  
  const server = app.getHttpServer();
  const wss = new WebSocketServer({ noServer: true });
  
  server.on('upgrade', (request: any, socket: any, head: any) => {
    const pathname = request.url ? request.url.split('?')[0] : '';
    if (pathname.startsWith('/yjs')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (connection, request) => {
    console.log(`[Yjs Server] Новое подключение по URL: ${request.url}`);
    
    const parts = request.url ? request.url.split('/') : [];
    const room = parts[parts.length - 1]?.split('?')[0] || 'clarte-room';
    
    console.log(`[Yjs Server] Подключение назначено в комнату: ${room}`);

    setupWSConnection(connection, request, {
      docName: room,
      gc: true,
    });

    connection.on('message', (message: Buffer) => {
      console.log(`[Yjs Socket Message] Получен буфер от клиента (${message.length} байт):`, message);
      if (message.length > 0) {
        const type = message[0];
        if (type === 0) {
          console.log(` -> Тип: SYNC (Синхронизация документа). Подтип/Шаг: ${message[1]}`);
        } else if (type === 1) {
          console.log(` -> Тип: AWARENESS (Информация о курсорах/активности)`);
        }
      }
    });
  });

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🔌 Yjs WS Gateway listening on: ws://localhost:${port}/yjs/*`,
  );
}

bootstrap();


