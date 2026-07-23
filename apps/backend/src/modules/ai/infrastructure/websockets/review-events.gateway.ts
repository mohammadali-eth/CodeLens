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

export interface ReviewProgressPayload {
  reviewId: string;
  status: string;
  progress: number; // 0 to 100
  message?: string;
  payload?: unknown;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/reviews',
})
export class ReviewEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ReviewEventsGateway.name);

  handleConnection(client: Socket): void {
    this.logger.log(`WebSocket Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`WebSocket Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_review')
  handleSubscribeReview(
    @MessageBody() data: { reviewId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    if (data && data.reviewId) {
      const room = `review:${data.reviewId}`;
      void client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);
      client.emit('subscribed', { reviewId: data.reviewId, room });
    }
  }

  emitStatusUpdate(payload: ReviewProgressPayload): void {
    const room = `review:${payload.reviewId}`;
    this.logger.log(
      `Broadcasting status update for review ${payload.reviewId}: ${payload.status} (${payload.progress}%)`,
    );

    if (this.server) {
      this.server.to(room).emit('review_progress', payload);
      this.server.emit('global_review_progress', payload);
    }
  }
}
