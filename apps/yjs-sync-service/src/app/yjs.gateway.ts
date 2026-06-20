import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { setupWSConnection } from '@y/websocket-server/utils';

@WebSocketGateway({ path: '/yjs' })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: IncomingMessage) {
    console.log(`[Yjs Server] Новое подключение по URL: ${request.url}`);
    
    // В Yjs WebSocket-провайдере имя комнаты передается в конце URL. Например: "/yjs/clarte-room"
    // Парсим имя комнаты:
    const docName = request.url ? request.url.replace('/yjs', '').replace(/^\//, '').split('?')[0] : 'clarte-room';
    const room = docName || 'clarte-room';
    
    console.log(`[Yjs Server] Подключение назначено в комнату: ${room}`);

    // Передаем сырое соединение ws и запрос в обработчик Yjs протокола
    setupWSConnection(connection, request, {
      docName: room,
      gc: true,
    });

    // Логируем входящие бинарные сообщения в консоль сервера для наглядности
    connection.on('message', (message: Buffer) => {
      console.log(`[Yjs Socket Message] Получен буфер от клиента (${message.length} байт):`, message);
      
      if (message.length > 0) {
        const type = message[0];
        if (type === 0) {
          console.log(` -> Тип: SYNC (Синхронизация документа). Подтип/Шаг: ${message[1]}`);
        } else if (type === 1) {
          console.log(` -> Тип: AWARENESS (Информация о курсорах/выделении пользователей)`);
        }
      }
    });
  }

  handleDisconnect(connection: WebSocket) {
    console.log('[Yjs Server] WebSocket отключен');
  }
}
