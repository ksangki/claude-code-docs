/**
 * Ch.16 커맨드 개요 — Google Slides 빌더
 */

function buildChapter16() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.16 커맨드 개요');

  addTitleSlide(p, 'Ch.16 커맨드 개요',
    'CLI 플래그 vs 슬래시 커맨드 · 키보드 단축키',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    'CLI 플래그와 슬래시 커맨드의 차이',
    '--help vs /help 사용',
    'CLI 플래그 기본 사용법',
    '슬래시 커맨드 기본 사용법',
    '키보드 단축키 6종',
    'claude 서브커맨드 4종'
  ]);

  addTableSlide(p, '두 가지 커맨드 타입', [
    ['타입', '사용 시점', '예시'],
    ['CLI 플래그', '세션 시작 시', 'claude --permission-mode acceptEdits'],
    ['슬래시 커맨드', '세션 중 상호작용', '/commit']
  ]);

  addTextSlide(p, '중요 구분',
    'CLI 플래그는 한 번 소비되고 세션 중간에 변경 불가.\n\n' +
    '예외: /model, /permissions — 실행 중 설정 변경 가능.'
  );

  addCodeSlide(p, '도움말 확인',
    '--help와 /help의 차이.',
    '# 모든 CLI 플래그\n' +
    'claude --help\n\n' +
    '# 세션 내 슬래시 커맨드 목록\n' +
    '/help\n\n' +
    '# /help의 출력 포함:\n' +
    '# - 내장 커맨드\n' +
    '# - 플러그인이 추가한 커맨드\n' +
    '# - 스킬이 노출한 커맨드\n' +
    '# → 세션마다 다를 수 있음'
  );

  addCodeSlide(p, 'CLI 플래그 사용법',
    '기본 구조: claude [플래그] [프롬프트]',
    '# 비대화형\n' +
    'claude -p "README.md를 요약해줘" < README.md\n\n' +
    '# 모델 지정\n' +
    'claude --model opus\n\n' +
    '# 편집 자동 승인\n' +
    'claude --permission-mode acceptEdits\n\n' +
    '# 상세 레퍼런스는 Ch.17'
  );

  addCodeSlide(p, '슬래시 커맨드 사용법',
    '/command [인수]',
    '/init\n' +
    '/compact 최근 세 작업만 요약해줘\n' +
    '/model claude-opus-4-5\n\n' +
    '# 상세 레퍼런스는 Ch.18'
  );

  addTableSlide(p, '키보드 단축키 (1/2)', [
    ['키', '동작'],
    ['Ctrl+C', '현재 응답 중단 (대화 유지)'],
    ['Ctrl+D', 'Claude Code 종료'],
    ['Ctrl+L', '터미널 화면 지우기 (대화 기록은 유지)']
  ]);

  addTableSlide(p, '키보드 단축키 (2/2)', [
    ['키', '동작'],
    ['↑ / ↓', '입력 기록 탐색'],
    ['Tab', '슬래시 커맨드 이름 자동완성'],
    ['Escape', '진행 중인 권한 프롬프트 취소']
  ]);

  addTextSlide(p, '중요 구분: Ctrl+C vs Ctrl+D',
    'Ctrl+C → 현재 응답만 중단, 대화는 살아있음\n' +
    'Ctrl+D 또는 /exit → 세션 완전 종료\n\n' +
    '[실무 팁]\n' +
    '• Tab으로 /sk<Tab> → /skills\n' +
    '• ↑으로 이전 프롬프트 재사용\n' +
    '• Escape으로 잘못 요청한 권한 다이얼로그 빠르게 취소'
  );

  addTableSlide(p, 'claude 서브커맨드', [
    ['서브커맨드', '설명'],
    ['claude mcp', 'MCP 서버 설정·관리'],
    ['claude mcp serve', 'Claude Code를 MCP 서버로 시작'],
    ['claude doctor', '설치/설정 문제 진단'],
    ['claude update', '최신 버전으로 업데이트']
  ]);

  addCodeSlide(p, '실전 서브커맨드 사용',
    '환경 문제 시 doctor가 첫 단계.',
    'claude mcp --help\n' +
    'claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /tmp\n\n' +
    'claude doctor    # 설치/설정 진단\n\n' +
    'claude update    # 업데이트'
  );

  addTableSlide(p, 'CLI vs 슬래시 선택 가이드', [
    ['작업', '추천'],
    ['세션 시작 시 설정', 'CLI 플래그'],
    ['스크립트/CI 실행', 'CLI 플래그 + -p'],
    ['진행 중 모델 변경', '/model'],
    ['진행 중 권한 변경', '/permissions'],
    ['메모리 편집', '/memory'],
    ['컨텍스트 요약', '/compact'],
    ['컨텍스트 완전 초기화', '/clear']
  ]);

  addTableSlide(p, '일반적 실수', [
    ['실수', '대안'],
    ['세션 중 --model 변경 시도', '/model <name>'],
    ['/help 대신 claude --help (세션 내)', '세션에선 /help'],
    ['Ctrl+C를 세션 종료로 오해', '종료는 Ctrl+D 또는 /exit'],
    ['claude update 건너뛰기', '주기적 업데이트 습관'],
    ['claude doctor를 잊음', '환경 문제 시 첫 단계']
  ]);

  addClosingSlide(p, 'Q&A', [
    '우리 팀이 가장 자주 쓸 CLI 조합은?',
    '신규 입사자 가이드에 어떤 단축키를 강조할까?',
    'claude doctor를 사내 온보딩 체크리스트에 포함?'
  ]);

  return logUrl(p);
}
