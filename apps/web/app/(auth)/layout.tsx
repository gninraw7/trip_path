/**
 * 인증 페이지 레이아웃 (로그인, 회원가입, OAuth)
 * 네비게이션 바 없이 센터 정렬
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-md p-6">{children}</div>
    </div>
  );
}
