import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateRoomDto {
    @ApiPropertyOptional({ example: 'General Chat', description: 'The name of the room' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        example: 'A room for general discussion',
        description: 'Optional description of the room, send null to clear',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => (value === null ? null : value))
    description?: string | null;
}
