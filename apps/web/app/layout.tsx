import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Trip-Path - 여행 경로 플래닝 서비스',
    template: '%s | Trip-Path',
  },
  description:
    '여행 경로를 체계적으로 계획하고, 저장하고, 공유하세요. 장소 간 이동 경로 최적화, 예산 관리, 실시간 협업 기능을 제공합니다.',
  keywords: ['여행', '여행 계획', '경로 플래닝', '여행 경로', 'trip planner'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
