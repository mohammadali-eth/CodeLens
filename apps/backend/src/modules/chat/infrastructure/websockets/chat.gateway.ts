import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { StreamAIChatUseCase } from '../../application/use-cases/stream-ai-chat.use-case';

export interface ChatMessageEmitPayload {
  sessionId: string;
  userId: string;
  content: string;
  fileId?: string;
  filename?: string;
  lineStart?: number;
  lineEnd?: number;
  snippet?: string;
  aiProvider?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly streamAIChatUseCase: StreamAIChatUseCase) {}

  handleConnection(client: Socket): void {
    this.logger.log(`WebSocket Chat Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`WebSocket Chat Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    if (data && data.sessionId) {
      const room = `chat:${data.sessionId}`;
      void client.join(room);
      this.logger.log(`Client ${client.id} joined chat room ${room}`);
      client.emit('joined_chat', { sessionId: data.sessionId, room });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() payload: ChatMessageEmitPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { sessionId, userId, content } = payload;
    const room = `chat:${sessionId}`;

    this.logger.log(
      `Received chat message for session ${sessionId} from user ${userId}`,
    );

    // Emit Typing Indicator
    if (this.server) {
      this.server.to(room).emit('typing_start', { sessionId });
    }

    try {
      const result = await this.streamAIChatUseCase.execute({
        sessionId,
        userId,
        prompt: content,
        fileId: payload.fileId,
        filename: payload.filename,
        lineStart: payload.lineStart,
        lineEnd: payload.lineEnd,
        snippet: payload.snippet,
        aiProvider: payload.aiProvider,
        onToken: (chunk: string) => {
          client.emit('chat_token', {
            sessionId,
            chunk,
          });
        },
      });

      // Emit Completion Event
      client.emit('chat_completed', {
        sessionId,
        userMessageId: result.userMessage.id,
        assistantMessageId: result.assistantMessage.id,
        fullText: result.fullText,
        totalTokens: result.totalTokens,
        durationMs: result.durationMs,
      });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error streaming chat for session ${sessionId}: ${errMessage}`,
      );
      client.emit('chat_error', {
        sessionId,
        error: errMessage,
      });
    } finally {
      if (this.server) {
        this.server.to(room).emit('typing_end', { sessionId });
      }
    }
  }
}
