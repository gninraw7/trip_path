'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../lib/api';

/**
 * 설정 페이지 (프로필 수정)
 * 설계서 Section 6.3: PATCH /users/me
 */
export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.getMyProfile(),
  });

  const [form, setForm] = useState({ displayName: '', bio: '' });

  useEffect(() => {
    if (data?.data) {
      setForm({
        displayName: data.data.displayName || '',
        bio: data.data.bio || '',
      });
    }
  }, [data]);

  const updateProfile = useMutation({
    mutationFn: (values: { displayName?: string; bio?: string }) =>
      usersApi.updateMyProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(form);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">설정</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-1">
            표시 이름
          </label>
          <input
            id="displayName"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            자기소개
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {updateProfile.isPending ? '저장 중...' : '저장'}
        </button>

        {updateProfile.isSuccess && (
          <p className="text-sm text-green-600">프로필이 업데이트되었습니다.</p>
        )}
      </form>
    </div>
  );
}
