'use client';

import Link from 'next/link';
import { useAuthStore } from '../../stores/auth.store';

/**
 * 상단 네비게이션 헤더
 */
export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-primary">
          Trip-Path
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
            탐색
          </Link>
          {isAuthenticated && (
            <Link href="/trips/new" className="text-sm text-muted-foreground hover:text-foreground">
              새 여행
            </Link>
          )}
        </nav>

        {/* 사용자 메뉴 */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/notifications"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                알림
              </Link>
              <Link
                href={`/profile/${user?.username}`}
                className="text-sm font-medium"
              >
                {user?.displayName}
              </Link>
              <Link
                href="/settings"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                설정
              </Link>
              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
