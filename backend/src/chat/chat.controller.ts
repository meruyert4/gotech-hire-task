import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from '@/chat/chat.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat/rooms')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':roomId/messages')
  @ApiOperation({ summary: 'Get messages for a specific room' })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'offset', required: false, type: String })
  async getMessages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.chatService.getMessages(roomId, parsedLimit, parsedOffset);
  }
}
