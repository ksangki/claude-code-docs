/**
 * Ch.02 빠른 시작 — Google Slides 빌더
 */

function buildChapter02() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.02 빠른 시작');

  addTitleSlide(p, 'Ch.02 빠른 시작',
    '5분 안에 첫 번째 코딩 작업 완료',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '사전 요구사항과 버전 확인 방법',
    '5단계 온보딩 절차 (설치 → 인증 → 세션 → /init)',
    '비대화형 모드(-p)로 스크립트에 Claude 사용',
    '핵심 슬래시 커맨드 7종 숙지'
  ]);

  addCodeSlide(p, '사전 요구사항',
    '필수: Node.js 18 이상, npm (Node.js에 포함)',
    'node --version    # v18.x.x 이상이어야 함\n' +
    'npm --version\n\n' +
    '# Node.js가 18 미만이면 Claude Code는\n' +
    '# 시작 시 오류와 함께 종료됩니다.\n' +
    '# 설치/업그레이드 → https://nodejs.org'
  );

  addCodeSlide(p, '1단계: Claude Code 설치',
    'npm 전역 설치',
    'npm install -g @anthropic-ai/claude-code\n\n' +
    '# 설치 확인\n' +
    'claude --version'
  );

  addCodeSlide(p, '2단계: 인증',
    '최초 실행 시 브라우저가 열리고 OAuth 로그인을 유도합니다.',
    '# 기본 OAuth 흐름\n' +
    'claude\n\n' +
    '# 대안 (API 키 직접 설정)\n' +
    'export ANTHROPIC_API_KEY=sk-ant-...\n\n' +
    '# ANTHROPIC_API_KEY가 설정되어 있으면\n' +
    '# API 키가 우선합니다.'
  );

  addCodeSlide(p, '3-4단계: 프로젝트 이동 → 세션 시작',
    '자연어로 작업 입력. Claude는 변경 전에 계획을 표시.',
    'cd my-project\n' +
    'claude\n\n' +
    '# 예시 프롬프트\n' +
    '> 이 코드베이스의 구조를 설명해줘\n' +
    '> 회원가입 폼에 입력 검증 추가해줘\n' +
    '> UserService 클래스에 대한 테스트 작성해줘'
  );

  addTextSlide(p, '5단계: /init으로 CLAUDE.md 생성',
    '세션 안에서: /init\n\n' +
    '[자동 수행]\n' +
    '• 매니페스트 파일, 기존 문서, 코드 구조 분석\n' +
    '• 빌드 커맨드, 아키텍처 힌트 추출\n' +
    '• CLAUDE.md 초안 생성\n\n' +
    '[중요]\n' +
    '생성된 파일을 반드시 검토 후 커밋.\n' +
    'CLAUDE.md는 매 세션 시작마다 로드됨 → 비표준 빌드,\n' +
    '테스트 특이사항, 팀 컨벤션 기록 최적 위치.'
  );

  addCodeSlide(p, '비대화형 모드: -p 플래그',
    '단일 작업 → 결과 출력 → 종료. REPL에 진입하지 않음.',
    'claude -p "이 코드베이스를 설명해줘"\n' +
    'claude -p "src/ 안의 모든 TODO 주석과 파일을 나열해줘"\n' +
    'claude -p "src/ 안의 미사용 export를 확인해줘"\n\n' +
    '# 주의: --print 모드는 작업 공간 신뢰 다이얼로그를 건너뜁니다.\n' +
    '# 신뢰하는 디렉토리에서만 사용하세요.'
  );

  addTableSlide(p, '핵심 슬래시 커맨드 7종', [
    ['커맨드', '설명'],
    ['/help', '사용 가능한 커맨드 · 키보드 단축키 표시'],
    ['/init', 'CLAUDE.md 생성 또는 업데이트'],
    ['/memory', '메모리 파일 보기 및 편집'],
    ['/permissions', '권한 모드 보기/변경'],
    ['/mcp', 'MCP 서버 관리'],
    ['/clear', '대화 컨텍스트 지우기'],
    ['/exit', '세션 종료']
  ]);

  addBulletSlide(p, '실습: 5분 온보딩 실행', [
    'node --version → 18 이상 확인',
    'npm install -g @anthropic-ai/claude-code',
    '테스트 프로젝트로 cd',
    'claude → OAuth 또는 API 키',
    '> 이 저장소를 요약해줘 입력',
    '/init → CLAUDE.md 초안 확인',
    '/exit → git diff CLAUDE.md 로 검토'
  ]);

  addTableSlide(p, '자주 하는 실수', [
    ['실수', '대안'],
    ['Windows CMD/PowerShell에서 직접 실행', 'WSL 안에서만 실행'],
    ['sudo npm install -g', 'npm prefix를 홈 디렉토리로 설정'],
    ['생성된 CLAUDE.md를 검토 없이 커밋', '반드시 git diff 후 편집'],
    ['저장소 전체에 bypassPermissions', 'default 모드 유지 + 세분화 allow'],
    ['CLAUDE.md에 API 키 기록', 'CLAUDE.local.md (gitignore) + env 변수']
  ]);

  addClosingSlide(p, 'Q&A', [
    'OAuth vs API 키 중 어떤 것을 사내 표준으로 할 것인가?',
    '/init 결과를 리뷰하는 팀 체크리스트가 필요한가?',
    '-p 비대화형을 사내 CI에 연결할 후보 워크플로우는?'
  ]);

  return logUrl(p);
}
