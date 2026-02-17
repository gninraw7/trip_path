'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/use-auth';

/**
 * 회원가입 페이지
 * 설계서 Section 6.2: POST /auth/register
 * BR-CON-001: 사용자명 (영문, 숫자, 언더스코어, 3~30자)
 * BR-CON-002: 비밀번호 (최소 8자, 대소문자+숫자+특수문자)
 */
export default function RegisterPage() {
  const { register, isRegistering, registerError } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="text-muted-foreground mt-2">Trip-Path에 가입하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            사용자명
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="영문, 숫자, 언더스코어 (3~30자)"
            required
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-1">
            표시 이름
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={form.displayName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="화면에 표시될 이름"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
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
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="대소문자 + 숫자 + 특수문자 (최소 8자)"
            required
          />
        </div>

        {registerError && (
          <p className="text-sm text-destructive">회원가입에 실패했습니다.</p>
        )}

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isRegistering ? '가입 중...' : '가입하기'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-primary hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
