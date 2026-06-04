import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RoomsService } from '@/rooms/rooms.service';
import { CreateRoomDto } from '@/rooms/dto/create-room.dto';
import { UpdateRoomDto } from '@/rooms/dto/update-room.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chat rooms' })
  async getRooms() {
    return this.roomsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new chat room' })
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chat room' })
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat room' })
  async deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
