import { CollaboratorRole, CollaboratorStatus } from './enums';

/** 협업자 정보 (설계서 Section 5.2 collaborators 테이블) */
export interface Collaborator {
  id: string;
  tripId: string;
  userId: string;
  email: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  invitedAt: string;
  joinedAt: string | null;
}

/** 협업자 요약 (여행 상세 내 포함) */
export interface CollaboratorSummary {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: CollaboratorRole;
  status: CollaboratorStatus;
}

/** 협업자 초대 요청 (POST /trips/{tripId}/collaborators) */
export interface InviteCollaboratorRequest {
  email: string;
  role: CollaboratorRole;
}

/** 협업자 역할 변경 요청 */
export interface UpdateCollaboratorRoleRequest {
  role: CollaboratorRole;
}

/** 초대 수락 요청 */
export interface AcceptInviteRequest {
  inviteToken: string;
}

/** WebSocket 이벤트 타입 (설계서 Section 6.10) */
export enum WsClientEvent {
  TRIP_JOIN = 'trip:join',
  TRIP_LEAVE = 'trip:leave',
  PLACE_ADD = 'place:add',
  PLACE_UPDATE = 'place:update',
  PLACE_REMOVE = 'place:remove',
  PLACE_REORDER = 'place:reorder',
  CURSOR_MOVE = 'cursor:move',
}

export enum WsServerEvent {
  TRIP_JOINED = 'trip:joined',
  TRIP_USER_JOINED = 'trip:user_joined',
  TRIP_USER_LEFT = 'trip:user_left',
  PLACE_ADDED = 'place:added',
  PLACE_UPDATED = 'place:updated',
  PLACE_REMOVED = 'place:removed',
  PLACE_REORDERED = 'place:reordered',
  CURSOR_MOVED = 'cursor:moved',
  ERROR = 'error',
}

/** WebSocket place:add 이벤트 페이로드 */
export interface WsPlaceAddPayload {
  tripId: string;
  dayId: string;
  placeId: string;
  orderIndex: number;
  operationId: string;
}
