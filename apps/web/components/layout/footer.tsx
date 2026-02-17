/**
 * 하단 푸터
 */
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-2">Trip-Path</h3>
            <p className="text-sm text-muted-foreground">
              여행 경로를 체계적으로 계획하고 공유하세요.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm">서비스</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>여행 경로 만들기</li>
              <li>장소 탐색</li>
              <li>실시간 협업</li>
              <li>예산 관리</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm">지원</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>이용약관</li>
              <li>개인정보처리방침</li>
              <li>문의하기</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          &copy; 2026 Trip-Path. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
