import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '@/chat/entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async getMessages(
    roomId: number,
    limit = 50,
    offset = 0,
  ): Promise<(Message & { username: string })[]> {
    const messages = await this.messageRepository.find({
      where: { roomId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return messages.reverse().map((msg) => ({
      ...msg,
      username: msg.user ? msg.user.username : 'unknown',
    }));
  }

  async saveMessage(
    roomId: number,
    userId: number,
    content: string,
    senderName: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      roomId,
      userId,
      content,
      senderName,
    });
    return this.messageRepository.save(message);
  }
}
