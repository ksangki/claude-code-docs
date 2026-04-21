/**
 * Ch.05 메모리와 컨텍스트 — Google Slides 빌더
 */

function buildChapter05() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.05 메모리와 컨텍스트');

  addTitleSlide(p, 'Ch.05 메모리와 컨텍스트',
    'CLAUDE.md 계층, @include, 경로 기반 규칙',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '4단계 메모리 계층 (Managed / User / Project / Local)',
    '우선순위 규칙: 나중에 로드 = 더 높은 우선순위',
    '파일 발견 알고리즘 (CWD → 루트 상향 탐색)',
    '@include 지시어와 경로 구문',
    '.claude/rules/*.md 세분화와 paths 프론트매터',
    '비활성화 방법 3가지'
  ]);

  addTextSlide(p, '메모리의 본질',
    'CLAUDE.md는 마크다운 파일.\n\n' +
    '[역할]\n' +
    '• Claude의 동작을 전역/프로젝트/사용자별 커스터마이징\n' +
    '• 한 번 작성 → 매 세션 자동 로드\n' +
    '• 빌드 커맨드, 컨벤션, 아키텍처 등을 코드로 인코딩\n\n' +
    '매번 Claude에게 같은 설명을 반복할 필요 없음.'
  );

  addTableSlide(p, '4단계 메모리 계층', [
    ['레벨', '경로', '특성'],
    ['1. Managed (최저)', '/etc/claude-code/CLAUDE.md', '관리자 시스템 전체'],
    ['2. User', '~/.claude/CLAUDE.md', '개인 전역, 미커밋'],
    ['3. Project', 'CLAUDE.md (루트)', '팀 공유, 커밋'],
    ['4. Local (최고)', 'CLAUDE.local.md', '개인, gitignore']
  ]);

  addTextSlide(p, '파일 발견 알고리즘',
    'Claude Code 시작 시:\n' +
    '현재 작업 디렉토리(CWD)에서 파일시스템 루트(/)까지\n' +
    '올라가며 각 레벨의 메모리 파일 수집.\n\n' +
    '[로딩 순서 — 나중에 로드된 것이 우선]\n' +
    '1. Managed 파일\n' +
    '2. User 파일\n' +
    '3. 루트 → CWD 순으로 Project / Local 파일\n' +
    '   - 상위 디렉토리 먼저, 하위 디렉토리 나중\n' +
    '   - → 하위 디렉토리 규칙이 우선\n\n' +
    '메모이제이션: 대화 기간 동안 목록 캐시.\n' +
    '변경 반영은 /memory 또는 세션 재시작.'
  );

  addCodeSlide(p, '@include 지시어',
    '메모리 파일끼리 참조 가능.',
    '# CLAUDE.md\n\n' +
    '@./docs/architecture.md\n' +
    '@./docs/conventions/typescript.md\n\n' +
    '커밋 전에 항상 `bun test`를 실행하세요.'
  );

  addTableSlide(p, '@include 경로 구문', [
    ['구문', '해석'],
    ['@filename', '포함 파일 기준 상대'],
    ['@./relative/path', '명시적 상대'],
    ['@~/home/path', '사용자 홈 기준'],
    ['@/absolute/path', '절대 경로']
  ]);

  addBulletSlide(p, '@include 규칙', [
    '코드 블록 및 인라인 코드 안의 @include는 무시',
    '순환 참조는 감지되어 건너뜀',
    '존재하지 않는 파일은 조용히 무시',
    '최대 include 깊이 5단계',
    '텍스트 기반 파일만 포함 (.md, .ts, .py, .json)',
    '이미지/PDF/바이너리는 건너뜀'
  ]);

  addCodeSlide(p, '.claude/rules/*.md — 세분화',
    '모든 것을 하나의 CLAUDE.md에 몰지 말고 파일별로 분리.',
    'my-project/\n' +
    '├── CLAUDE.md\n' +
    '└── .claude/\n' +
    '    └── rules/\n' +
    '        ├── testing.md\n' +
    '        ├── typescript-style.md\n' +
    '        └── git-workflow.md\n\n' +
    '# .claude/rules/ 안의 모든 .md 파일이 자동 로드됨.\n' +
    '# 장점: 주제별 관리, PR 리뷰 쉬움, 선택적 로딩 가능.'
  );

  addCodeSlide(p, '경로 범위 프론트매터',
    '규칙을 특정 파일 작업 시에만 적용.',
    '---\n' +
    'paths:\n' +
    '  - "src/api/**"\n' +
    '  - "src/services/**"\n' +
    '---\n\n' +
    '항상 의존성 주입을 사용하세요.\n' +
    '구체적인 구현을 직접 import하지 마세요.\n\n' +
    '# paths 설정 시 glob 일치 파일 작업 시에만 컨텍스트 주입\n' +
    '# 대규모 프로젝트에서 컨텍스트를 간결하게 유지'
  );

  addTextSlide(p, '최대 파일 크기',
    '권장 최대: 40,000자.\n\n' +
    '[한계 초과 시]\n' +
    '• 파일이 플래그 처리됨\n' +
    '• Claude가 전체 내용을 읽지 못할 수 있음\n\n' +
    '[원칙]\n' +
    '메모리 파일은 집중적이고 간결하게.\n' +
    '• 중복 제거\n' +
    '• 구체적 명령 선호\n' +
    '• 일반적 지침은 빼기'
  );

  addTextSlide(p, '메모리가 동작에 미치는 영향',
    '메모리 파일이 로드되면 프리픽스와 함께 컨텍스트에 주입:\n\n' +
    '"Codebase and user instructions are shown below.\n' +
    'IMPORTANT: These instructions OVERRIDE any default behavior\n' +
    'and you MUST follow them exactly as written."\n\n' +
    '[의미]\n' +
    '• CLAUDE.md 지시는 Claude의 내장 기본값보다 우선\n' +
    '• 프로젝트 컨벤션 강제 가능\n' +
    '• 도메인 지식 주입 가능\n' +
    '• 특정 작업 제한 가능'
  );

  addTableSlide(p, '레벨별 사용 지침', [
    ['레벨', '용도'],
    ['Managed', '조직 전체 정책, 보안 가이드라인'],
    ['User', '응답 언어, 커밋 메시지 스타일'],
    ['Project', '테스트 실행법, 빌드 커맨드, 아키텍처'],
    ['Local', '로컬 환경 경로, 개인 디버깅 노트']
  ]);

  addTextSlide(p, '/memory 커맨드와 자연어 편집',
    'REPL 안에서: /memory\n\n' +
    '[동작]\n' +
    '• 메모리 파일 에디터 오픈\n' +
    '• 현재 로드된 메모리 파일 나열\n' +
    '• 직접 편집\n' +
    '• 저장 시 컨텍스트 리로드\n\n' +
    '[더 쉬운 방법]\n' +
    'Claude에게 직접 요청\n' +
    '"CLAUDE.md에 항상 2칸 들여쓰기를 사용한다는 규칙을 추가해줘"\n\n' +
    'Claude가 적절한 파일을 찾아 지시사항을 작성.'
  );

  addTableSlide(p, '메모리 로딩 비활성화', [
    ['방법', '효과'],
    ['CLAUDE_CODE_DISABLE_CLAUDE_MDS=1', '완전 비활성화'],
    ['--bare 플래그', 'CWD 자동 발견 건너뜀'],
    ['claudeMdExcludes 설정', '건너뛸 Glob 패턴 지정']
  ]);

  addCodeSlide(p, '사내 모노레포 레이아웃 제안',
    '계층적 메모리 구성 예시.',
    'monorepo/\n' +
    '├── CLAUDE.md                  # 공통 컨벤션 + @include\n' +
    '├── .claude/\n' +
    '│   └── rules/\n' +
    '│       ├── security.md        # 항상 적용\n' +
    '│       └── api-style.md       # paths: ["packages/api/**"]\n' +
    '├── packages/\n' +
    '│   ├── api/\n' +
    '│   │   └── CLAUDE.md          # API 특화\n' +
    '│   └── web/\n' +
    '│       └── CLAUDE.md          # 웹 특화\n' +
    '└── CLAUDE.local.md            # gitignore'
  );

  addClosingSlide(p, 'Q&A / 실습', [
    '현재 팀 저장소에 CLAUDE.md가 있는가? 크기와 품질은?',
    '공통 규칙을 어디에 둘까? (Managed vs @include vs 복제)',
    '.claude/rules/ + paths로 모노레포 규칙을 분리한다면 어떻게 설계할까?'
  ]);

  return logUrl(p);
}
