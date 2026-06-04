import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '@/chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const cookieString = client.handshake.headers.cookie;
      let token = null;
      if (cookieString) {
        const cookies = cookieString.split(';').map((c) => c.trim());
        const tokenCookie = cookies.find((c) => c.startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }

      if (!token) throw new Error('No auth token');

      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET is missing from environment variables');

      const payload = this.jwtService.verify(token, { secret });
      const user = await this.usersService.findOneById(payload.sub);

      if (!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect() {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.user) return;

    const roomKey = `room_${data.roomId}`;
    client.join(roomKey);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.user) return;

    const user = client.data.user;
    const message = await this.chatService.saveMessage(
      data.roomId,
      user.id,
      data.content,
      user.username,
    );

    const roomKey = `room_${data.roomId}`;
    this.server.to(roomKey).emit('newMessage', {
      ...message,
      username: user.username,
    });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.user) return;

    const roomKey = `room_${data.roomId}`;
    client.leave(roomKey);
  }
}
