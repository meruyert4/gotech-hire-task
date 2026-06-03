import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@/rooms/entities/room.entity';
import { RoomsService } from '@/rooms/rooms.service';
import { RoomsController } from '@/rooms/rooms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
