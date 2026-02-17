'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../../stores/auth.store';
import { authApi } from '../../../../lib/api';

/**
 * OAuth 콜백 페이지
 * 설계서 Section 6.2: POST /auth/oauth/{provider}
 * Google, Kakao, Naver 소셜 로그인 콜백 처리
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider') || 'google';

    if (!code) {
      router.push('/login');
      return;
    }

    authApi
      .oauthLogin(provider, {
        code,
        redirectUri: `${window.location.origin}/oauth/callback`,
      })
      .then((response) => {
        const { accessToken, refreshToken, user } = response.data;
        setAuth(user as any, accessToken, refreshToken);
        router.push('/');
      })
      .catch(() => {
        router.push('/login');
      });
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-muted-foreground">로그인 처리 중...</p>
    </div>
  );
}
