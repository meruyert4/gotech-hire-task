import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Message } from '@/chat/entities/message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
