import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '@/rooms/entities/room.entity';
import { CreateRoomDto } from '@/rooms/dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const { name, description } = createRoomDto;
    const existing = await this.roomsRepository.findOne({ where: { name } });
    if (existing) {
      return existing;
    }
    const room = this.roomsRepository.create({ name, description });
    return this.roomsRepository.save(room);
  }
}
