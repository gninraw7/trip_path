'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collabApi } from '../../lib/api';
import type { CollaboratorSummary, CollaboratorRole } from '@trip-path/shared-types';

/**
 * 협업자 패널 컴포넌트
 * 설계서 Section 6.6: Collaboration API
 * BR-COLLAB-001: OWNER만 초대 가능
 * BR-COLLAB-002: 역할별 권한 표시
 */
interface CollabPanelProps {
  tripId: string;
  collaborators: CollaboratorSummary[];
  isOwner: boolean;
}

export function CollabPanel({ tripId, collaborators, isOwner }: CollabPanelProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CollaboratorRole>('EDITOR' as CollaboratorRole);
  const queryClient = useQueryClient();

  const invite = useMutation({
    mutationFn: () => collabApi.inviteCollaborator(tripId, { email, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      setEmail('');
    },
  });

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold">협업자</h3>

      {/* 협업자 목록 */}
      <ul className="space-y-2">
        {collaborators.map((collab) => (
          <li key={collab.userId} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                {collab.displayName[0]}
              </div>
              <div>
                <span className="font-medium">{collab.displayName}</span>
                <span className="text-xs text-muted-foreground ml-1">@{collab.username}</span>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-muted rounded">{collab.role}</span>
          </li>
        ))}
      </ul>

      {/* 초대 폼 (OWNER만 표시) */}
      {isOwner && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">협업자 초대</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-input rounded-md bg-background text-sm"
              placeholder="이메일 주소"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as CollaboratorRole)}
              className="px-2 py-1.5 border border-input rounded-md bg-background text-sm"
            >
              <option value="EDITOR">편집자</option>
              <option value="VIEWER">뷰어</option>
            </select>
            <button
              onClick={() => invite.mutate()}
              disabled={!email || invite.isPending}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              초대
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
