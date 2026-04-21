/**
 * Ch.18 슬래시 커맨드 — Google Slides 빌더
 */

function buildChapter18() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.18 슬래시 커맨드');

  addTitleSlide(p, 'Ch.18 슬래시 커맨드',
    '세션 내 전체 커맨드 레퍼런스',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '내장 슬래시 커맨드 17종',
    '프로젝트·메모리 커맨드 (/init, /memory)',
    '설정 커맨드 (/config, /hooks, /mcp, /permissions, /model)',
    '세션 관리 (/plan, /compact, /clear, /skills)',
    'Git (/commit, /review)',
    '계정/도움말 (/help, /login, /logout)',
    '커스텀 스킬 커맨드'
  ]);

  addTableSlide(p, '빠른 참조 (1/2)', [
    ['커맨드', '설명'],
    ['/init', 'CLAUDE.md + 선택적 스킬/훅 생성'],
    ['/memory', '메모리 파일 편집'],
    ['/config', '설정 패널'],
    ['/hooks', '훅 설정 보기'],
    ['/mcp', 'MCP 서버 관리'],
    ['/permissions', '권한 규칙 관리'],
    ['/plan', 'plan 모드 / 계획 관리'],
    ['/model', 'AI 모델 설정']
  ]);

  addTableSlide(p, '빠른 참조 (2/2)', [
    ['커맨드', '설명'],
    ['/commit', 'AI 생성 메시지 커밋'],
    ['/review', 'PR 리뷰'],
    ['/skills', '사용 가능 스킬 목록'],
    ['/compact', '대화 기록 요약'],
    ['/clear', '대화 기록 지우기'],
    ['/help', '도움말'],
    ['/login', '로그인/전환'],
    ['/logout', '로그아웃']
  ]);

  addTextSlide(p, '/init',
    '코드베이스 분석 → CLAUDE.md + 선택적 스킬/훅 설정.\n\n' +
    '[분석 대상]\n' +
    '• 매니페스트 파일 (package.json, Cargo.toml 등)\n' +
    '• CI 설정\n' +
    '• 빌드 스크립트\n' +
    '• README\n\n' +
    '인터뷰를 통해 빠진 내용 채움.\n\n' +
    '[출력 선택지]\n' +
    '• 프로젝트 CLAUDE.md\n' +
    '• 개인 CLAUDE.local.md (gitignore)\n' +
    '• 스킬 (.claude/skills/)\n' +
    '• 훅 (설정 JSON)\n\n' +
    '다시 실행 → 덮어쓰기 대신 구체적 변경 제안.'
  );

  addTableSlide(p, '/memory 범위', [
    ['범위', '파일', '적용'],
    ['전역', '~/.claude/CLAUDE.md', '모든 프로젝트의 나'],
    ['프로젝트', '루트 CLAUDE.md', '팀 전체'],
    ['로컬', '루트 CLAUDE.local.md', '이 프로젝트의 나']
  ]);

  addTextSlide(p, '/config · /hooks',
    '/config (별칭 /settings)\n' +
    '• 각 범위 활성 설정 확인\n' +
    '• JSON 파일 직접 편집 가능\n' +
    '• 파일 변경 감지 → 자동 리로드\n\n' +
    '/hooks\n' +
    '• 활성화된 훅 설정 표시\n' +
    '• 편집은 /init 또는 .claude/settings.json 직접\n' +
    '  (슬래시 커맨드만으로는 훅 편집 불가)'
  );

  addTableSlide(p, '/mcp 서브커맨드', [
    ['인수', '효과'],
    ['(없음)', 'MCP 관리 패널'],
    ['enable', '모든 비활성 서버 활성화'],
    ['enable <server>', '특정 서버 활성화'],
    ['disable', '모든 활성 서버 비활성화'],
    ['disable <server>', '특정 서버 비활성화'],
    ['reconnect <server>', '재연결']
  ]);

  addTextSlide(p, '/permissions · /model',
    '/permissions (별칭 /allowed-tools)\n' +
    '• 권한 패널 열기 → 허용/차단 규칙 관리\n' +
    '• 모드 변경도 /permissions 내에서\n\n' +
    '/model [모델]\n' +
    '• 세션 AI 모델 설정\n' +
    '  /model\n' +
    '  /model sonnet\n' +
    '  /model claude-opus-4-5\n\n' +
    '[활용]\n' +
    '• 시작은 Haiku로 빠르게\n' +
    '• 복잡 작업에서 Opus로 전환\n' +
    '• 비용 최적화 흐름'
  );

  addTextSlide(p, '/plan [open | <설명>]',
    '(없음) → plan 모드 토글\n' +
    'open → 현재 계획 열기\n' +
    '<설명> → 주어진 설명으로 새 계획\n\n' +
    '[plan 모드 동작]\n' +
    '어떤 작업도 실행 전에 작성된 계획 제시 → 승인 대기.\n\n' +
    '[활용]\n' +
    '큰 변경·리팩터링 전 설계 검토.'
  );

  addCodeSlide(p, '/compact [지시사항]',
    '대화 기록 요약 → 컨텍스트 윈도우 관리.',
    '/compact\n' +
    '/compact 데이터베이스 스키마 변경에만 집중해줘\n' +
    '/compact 완료된 최근 세 작업만 요약해줘\n\n' +
    '# /compact → 요약\n' +
    '# /clear → 완전 삭제\n\n' +
    '# 습관화: 작업 단위 끝에 /compact'
  );

  addTextSlide(p, '/clear · /skills',
    '/clear (별칭 /reset, /new)\n' +
    '• 전체 대화 기록 지우기 + 컨텍스트 해제\n' +
    '• 같은 작업 디렉토리에서 새 세션\n' +
    '• 트랜스크립트 파일 자체는 보존 (재개 가능)\n\n' +
    '/skills\n' +
    '• 사용 가능한 스킬 나열\n' +
    '• 내장 + 사용자 + 프로젝트 + Managed 범위 전부\n' +
    '• user-invocable: false 스킬은 숨김\n' +
    '• 신규 입사자 온보딩, 팀 워크플로우 발견'
  );

  addTextSlide(p, '/commit 안전 규칙',
    '/commit = AI 생성 메시지 git 커밋\n\n' +
    '[동작]\n' +
    '• git 상태와 diff 읽기\n' +
    '• 스테이징된 변경 분석\n' +
    '• "무엇"보다 "왜"에 초점인 메시지 작성\n\n' +
    '[안전 규칙]\n' +
    '• 기존 커밋 amend 안 함\n' +
    '• 훅 건너뛰기 안 함 (--no-verify 안 씀)\n' +
    '• 시크릿 포함 가능 파일 커밋 안 함\n' +
    '• 변경 없으면 빈 커밋 안 만듦\n\n' +
    '→ git add, git status, git commit 접근만.\n' +
    '   push/rebase 등 불가.'
  );

  addTextSlide(p, '/review [PR-번호]',
    'GitHub CLI(gh)로 PR에 AI 코드 리뷰 실행.\n\n' +
    'PR 번호 없이 → 열린 PR 목록.\n\n' +
    '[리뷰 내용]\n' +
    '• PR 개요\n' +
    '• 코드 품질·스타일 분석\n' +
    '• 구체적 개선 제안\n' +
    '• 잠재적 문제/리스크\n' +
    '• 성능·테스트 커버리지·보안 고려\n\n' +
    'GitHub CLI(gh) 설치 + 인증 필요.'
  );

  addTextSlide(p, '/help · /login · /logout',
    '/help\n' +
    '현재 세션의 모든 커맨드\n' +
    '— 내장 + 스킬 + 플러그인.\n\n' +
    '/login\n' +
    'Anthropic 계정 로그인 / 계정 전환. 새 OAuth 흐름.\n\n' +
    '/logout\n' +
    '계정 로그아웃. 다음 세션에서 재인증 요청.'
  );

  addCodeSlide(p, '커스텀 스킬 커맨드',
    '.claude/skills/<name>/SKILL.md 생성 시 자동으로 /<name>으로 사용 가능.',
    '/verify\n' +
    '/deploy staging\n' +
    '/fix-issue 123\n\n' +
    '# 확인 방법\n' +
    '/skills    # 로드된 스킬 목록'
  );

  addCodeSlide(p, '자주 쓰는 조합 패턴',
    '작업 단위별 흐름.',
    '# 작업 시작\n' +
    '/init         # 저장소에 CLAUDE.md 없으면\n' +
    '/model sonnet\n' +
    '/plan         # 큰 작업이면\n\n' +
    '# 작업 중간 정리\n' +
    '/compact 지금까지 정리\n\n' +
    '# 마무리\n' +
    '/commit\n' +
    '/exit'
  );

  addTableSlide(p, '일반적 실수', [
    ['실수', '대안'],
    ['/clear로 실수로 세션 전체 초기화', '먼저 /compact 시도'],
    ['/mcp enable을 영구로 착각', '세션만 → 설정 파일 편집'],
    ['/commit이 push까지 할 거라 기대', 'push는 별도'],
    ['/review인데 gh 미설치', 'gh 설치 + gh auth login'],
    ['/model 변경 후 비용 급증', '확인 + --max-budget-usd']
  ]);

  addClosingSlide(p, 'Q&A', [
    '우리 팀에 가장 유용할 커맨드 3개는?',
    '/commit을 사내 커밋 규약과 어떻게 조화시킬까?',
    '/review를 CI/PR 자동화에 연결할 방법은?'
  ]);

  return logUrl(p);
}
