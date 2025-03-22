import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload;
    let userRegistered: User;
    try {
      payload = this.jwtService.verify(token);
      console.log('Payload', payload);
      await this.messagesWsService.registerClient(client, payload.id);
      userRegistered = this.messagesWsService.getUserRegistered(client.id);
    } catch (e) {
      client.disconnect();
      return;
    }

    console.log({
      action: 'handleConnection',
      clientId: client.id,
      connected: this.messagesWsService.getConnectedClients().length,
      clients: this.messagesWsService.getConnectedClients(),
      args,
    });
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
    this.wss.emit('message-from-server', {
      action: 'connectionsFromServer',
      fullName: userRegistered.fullName,
      clientId: client.id,
      connected: this.messagesWsService.getConnectedClients().length,
      clients: this.messagesWsService.getConnectedClients(),
      args,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
    this.messagesWsService.removeClient(client);
    console.log({
      connectedClients: this.messagesWsService.getConnectedClients(),
    });
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log('Message received', client.id, payload);
    const payloadServer = {
      id: 'Server',
      message: payload.message,
    };
    // client.broadcast.emit('message-from-server', payloadServer);
    const userRegistered = this.messagesWsService.getUserRegistered(client.id);
    this.wss.emit('message-from-server', userRegistered);
    //this.wss.to(client.id).emit('message-from-server', payloadServer);
  }
}
