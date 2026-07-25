import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendChatMessageDto {
  @ApiProperty({
    description: 'ID of the chat session',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  sessionId!: string;

  @ApiProperty({
    description: 'Prompt text content',
    example: 'Can you explain why line 45 has a potential race condition?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content!: string;

  @ApiPropertyOptional({
    description: 'Attached code file ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  fileId?: string;

  @ApiPropertyOptional({
    description: 'Attached filename',
    example: 'userService.ts',
  })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiPropertyOptional({
    description: 'Starting line number of attached snippet',
    example: 40,
  })
  @IsOptional()
  @IsNumber()
  lineStart?: number;

  @ApiPropertyOptional({
    description: 'Ending line number of attached snippet',
    example: 60,
  })
  @IsOptional()
  @IsNumber()
  lineEnd?: number;

  @ApiPropertyOptional({
    description: 'Source code snippet string',
    example: 'async function processOrder() { ... }',
  })
  @IsOptional()
  @IsString()
  snippet?: string;

  @ApiPropertyOptional({
    description: 'Override AI Provider choice',
    example: 'openai',
  })
  @IsOptional()
  @IsString()
  aiProvider?: string;

  @ApiPropertyOptional({
    description: 'Override AI Model choice',
    example: 'gpt-4o',
  })
  @IsOptional()
  @IsString()
  aiModel?: string;
}
