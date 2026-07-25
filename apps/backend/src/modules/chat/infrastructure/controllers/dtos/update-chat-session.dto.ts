import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChatSessionDto {
  @ApiPropertyOptional({
    description: 'Updated title for the chat session',
    example: 'Refactored Performance Discussion',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Toggle pinned state for session ordering',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
