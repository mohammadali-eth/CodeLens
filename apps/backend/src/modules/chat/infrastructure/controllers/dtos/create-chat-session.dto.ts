import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatSessionDto {
  @ApiPropertyOptional({
    description: 'Title for the chat session',
    example: 'Code Architecture Refactor Q&A',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Associated Review ID for context attachment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  reviewId?: string;

  @ApiPropertyOptional({
    description: 'Preferred AI Provider (gemini, openai, ollama, mock)',
    example: 'gemini',
    default: 'gemini',
  })
  @IsOptional()
  @IsString()
  aiProvider?: string;

  @ApiPropertyOptional({
    description: 'Target AI Model name',
    example: 'gemini-1.5-pro',
  })
  @IsOptional()
  @IsString()
  aiModel?: string;
}
