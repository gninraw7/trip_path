import { apiClient } from '../api-client';
import type {
  ApiResponse,
  Collaborator,
  InviteCollaboratorRequest,
  UpdateCollaboratorRoleRequest,
  AcceptInviteRequest,
} from '@trip-path/shared-types';

/**
 * Collaboration API 클라이언트 함수
 * 설계서 Section 6.6: 협업 API
 */

/** POST /trips/:tripId/collaborators */
export async function inviteCollaborator(tripId: string, data: InviteCollaboratorRequest) {
  return apiClient.post<ApiResponse<Collaborator>>(`/trips/${tripId}/collaborators`, data);
}

/** PATCH /trips/:tripId/collaborators/:collaboratorId */
export async function updateCollaboratorRole(
  tripId: string,
  collaboratorId: string,
  data: UpdateCollaboratorRoleRequest,
) {
  return apiClient.patch<ApiResponse<Collaborator>>(
    `/trips/${tripId}/collaborators/${collaboratorId}`,
    data,
  );
}

/** DELETE /trips/:tripId/collaborators/:collaboratorId */
export async function removeCollaborator(tripId: string, collaboratorId: string) {
  return apiClient.delete<void>(`/trips/${tripId}/collaborators/${collaboratorId}`);
}

/** POST /trips/:tripId/collaborators/accept */
export async function acceptInvite(tripId: string, data: AcceptInviteRequest) {
  return apiClient.post<ApiResponse<{ tripId: string; role: string; joinedAt: string }>>(
    `/trips/${tripId}/collaborators/accept`,
    data,
  );
}
