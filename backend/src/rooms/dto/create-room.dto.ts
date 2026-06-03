import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'General Chat', description: 'The name of the room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'A room for general discussion',
    description: 'Optional description of the room',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
