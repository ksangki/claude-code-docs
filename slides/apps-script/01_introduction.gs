/**
 * Ch.01 Claude Code 소개 — Google Slides 빌더
 */

function buildChapter01() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.01 소개');

  addTitleSlide(p,
    'Ch.01 Claude Code 소개',
    '터미널에서 실행되는 AI 코딩 에이전트',
    '실무자 과정 · 사내 교육 자료'
  );

  addBulletSlide(p, '학습 목표', [
    'Claude Code가 무엇이며, 기존 코드 어시스턴트와 어떻게 다른지',
    '6가지 핵심 역량 (파일 편집 · 셸 실행 · 검색 · 웹 · 서브에이전트 · MCP)',
    '권한 모드 4종 (default / acceptEdits / plan / bypassPermissions)',
    'CLAUDE.md 메모리 시스템의 3계층 범위',
    '인증 방식 2종 (OAuth vs API Key)'
  ]);

  addTableSlide(p, 'Claude Code란 무엇인가', [
    ['특징', '의미'],
    ['파일시스템 직접 접근', 'Read / Edit / Write를 IDE 바깥에서 수행'],
    ['셸 직접 접근', '테스트, 빌드, git 작업을 실제로 실행'],
    ['자연어 작업 기술', '"이 버그 고쳐줘" → 끝까지 구현'],
    ['Copy/Paste 불필요', '컨텍스트 전환 없이 완결']
  ]);

  addTextSlide(p, '6가지 핵심 역량 (1/2)',
    '1. 파일 읽기 및 편집\n' +
    '   - 소스 파일 읽기 → 정밀 편집\n' +
    '   - 변경 전 diff 표시 → 사용자가 통제권 유지\n\n' +
    '2. 셸 커맨드 실행\n' +
    '   - 테스트, 빌드, git 등 모든 셸 작업 가능\n' +
    '   - 설정 가능한 권한 제어로 안전성 보장\n\n' +
    '3. 코드베이스 검색\n' +
    '   - Glob(파일명 패턴) + Grep(정규식 내용 검색)\n' +
    '   - 대규모 모노레포도 수동 탐색 없이 질의'
  );

  addTextSlide(p, '6가지 핵심 역량 (2/2)',
    '4. 웹에서 정보 가져오기\n' +
    '   - WebFetch / WebSearch — 문서, API 스펙, 검색 결과\n' +
    '   - 터미널을 벗어나지 않음\n\n' +
    '5. 서브에이전트 생성\n' +
    '   - 복잡한 작업을 병렬 워크스트림으로 분할\n' +
    '   - 여러 에이전트 스폰 → 동시 처리 → 결과 취합\n\n' +
    '6. MCP 서버 연결\n' +
    '   - DB, 사내 API, 도구를 Model Context Protocol로 연결\n' +
    '   - 역량을 조직 인프라에 맞춰 확장'
  );

  addTableSlide(p, '권한 시스템: 모든 도구 호출은 검사를 거친다', [
    ['모드', '동작'],
    ['default', '셸/편집 전에 확인 요청 — 일상 권장'],
    ['acceptEdits', '편집 자동 승인 · 셸은 여전히 확인'],
    ['plan', '계획 먼저, 승인 후 실행 — 큰 변경 전'],
    ['bypassPermissions', '모든 작업 즉시 실행 — 샌드박스 전용']
  ]);

  addCodeSlide(p, 'bypassPermissions 경고',
    '대화형에서 절대 사용 금지. 격리된 환경에서만 허용:',
    '# Docker 컨테이너, CI 샌드박스에서만\n' +
    'claude --permission-mode bypassPermissions\n\n' +
    '# 또는 동일한 효과\n' +
    'claude --dangerously-skip-permissions'
  );

  addTableSlide(p, 'CLAUDE.md 메모리 시스템', [
    ['범위', '파일', '공유 여부'],
    ['프로젝트', '저장소 루트 CLAUDE.md', '팀 공유 · 커밋'],
    ['개인', 'CLAUDE.local.md', '개인 · gitignore'],
    ['서브디렉토리', '<sub>/CLAUDE.md', '해당 디렉토리 작업 시 자동 로드']
  ]);

  addTextSlide(p, 'CLAUDE.md 작성 철학',
    '테스트: "이 줄을 제거하면 Claude가 실수를 할까?"\n\n' +
    '[포함할 것]\n' +
    '• 정확한 빌드/테스트/lint 커맨드\n' +
    '• 프로젝트 고유 컨벤션\n' +
    '• 숨은 함정 (모노레포 경계, DB 제약)\n\n' +
    '[빼야 할 것]\n' +
    '• Claude가 이미 아는 것 (표준 TS 구문)\n' +
    '• 자명한 알림 ("깔끔한 코드를 작성하세요")\n' +
    '• 민감 정보 (API 키, 비밀번호)\n\n' +
    '생성 방법: /init 실행.'
  );

  addTwoColumnSlide(p, '인증: 두 가지 방식',
    'OAuth (권장)',
    [
      'claude 첫 실행 시 브라우저 프롬프트',
      'claude.ai 계정으로 로그인',
      '토큰 갱신 자동 처리',
      '대화형 사용에 적합'
    ],
    'API 키',
    [
      'ANTHROPIC_API_KEY 환경 변수',
      'CI / 비대화형 환경',
      '자동화 파이프라인',
      'API 키가 설정되면 OAuth 대신 우선 적용'
    ]
  );

  addBulletSlide(p, '실무자 체크리스트', [
    'Node.js 18+ 설치 확인 (node --version)',
    'npm install -g @anthropic-ai/claude-code',
    '첫 프로젝트에서 claude 실행 → OAuth',
    '/init 으로 CLAUDE.md 초안 생성 후 검토',
    'default 모드로 시작 → 익숙해지면 acceptEdits',
    '민감정보는 CLAUDE.md에 절대 기재 금지'
  ]);

  addClosingSlide(p, 'Q&A 토론 주제', [
    '우리 팀이 현재 Copilot/Cursor로 해결하지 못하는 작업은?',
    '어떤 저장소부터 CLAUDE.md를 작성할까?',
    'bypassPermissions 없이 자동화를 설계하려면?'
  ]);

  return logUrl(p);
}
