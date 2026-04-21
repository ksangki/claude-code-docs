/**
 * Ch.12 훅 (Hooks) — Google Slides 빌더
 */

function buildChapter12() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.12 훅');

  addTitleSlide(p, 'Ch.12 훅 (Hooks)',
    '도구 이벤트 자동화 · 강제 · 관찰',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '훅 작동 방식과 종료 코드 시맨틱',
    '17가지 훅 이벤트 개요',
    '훅 설정 JSON 구조',
    '4가지 훅 타입 (command / http / prompt / agent)',
    '실전 예시 4종 (포맷 / 차단 / 로깅 / env 주입)',
    '훅 vs 스킬 차이'
  ]);

  addTextSlide(p, '훅이란',
    '특정 이벤트에 바인딩된 커맨드.\n\n' +
    '[지원 타입]\n' +
    '• 셸 스크립트\n' +
    '• HTTP 엔드포인트\n' +
    '• LLM 프롬프트\n' +
    '• 에이전트\n\n' +
    '[활용]\n' +
    '• 코드 스타일 강제 (prettier, biome)\n' +
    '• 테스트 자동 실행\n' +
    '• 도구 사용 로깅\n' +
    '• 위험한 커맨드 차단'
  );

  addTextSlide(p, '훅 작동 방식',
    '1. 이벤트 발생 (예: PostToolUse)\n' +
    '2. 매칭된 훅이 자동 실행\n' +
    '3. 종료 코드와 출력에 따라 다음 동작 결정\n\n' +
    '각 훅의 입력: 무슨 일이 일어났는지 설명하는 JSON 객체 (stdin).'
  );

  addTableSlide(p, '종료 코드 의미', [
    ['코드', '의미'],
    ['0', '성공. stdout이 Claude에게 표시될 수 있음'],
    ['2', '차단 또는 주입. stderr를 Claude에게 표시 + 도구 호출 방지'],
    ['기타', 'stderr를 사용자에게만 표시, 실행 계속']
  ]);

  addTableSlide(p, '훅 이벤트 (1/2)', [
    ['이벤트', '설명'],
    ['PreToolUse', '도구 호출 직전. 2 → 차단'],
    ['PostToolUse', '성공 호출 후. 관찰·컨텍스트 주입'],
    ['PostToolUseFailure', '도구 호출 오류 종료 시'],
    ['Stop', 'Claude 응답 종료 직전. 2 → 대화 계속'],
    ['SubagentStop', '서브에이전트 종료 직전'],
    ['SubagentStart', '서브에이전트 시작 시'],
    ['SessionStart', '세션 시작/재개/clear/compact 후'],
    ['UserPromptSubmit', '사용자 프롬프트 제출. 2 → 차단']
  ]);

  addTableSlide(p, '훅 이벤트 (2/2)', [
    ['이벤트', '설명'],
    ['PreCompact', '컴팩션 시작 직전. 2 → 컴팩션 차단'],
    ['PostCompact', '컴팩션 완료 후'],
    ['Setup', 'init 또는 유지보수 시'],
    ['PermissionRequest', '권한 다이얼로그 표시 시'],
    ['Notification', '각종 알림'],
    ['CwdChanged', '작업 디렉토리 변경'],
    ['FileChanged', '감시 파일 변경'],
    ['SessionEnd', '세션 종료']
  ]);

  addCodeSlide(p, '훅 설정 구조',
    '/hooks로 설정 패널. 실제 저장: 설정 파일 hooks 필드.',
    '{\n' +
    '  "hooks": {\n' +
    '    "PostToolUse": [\n' +
    '      {\n' +
    '        "matcher": "Write",\n' +
    '        "hooks": [\n' +
    '          {\n' +
    '            "type": "command",\n' +
    '            "command": "prettier --write $CLAUDE_FILE_PATH"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}\n\n' +
    '// matcher 없음 → 모든 입력과 일치'
  );

  addCodeSlide(p, '훅 타입 1: 셸 커맨드',
    '가장 일반적. 모든 옵션.',
    '{\n' +
    '  "type": "command",\n' +
    '  "command": "npm test",\n' +
    '  "timeout": 60,\n' +
    '  "shell": "bash",\n' +
    '  "async": false,\n' +
    '  "once": false,\n' +
    '  "if": "Bash(git *)",\n' +
    '  "statusMessage": "검증 중..."\n' +
    '}'
  );

  addCodeSlide(p, '훅 타입 2: HTTP 요청',
    '사내 로깅 서버, 감사 시스템 연동.',
    '{\n' +
    '  "type": "http",\n' +
    '  "url": "https://hooks.example.com/claude-event",\n' +
    '  "headers": {\n' +
    '    "Authorization": "Bearer $MY_TOKEN"\n' +
    '  },\n' +
    '  "allowedEnvVars": ["MY_TOKEN"],\n' +
    '  "timeout": 10\n' +
    '}\n\n' +
    '// Claude Code가 훅 입력 JSON을 URL에 POST'
  );

  addCodeSlide(p, '훅 타입 3: LLM 프롬프트',
    'LLM이 판단하는 게이트.',
    '{\n' +
    '  "type": "prompt",\n' +
    '  "prompt": "이 bash 커맨드에 보안 문제가 있는지 확인하세요: $ARGUMENTS. 문제가 있으면 설명하고 코드 2로 종료하세요.",\n' +
    '  "model": "claude-haiku-4-5",\n' +
    '  "timeout": 30\n' +
    '}\n\n' +
    '// 예: 위험 커맨드 탐지, PR 설명 자동 요약'
  );

  addCodeSlide(p, '훅 타입 4: 에이전트 훅',
    '도구 접근 권한이 있는 짧은 에이전틱 루프.',
    '{\n' +
    '  "type": "agent",\n' +
    '  "prompt": "단위 테스트가 실행되고 통과했는지 확인하세요.",\n' +
    '  "timeout": 60\n' +
    '}\n\n' +
    '// 사내 활용: 커밋 전 테스트 통과 확인,\n' +
    '//          특정 규약 준수 검증'
  );

  addCodeSlide(p, '실전: 파일 편집 후 자동 포맷',
    'Claude가 쓴 파일이 자동으로 포맷됨.',
    '{\n' +
    '  "hooks": {\n' +
    '    "PostToolUse": [\n' +
    '      {\n' +
    '        "matcher": "Write",\n' +
    '        "hooks": [\n' +
    '          {\n' +
    '            "type": "command",\n' +
    '            "command": "prettier --write \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '실전: 위험한 커맨드 차단',
    '종료 코드 2 → 도구 호출 차단 + Claude에게 이유 전달.',
    '{\n' +
    '  "hooks": {\n' +
    '    "PreToolUse": [\n' +
    '      {\n' +
    '        "matcher": "Bash",\n' +
    '        "hooks": [\n' +
    '          {\n' +
    '            "type": "command",\n' +
    '            "command": "if echo \\"$CLAUDE_TOOL_INPUT\\" | grep -q \'rm -rf\'; then echo \'차단: rm -rf는 허용되지 않습니다\' >&2; exit 2; fi"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '실전: 모든 도구 사용 로깅',
    '비동기 실행 → 루프 블로킹 없음. 사내 감사/사용량 분석.',
    '{\n' +
    '  "hooks": {\n' +
    '    "PostToolUse": [\n' +
    '      {\n' +
    '        "hooks": [\n' +
    '          {\n' +
    '            "type": "command",\n' +
    '            "command": "echo \\"$(date -u +%Y-%m-%dT%H:%M:%SZ) $CLAUDE_TOOL_NAME\\" >> ~/.claude-tool-log.txt",\n' +
    '            "async": true\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '실전: 디렉토리 변경 시 env 주입',
    'cd 후 자동으로 프로젝트별 env 적용. direnv 패턴.',
    '{\n' +
    '  "hooks": {\n' +
    '    "CwdChanged": [\n' +
    '      {\n' +
    '        "hooks": [\n' +
    '          {\n' +
    '            "type": "command",\n' +
    '            "command": "if [ -f .envrc ]; then grep \'^export \' .envrc >> \\"$CLAUDE_ENV_FILE\\"; fi"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addTwoColumnSlide(p, '훅 vs 스킬 비교',
    '훅',
    [
      '도구 이벤트에 자동',
      '부작용·게이팅·관찰',
      '설정 JSON',
      'prettier 자동 실행'
    ],
    '스킬',
    [
      '/skill-name 명시적',
      '온디맨드 워크플로우',
      '.claude/skills/SKILL.md',
      '/deploy staging'
    ]
  );

  addTableSlide(p, '일반적 실수', [
    ['실수', '대안'],
    ['훅에서 긴 작업을 동기 실행', 'async: true 또는 timeout 단축'],
    ['훅이 조용히 실패', 'stderr + 종료 코드 명시'],
    ['모든 이벤트에 광범위 훅', 'matcher로 범위 제한'],
    ['시크릿을 커맨드에 하드코딩', 'env + allowedEnvVars'],
    ['훅 디버깅 어려움', 'statusMessage + 로그 파일']
  ]);

  addClosingSlide(p, 'Q&A', [
    '우리 팀에 자동 포맷을 강제할 훅이 이미 있는가?',
    '사내 감사 로그 서버에 HTTP 훅을 붙일 수 있을까?',
    'PreToolUse LLM 프롬프트 훅으로 PR 규약 검증 가능한가?'
  ]);

  return logUrl(p);
}
