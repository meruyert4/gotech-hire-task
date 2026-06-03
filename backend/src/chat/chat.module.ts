import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '@/chat/entities/message.entity';
import { ChatService } from '@/chat/chat.service';
import { ChatGateway } from '@/chat/chat.gateway';
import { ChatController } from '@/chat/chat.controller';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    AuthModule,
    UsersModule,
    JwtModule,
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
