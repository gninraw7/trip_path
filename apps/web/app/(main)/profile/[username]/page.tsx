'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../../../lib/api';

/**
 * 사용자 프로필 페이지
 * 설계서 Section 6.3: GET /users/{username}
 */
export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => usersApi.getPublicProfile(username),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 bg-muted rounded-full" />
          <div className="h-6 bg-muted rounded w-1/4" />
        </div>
      </div>
    );
  }

  const profile = data?.data;
  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start gap-6">
        {/* 프로필 아바타 */}
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">
          {profile.displayName[0]}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          {profile.bio && <p className="mt-2">{profile.bio}</p>}

          <div className="flex gap-6 mt-4 text-sm">
            <span>
              <strong>{profile.followerCount}</strong> 팔로워
            </span>
            <span>
              <strong>{profile.followingCount}</strong> 팔로잉
            </span>
            <span>
              <strong>{profile.publicTripCount}</strong> 공개 여행
            </span>
          </div>
        </div>
      </div>

      {/* TODO: 사용자의 공개 여행 경로 목록 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">공개 여행 경로</h2>
        <div className="border rounded-lg p-6 text-center text-muted-foreground">
          공개 여행 경로가 여기에 표시됩니다
        </div>
      </section>
    </div>
  );
}
