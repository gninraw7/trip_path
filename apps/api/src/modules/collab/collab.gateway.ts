import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * 실시간 협업 WebSocket 게이트웨이
 * 설계서 Section 6.10: WebSocket API (실시간 협업)
 * ADR-002: WebSocket + CRDT 방식
 */
@WebSocketGateway({
  namespace: '/v1/ws',
  cors: { origin: '*' },
})
export class CollabGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CollabGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // TODO: JWT 토큰 검증
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // TODO: 편집 세션에서 사용자 제거
  }

  /** trip:join - 여행 편집 세션 참여 */
  @SubscribeMessage('trip:join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { tripId: string }) {
    client.join(`trip:${data.tripId}`);
    client.to(`trip:${data.tripId}`).emit('trip:user_joined', {
      userId: client.data.userId,
      socketId: client.id,
    });
    return { event: 'trip:joined', data: { tripId: data.tripId } };
  }

  /** trip:leave - 여행 편집 세션 이탈 */
  @SubscribeMessage('trip:leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { tripId: string }) {
    client.leave(`trip:${data.tripId}`);
    client.to(`trip:${data.tripId}`).emit('trip:user_left', {
      userId: client.data.userId,
    });
  }

  /** place:add - 장소 추가 (실시간 동기화) */
  @SubscribeMessage('place:add')
  handlePlaceAdd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string; dayId: string; placeId: string; orderIndex: number; operationId: string },
  ) {
    // TODO: 실제 DB 저장 로직 호출
    client.to(`trip:${data.tripId}`).emit('place:added', {
      ...data,
      userId: client.data.userId,
    });
  }

  /** place:update - 장소 정보 수정 */
  @SubscribeMessage('place:update')
  handlePlaceUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string; tripPlaceId: string; changes: Record<string, unknown> },
  ) {
    client.to(`trip:${data.tripId}`).emit('place:updated', {
      ...data,
      userId: client.data.userId,
    });
  }

  /** place:remove - 장소 삭제 */
  @SubscribeMessage('place:remove')
  handlePlaceRemove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string; tripPlaceId: string },
  ) {
    client.to(`trip:${data.tripId}`).emit('place:removed', {
      ...data,
      userId: client.data.userId,
    });
  }

  /** place:reorder - 장소 순서 변경 */
  @SubscribeMessage('place:reorder')
  handlePlaceReorder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string; dayId: string; placeOrders: Array<{ tripPlaceId: string; orderIndex: number }> },
  ) {
    client.to(`trip:${data.tripId}`).emit('place:reordered', {
      ...data,
      userId: client.data.userId,
    });
  }

  /** cursor:move - 커서 위치 공유 */
  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string; position: unknown },
  ) {
    client.to(`trip:${data.tripId}`).emit('cursor:moved', {
      userId: client.data.userId,
      position: data.position,
    });
  }
}
