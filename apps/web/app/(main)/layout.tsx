import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';

/**
 * 메인 레이아웃 (인증 후 페이지)
 * 상단 네비게이션 + 하단 푸터
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
