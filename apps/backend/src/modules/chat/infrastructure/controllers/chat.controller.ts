import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { CreateChatSessionUseCase } from '../../application/use-cases/create-chat-session.use-case';
import { GetChatSessionUseCase } from '../../application/use-cases/get-chat-session.use-case';
import { UpdateChatSessionUseCase } from '../../application/use-cases/update-chat-session.use-case';
import { DeleteChatSessionUseCase } from '../../application/use-cases/delete-chat-session.use-case';
import { SendChatMessageUseCase } from '../../application/use-cases/send-chat-message.use-case';
import {
  GetSuggestedPromptsUseCase,
  SuggestedPrompt,
} from '../../application/use-cases/get-suggested-prompts.use-case';
import { CreateChatSessionDto } from './dtos/create-chat-session.dto';
import { UpdateChatSessionDto } from './dtos/update-chat-session.dto';
import { SendChatMessageDto } from './dtos/send-chat-message.dto';
import {
  ChatSessionResponseDto,
  ChatMessageResponseDto,
} from './dtos/chat-response.dto';

@ApiTags('Chat Engine')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly createChatSessionUseCase: CreateChatSessionUseCase,
    private readonly getChatSessionUseCase: GetChatSessionUseCase,
    private readonly updateChatSessionUseCase: UpdateChatSessionUseCase,
    private readonly deleteChatSessionUseCase: DeleteChatSessionUseCase,
    private readonly sendChatMessageUseCase: SendChatMessageUseCase,
    private readonly getSuggestedPromptsUseCase: GetSuggestedPromptsUseCase,
  ) {}

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new AI chat conversation session' })
  @ApiResponse({
    status: 201,
    description: 'Chat session successfully created.',
    type: ChatSessionResponseDto,
  })
  async createSession(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateChatSessionDto,
  ): Promise<ChatSessionResponseDto> {
    const session = await this.createChatSessionUseCase.execute(userId, dto);
    return session;
  }

  @Get('sessions')
  @ApiOperation({
    summary: 'List all active chat sessions for the authenticated user',
  })
  @ApiQuery({
    name: 'reviewId',
    required: false,
    description: 'Filter sessions by review ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user chat sessions.',
    type: [ChatSessionResponseDto],
  })
  async listSessions(
    @CurrentUser('sub') userId: string,
    @Query('reviewId') reviewId?: string,
  ): Promise<ChatSessionResponseDto[]> {
    const sessions = reviewId
      ? await this.getChatSessionUseCase.listReviewSessions(reviewId, userId)
      : await this.getChatSessionUseCase.listUserSessions(userId);

    return sessions;
  }

  @Get('prompts')
  @ApiOperation({
    summary: 'Get suggested prompt recommendations for a code review',
  })
  @ApiQuery({
    name: 'reviewId',
    required: false,
    description: 'Target Review ID for context-aware recommendations',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of suggested prompts.',
  })
  async getSuggestedPrompts(
    @Query('reviewId') reviewId?: string,
  ): Promise<SuggestedPrompt[]> {
    return this.getSuggestedPromptsUseCase.execute(reviewId);
  }

  @Get('sessions/:id')
  @ApiOperation({
    summary: 'Get details and message history of a chat session',
  })
  @ApiParam({ name: 'id', description: 'Chat Session UUID' })
  @ApiResponse({
    status: 200,
    description: 'Chat session details.',
    type: ChatSessionResponseDto,
  })
  async getSession(
    @CurrentUser('sub') userId: string,
    @Param('id') sessionId: string,
  ): Promise<ChatSessionResponseDto> {
    const session = await this.getChatSessionUseCase.execute(sessionId, userId);
    return session;
  }

  @Patch('sessions/:id')
  @ApiOperation({
    summary: 'Update title or toggle pinned status of a chat session',
  })
  @ApiParam({ name: 'id', description: 'Chat Session UUID' })
  @ApiResponse({
    status: 200,
    description: 'Updated chat session.',
    type: ChatSessionResponseDto,
  })
  async updateSession(
    @CurrentUser('sub') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: UpdateChatSessionDto,
  ): Promise<ChatSessionResponseDto> {
    const session = await this.updateChatSessionUseCase.execute(
      sessionId,
      userId,
      dto,
    );
    return session;
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a chat session' })
  @ApiParam({ name: 'id', description: 'Chat Session UUID' })
  @ApiResponse({
    status: 24,
    description: 'Chat session deleted successfully.',
  })
  async deleteSession(
    @CurrentUser('sub') userId: string,
    @Param('id') sessionId: string,
  ): Promise<void> {
    await this.deleteChatSessionUseCase.execute(sessionId, userId);
  }

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Post a message prompt to an active chat session and get AI response',
  })
  @ApiResponse({
    status: 201,
    description: 'User message and AI response successfully created.',
  })
  async sendMessage(
    @CurrentUser('sub') userId: string,
    @Body() dto: SendChatMessageDto,
  ): Promise<{
    userMessage: ChatMessageResponseDto;
    assistantMessage: ChatMessageResponseDto;
  }> {
    const result = await this.sendChatMessageUseCase.execute(userId, dto);
    return result;
  }

  @Get('messages/:sessionId')
  @ApiOperation({ summary: 'Get all messages for a given chat session' })
  @ApiParam({ name: 'sessionId', description: 'Chat Session UUID' })
  @ApiResponse({
    status: 200,
    description: 'Array of chat messages.',
    type: [ChatMessageResponseDto],
  })
  async listMessages(
    @CurrentUser('sub') userId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<ChatMessageResponseDto[]> {
    const session = await this.getChatSessionUseCase.execute(sessionId, userId);
    return session.messages;
  }
}
