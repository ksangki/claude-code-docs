/**
 * Ch.08 CLAUDE.md 설정 — Google Slides 빌더
 */

function buildChapter08() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.08 CLAUDE.md 설정');

  addTitleSlide(p, 'Ch.08 CLAUDE.md 설정',
    '실무자를 위한 메모리 파일 작성법',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    'CLAUDE.md에 포함할 것 / 제외할 것',
    '파일 위치와 우선순위 재확인',
    '@include 경로 구문 완전 가이드',
    '프론트매터 경로 타겟팅 사용 예',
    'TypeScript 프로젝트 실전 예시',
    '/init으로 자동 생성하기',
    '/memory로 편집 반영',
    '파일 제외 (claudeMdExcludes)'
  ]);

  addTextSlide(p, 'CLAUDE.md의 목적',
    '세션마다 자동 로드되는 지속적 프로젝트 지식.\n\n' +
    '[왜 필요한가]\n' +
    '• 매번 프로젝트 컨벤션·빌드 시스템 설명 반복 불필요\n' +
    '• 팀 공유 지식을 코드로 버전 관리\n' +
    '• Claude의 실수 감소 → 리뷰 부담 감소\n\n' +
    '핵심 원칙: 빠진 경우 실수를 일으킬 지시사항만.'
  );

  addTwoColumnSlide(p, '포함 vs 제외',
    '포함할 것',
    [
      '정확한 빌드/테스트/lint 커맨드',
      '아키텍처 결정 (레이어 규칙)',
      '프로젝트 고유 컨벤션',
      '환경 설정 요구사항',
      '일반적 함정 / 패턴',
      '모노레포 구조 · 책임'
    ],
    '제외할 것',
    [
      'Claude가 이미 아는 것',
      '자명한 알림',
      '민감 데이터 (API 키 등)',
      '자주 변경되는 정보',
      '티켓 번호, 임시 노트'
    ]
  );

  addTextSlide(p, '테스트',
    '한 줄 한 줄이 이 테스트를 통과해야 함:\n\n' +
    '"이 줄을 제거하면 Claude가 이 코드베이스에서 실수를 할까?"\n\n' +
    'No → 즉시 삭제.\n\n' +
    '[이유]\n' +
    '• 노이즈는 신호를 덮는다\n' +
    '• 매 세션 컨텍스트 비용\n' +
    '• 40,000자 한계 소모'
  );

  addTableSlide(p, '파일 위치 (재확인)', [
    ['파일', '타입', '용도'],
    ['/etc/claude-code/CLAUDE.md', 'Managed', '관리자 시스템 전체'],
    ['~/.claude/CLAUDE.md', 'User', '모든 프로젝트 개인 전역'],
    ['~/.claude/rules/*.md', 'User', '모듈식 전역 규칙'],
    ['CLAUDE.md (루트)', 'Project', '팀 공유, 커밋'],
    ['.claude/CLAUDE.md', 'Project', '대안 위치'],
    ['.claude/rules/*.md', 'Project', '모듈식 프로젝트 규칙'],
    ['CLAUDE.local.md', 'Local', '개인, gitignore']
  ]);

  addTextSlide(p, '로딩 순서 (요약)',
    'Managed (lowest)\n' +
    '   ↓\n' +
    'User (~/.claude/...)\n' +
    '   ↓\n' +
    'Project (루트 → CWD 순회)\n' +
    '   ↓\n' +
    'Local (CLAUDE.local.md)  (highest)\n\n' +
    '나중에 로드 = 높은 우선순위.\n' +
    'CWD에 가까운 파일일수록 영향력이 큼.'
  );

  addCodeSlide(p, '@include 지시어',
    '다른 파일을 포함 파일 이전에 컨텍스트 삽입.',
    '# CLAUDE.md\n\n' +
    '@./docs/architecture.md\n' +
    '@~/shared/style-guide.md\n' +
    '@/etc/company-standards.md\n\n' +
    '# 활용:\n' +
    '# - 사내 공통 규칙 → @~/company/common.md\n' +
    '# - 모노레포 패키지별 → @./packages/*/CONVENTIONS.md\n' +
    '# - 보안 정책 → @/etc/claude-code/security.md'
  );

  addBulletSlide(p, '@include 동작 규칙', [
    '비존재 파일 → 조용히 무시',
    '순환 참조 → 감지·방지',
    '최대 5단계 깊이',
    '텍스트 파일만 지원 (이진 파일 건너뜀)',
    '코드 블록 안의 @include는 무시됨'
  ]);

  addCodeSlide(p, '프론트매터 경로 타겟팅',
    '.claude/rules/의 파일은 특정 경로에만 적용 가능.',
    '---\n' +
    'paths:\n' +
    '  - "src/api/**"\n' +
    '  - "*.graphql"\n' +
    '---\n\n' +
    '# API 컨벤션\n\n' +
    '모든 API 핸들러는 공유 validate() 헬퍼로 입력을 검증해야 합니다.\n' +
    'GraphQL 리졸버는 직접 데이터베이스 쿼리를 수행하면 안 됩니다.\n\n' +
    '# paths 없음 → 무조건 적용\n' +
    '# paths 있음 → glob 매칭 시에만 적용'
  );

  addCodeSlide(p, '실전 예시: TypeScript 프로젝트 (1/2)',
    '빌드/테스트 커맨드와 아키텍처 명시.',
    '# Project: Payments API\n\n' +
    '## 빌드 및 테스트\n\n' +
    '- 빌드: `bun run build`\n' +
    '- 테스트: `bun test` (Bun 내장 — Jest 사용 금지)\n' +
    '- Lint: `bun run lint` (biome)\n' +
    '- 타입 체크: `bun run typecheck`\n\n' +
    '변경 사항 완료 전에 항상 `bun run typecheck` 실행.\n\n' +
    '## 아키텍처\n\n' +
    '- src/handlers/ — HTTP 핸들러\n' +
    '- src/services/ — 비즈니스 로직, 직접 DB 접근 금지\n' +
    '- src/db/ — DB 레이어 (Drizzle ORM)\n' +
    '- src/schemas/ — Zod 스키마\n\n' +
    '레이어 건너뛰기 금지.'
  );

  addCodeSlide(p, '실전 예시: TypeScript 프로젝트 (2/2)',
    '컨벤션, 환경, 함정.',
    '## 컨벤션\n\n' +
    '- 모든 검증 스키마에 z.object().strict() 사용\n' +
    '- 에러는 Result<T, AppError>로 전파 — throw 금지\n' +
    '- 금액은 센트 단위 정수\n' +
    '- 타임스탬프는 Unix 초 (number), Date 객체 아님\n\n' +
    '## 환경\n\n' +
    '필요한 env: DATABASE_URL, STRIPE_SECRET_KEY, JWT_SECRET\n\n' +
    '## 피해야 할 실수\n\n' +
    '- new Date() 직접 사용 금지 — utils/time.ts::getCurrentTimestamp()\n' +
    '- console.log 금지 — utils/logger.ts::logger\n' +
    '- Raw SQL 금지 — Drizzle 쿼리 빌더'
  );

  addTextSlide(p, '/init으로 자동 생성',
    '세션에서: /init\n\n' +
    '[자동 수행]\n' +
    '• 매니페스트, CI 설정, 빌드 스크립트, README 조사\n' +
    '• 빈 부분은 인터뷰로 채움\n' +
    '• 출력 파일 작성 (+ 선택적 스킬/훅)\n\n' +
    '[결과물]\n' +
    '• 프로젝트 CLAUDE.md\n' +
    '• (선택) CLAUDE.local.md\n' +
    '• (선택) 스킬, 훅\n\n' +
    '필수: 생성 결과를 검토·편집 후 커밋. 그대로 두지 말 것.'
  );

  addTextSlide(p, '/memory로 편집',
    '/memory\n\n' +
    '[동작]\n' +
    '• 대화형 에디터 오픈\n' +
    '• 모든 로드된 메모리 파일 나열\n' +
    '• 세션 내에서 직접 편집\n' +
    '• 저장 시 즉시 리로드 → 현재 세션 반영\n\n' +
    '[더 쉬운 방법]\n' +
    '자연어로 요청: "CLAUDE.md에 커밋 전 항상 bun typecheck를 실행한다는 규칙을 추가해줘"'
  );

  addCodeSlide(p, '파일 제외: claudeMdExcludes',
    '벤더 디렉토리나 생성된 코드의 CLAUDE.md를 건너뛰기.',
    '{\n' +
    '  "claudeMdExcludes": [\n' +
    '    "/absolute/path/to/vendor/CLAUDE.md",\n' +
    '    "**/generated/**",\n' +
    '    "**/third-party/.claude/rules/**"\n' +
    '  ]\n' +
    '}\n\n' +
    '// picomatch 절대 경로 매칭\n' +
    '// User / Project / Local 만 제외 가능\n' +
    '// Managed는 항상 로드 (정책 보호)'
  );

  addTableSlide(p, '안티패턴', [
    ['패턴', '문제'],
    ['긴 일반론', '노이즈 → 중요한 지시 놓침'],
    ['시크릿 포함', '보안 사고 · 저장소 유출 위험'],
    ['버전·티켓 하드코딩', '금방 오래됨'],
    ['Claude가 이미 아는 내용', '토큰 낭비'],
    ['40,000자 초과', '전체를 못 읽을 수 있음'],
    ['/init 생성물 그대로 커밋', '잘못된 가정 포함 가능']
  ]);

  addClosingSlide(p, 'Q&A / 실습', [
    '우리 팀 저장소에서 /init 실행 후 결과 리뷰',
    '시크릿 관련 규칙을 어느 레벨에 둘까?',
    '공통 규칙 공유를 @include로 할지 복제로 할지 결정'
  ]);

  return logUrl(p);
}
