import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '@/rooms/entities/room.entity';
import { CreateRoomDto } from '@/rooms/dto/create-room.dto';
import { UpdateRoomDto } from '@/rooms/dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) { }

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

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    Object.assign(room, updateRoomDto);
    return this.roomsRepository.save(room);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roomsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}
