'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/use-auth';

/**
 * 로그인 페이지
 * 설계서 Section 6.2: POST /auth/login
 */
export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Trip-Path</h1>
        <p className="text-muted-foreground mt-2">여행 경로 플래닝 서비스</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="비밀번호"
            required
          />
        </div>

        {loginError && (
          <p className="text-sm text-destructive">
            로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.
          </p>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoggingIn ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {/* 소셜 로그인 (설계서 Section 6.2: POST /auth/oauth/{provider}) */}
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">또는</span>
          </div>
        </div>

        <button className="w-full py-2 px-4 border border-input rounded-md hover:bg-accent">
          Google로 로그인
        </button>
        <button className="w-full py-2 px-4 border border-input rounded-md hover:bg-accent">
          카카오로 로그인
        </button>
        <button className="w-full py-2 px-4 border border-input rounded-md hover:bg-accent">
          네이버로 로그인
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{' '}
        <Link href="/register" className="text-primary hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
