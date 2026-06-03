import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Room } from '@/rooms/entities/room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  roomId: number;

  @Index()
  @Column()
  userId: number;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  senderName: string;

  @CreateDateColumn()
  createdAt: Date;
}
