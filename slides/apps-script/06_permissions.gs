/**
 * Ch.06 권한 시스템 — Google Slides 빌더
 */

function buildChapter06() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.06 권한 시스템');

  addTitleSlide(p, 'Ch.06 권한 시스템',
    '모드 · 허용/차단 규칙 · Bash 패턴 · MCP 권한',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '권한이 제어하는 3가지 작업 범주',
    '4개 권한 모드 비교와 사용 시기',
    '모드 설정 3가지 방법',
    '허용/차단 규칙 구성 요소와 평가 순서',
    'Bash 패턴 매칭 세부 규칙',
    'MCP 도구 권한 제어',
    '보안 권장 사항 체크리스트'
  ]);

  addTableSlide(p, '권한이 제어하는 3가지 범주', [
    ['범주', '도구', '예시'],
    ['파일 작업', 'Read, Edit, Write', '소스 파일 읽기/편집/쓰기'],
    ['Bash 커맨드', 'Bash', '빌드, git, 스크립트'],
    ['MCP 도구', 'mcp__*__*', 'DB 쿼리, API 호출']
  ]);

  addTableSlide(p, '권한 모드 4종', [
    ['모드', '동작', '사용 시기'],
    ['default', '위험 작업 확인 요청', '일상 권장'],
    ['acceptEdits', '편집 자동, 셸 확인', '리팩터링'],
    ['plan', '읽기 전용 + 계획', '낯선 코드베이스'],
    ['bypassPermissions', '모든 검사 건너뜀', '샌드박스 전용']
  ]);

  addCodeSlide(p, '모드 설정 방법 3가지',
    'CLI, 슬래시, 설정 파일.',
    '# 1. CLI 플래그 (세션 시작)\n' +
    'claude --permission-mode acceptEdits\n\n' +
    '# 2. 슬래시 커맨드 (세션 중)\n' +
    '/permissions\n\n' +
    '# 3. settings.json\n' +
    '{\n' +
    '  "defaultMode": "acceptEdits"\n' +
    '}\n\n' +
    '# 유효값: default, acceptEdits, bypassPermissions, plan, dontAsk'
  );

  addTableSlide(p, '권한 규칙 구성 요소', [
    ['필드', '설명'],
    ['toolName', 'Bash, Edit, mcp__myserver 등'],
    ['ruleContent', '도구 입력과 매칭할 선택 패턴'],
    ['behavior', 'allow / deny / ask']
  ]);

  addTextSlide(p, '평가 순서',
    '규칙은 권한 모드보다 먼저 평가됨.\n\n' +
    '일치 규칙이 있으면 즉시 해당 동작 적용.\n\n' +
    '사용자 요청\n' +
    '     ↓\n' +
    'Claude가 tool_use 생성\n' +
    '     ↓\n' +
    '[규칙 매칭: allow/deny/ask?]\n' +
    '     ├── 매칭 → 해당 동작\n' +
    '     └── 매칭 없음 → [권한 모드 기본값 적용]'
  );

  addCodeSlide(p, '규칙 예시: 안전한 git 자동화',
    'default 모드 유지하면서도 자주 쓰는 읽기 git 작업 자동화.',
    '{\n' +
    '  "permissions": {\n' +
    '    "allow": [\n' +
    '      "Bash(git status)",\n' +
    '      "Bash(git diff *)",\n' +
    '      "Bash(git log *)",\n' +
    '      "Read(*)"\n' +
    '    ],\n' +
    '    "deny": [\n' +
    '      "Bash(rm -rf *)",\n' +
    '      "Bash(sudo *)"\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addTableSlide(p, 'Bash 패턴 매칭', [
    ['패턴', '매칭'],
    ['git status', '정확한 일치만'],
    ['git *', '모든 git 서브커맨드'],
    ['npm run *', '모든 npm run 스크립트'],
    ['*', '모든 bash (극도의 주의)']
  ]);

  addTextSlide(p, '복합 커맨드 처리',
    '&&, ||, ;, | 로 연결된 복합 커맨드:\n\n' +
    '• 각 서브커맨드 독립 검사\n' +
    '• 하나라도 차단되면 전체 차단\n\n' +
    '예: "git status && npm test"\n' +
    '    → 두 커맨드 모두 허용되어야 실행\n\n' +
    '이로 인해 공격자가 복합 커맨드를 통해\n' +
    '차단 규칙을 우회하는 것이 방지됨.'
  );

  addBulletSlide(p, '항상 차단/에스컬레이션되는 작업', [
    '프로젝트 외부로의 출력 리다이렉션 (>, >>)',
    '워킹트리 외부로 cd',
    'sed -i 편집 커맨드 (특수 처리)',
    '.claude/ 또는 .git/ 설정 디렉토리 대상',
    '셸 설정 파일 수정 (.bashrc, .zshrc)'
  ]);

  addCodeSlide(p, 'MCP 도구 권한',
    'MCP 도구도 동일한 규칙 시스템. 서버 전체 차단도 가능.',
    '{\n' +
    '  "permissions": {\n' +
    '    "deny": [\n' +
    '      "mcp__myserver"\n' +
    '    ],\n' +
    '    "allow": [\n' +
    '      "mcp__myserver__read_database"\n' +
    '    ]\n' +
    '  }\n' +
    '}\n\n' +
    '// mcp__servername만 쓰면 해당 서버 전체 차단\n' +
    '// 모델이 보기 전에 목록에서 필터링됨'
  );

  addCodeSlide(p, '실전: 읽기 전용 탐색',
    '신규 입사자가 낯선 저장소를 탐색할 때 쓸 설정.',
    '{\n' +
    '  "permissions": {\n' +
    '    "defaultMode": "default",\n' +
    '    "allow": [\n' +
    '      "Read(*)", "Grep(*)", "Glob(*)",\n' +
    '      "Bash(git status)", "Bash(git log *)",\n' +
    '      "Bash(git diff *)", "Bash(cat *)",\n' +
    '      "Bash(ls *)"\n' +
    '    ],\n' +
    '    "deny": [\n' +
    '      "Edit(*)", "Write(*)",\n' +
    '      "Bash(rm *)"\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '실전: 사내 CI 설정',
    'PR 리뷰 자동화에서 테스트만 실행. bypassPermissions 없이 자동화 달성.',
    '{\n' +
    '  "permissions": {\n' +
    '    "defaultMode": "default",\n' +
    '    "allow": [\n' +
    '      "Read(*)", "Grep(*)", "Glob(*)",\n' +
    '      "Bash(npm test *)",\n' +
    '      "Bash(npm run lint *)",\n' +
    '      "Bash(git diff *)"\n' +
    '    ],\n' +
    '    "deny": [\n' +
    '      "Bash(git push *)",\n' +
    '      "Bash(git commit *)",\n' +
    '      "Write(*)"\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addBulletSlide(p, '보안 권장 사항', [
    '대화형은 default 모드로 시작',
    '낯선 코드 탐색은 plan 모드',
    '편집 반복은 acceptEdits + 세분화 allow',
    '광범위한 모드 에스컬레이션 대신 세분화 allow 선호',
    '친숙하지 않은 저장소 클론 시 .claude/settings.json 검토',
    'bypassPermissions는 격리 환경에서만',
    '의심스러운 allow 규칙은 pull 전에 감사'
  ]);

  addClosingSlide(p, 'Q&A', [
    '우리 팀 공통 allow 규칙 후보는?',
    'bypassPermissions가 꼭 필요한 사내 워크플로우는 있는가?',
    '.claude/settings.json을 PR 리뷰 대상에 포함할까?'
  ]);

  return logUrl(p);
}
