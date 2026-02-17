import Link from 'next/link';

/**
 * 홈 페이지 (메인)
 * 설계서 Section 2.2: 사용자 여정 - 서비스 접속, 인기 경로 탐색
 */
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 히어로 섹션 */}
      <section className="text-center py-16 space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          여행을 계획하는 가장 쉬운 방법
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trip-Path와 함께 여행 경로를 체계적으로 계획하고, 저장하고, 공유하세요.
          장소 간 이동 경로 최적화, 예산 관리, 실시간 협업을 지원합니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/trips/new"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
          >
            새 여행 만들기
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 border border-input rounded-md hover:bg-accent font-medium"
          >
            여행 경로 탐색
          </Link>
        </div>
      </section>

      {/* 인기 여행 경로 (BR-DER-003) */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">인기 여행 경로</h2>
        {/* TODO: 인기 경로 목록 컴포넌트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 text-center text-muted-foreground">
            인기 여행 경로가 여기에 표시됩니다
          </div>
        </div>
      </section>

      {/* 팔로우 기반 피드 (BR-DER-004) */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">팔로우 피드</h2>
        {/* TODO: 팔로우 기반 피드 컴포넌트 */}
        <div className="border rounded-lg p-6 text-center text-muted-foreground">
          팔로우한 사용자의 여행 경로가 여기에 표시됩니다
        </div>
      </section>
    </div>
  );
}
