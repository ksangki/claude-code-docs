/**
 * Ch.19 훅 레퍼런스 — Google Slides 빌더
 */

function buildChapter19() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.19 훅 레퍼런스');

  addTitleSlide(p, 'Ch.19 훅 레퍼런스',
    '모든 이벤트 · 입력 · 출력 · 종료 코드',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '매처 설정과 이벤트별 매칭 필드',
    '4가지 훅 타입의 완전한 필드 목록',
    '기본 훅 입력 (모든 이벤트 공통)',
    '동기 훅 출력 JSON 스키마',
    '이벤트별 입력/출력/종료 코드 시맨틱',
    '비동기 훅의 제약과 용도'
  ]);

  addCodeSlide(p, '훅 설정 구조 (재확인)',
    '설정 파일 최상위 hooks 키.',
    '{\n' +
    '  "hooks": {\n' +
    '    "PreToolUse": [\n' +
    '      {\n' +
    '        "matcher": "Bash",\n' +
    '        "hooks": [\n' +
    '          {\n' +
    '            "type": "command",\n' +
    '            "command": "echo \'bash 커맨드 실행 예정\' >&2"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addTableSlide(p, '매처 설정: 이벤트별 필드', [
    ['이벤트', '매칭 필드'],
    ['PreToolUse / PostToolUse / PostToolUseFailure', 'tool_name'],
    ['PermissionRequest / PermissionDenied', 'tool_name'],
    ['Notification', 'notification_type'],
    ['SessionStart', 'source (startup/resume/clear/compact)'],
    ['Setup', 'trigger (init/maintenance)'],
    ['SubagentStart / SubagentStop', 'agent_type'],
    ['PreCompact / PostCompact', 'trigger (manual/auto)'],
    ['FileChanged', '파일 이름 패턴']
  ]);

  addCodeSlide(p, '훅 타입 1: 셸 커맨드 (전체 필드)',
    '모든 옵션.',
    '{\n' +
    '  "type": "command",\n' +
    '  "command": "jq \'.tool_name\' && my-validator",\n' +
    '  "timeout": 30,\n' +
    '  "shell": "bash",\n' +
    '  "async": false,\n' +
    '  "once": false,\n' +
    '  "if": "Bash(git *)",\n' +
    '  "statusMessage": "검증 중..."\n' +
    '}\n\n' +
    '// asyncRewake: true → 백그라운드 + 코드 2 종료 시 모델 깨움'
  );

  addCodeSlide(p, '훅 타입 2-4',
    'LLM, 에이전트, HTTP.',
    '// LLM 평가\n' +
    '{ "type": "prompt",\n' +
    '  "prompt": "이 커맨드가 안전한지: $ARGUMENTS",\n' +
    '  "model": "claude-haiku-4-5", "timeout": 30 }\n\n' +
    '// 에이전틱 검증기\n' +
    '{ "type": "agent",\n' +
    '  "prompt": "단위 테스트 통과 확인",\n' +
    '  "model": "claude-haiku-4-5", "timeout": 120 }\n\n' +
    '// HTTP 엔드포인트\n' +
    '{ "type": "http",\n' +
    '  "url": "https://my-server.example.com/hook",\n' +
    '  "headers": { "Authorization": "Bearer $MY_TOKEN" },\n' +
    '  "allowedEnvVars": ["MY_TOKEN"], "timeout": 10 }'
  );

  addTableSlide(p, '기본 훅 입력 (공통)', [
    ['필드', '설명'],
    ['hook_event_name', '"PreToolUse" 등'],
    ['session_id', '현재 세션 ID'],
    ['transcript_path', 'JSONL 트랜스크립트 절대 경로'],
    ['cwd', '훅 발생 시점 CWD'],
    ['permission_mode', '활성 권한 모드'],
    ['agent_id', '서브에이전트 발생 시 식별자']
  ]);

  addCodeSlide(p, '동기 훅 출력 (stdout JSON)',
    '블로킹 훅이 종료 전에 출력 가능.',
    '{\n' +
    '  "continue": true,\n' +
    '  "suppressOutput": false,\n' +
    '  "decision": "approve",\n' +
    '  "reason": "커맨드가 안전합니다",\n' +
    '  "systemMessage": "훅이 이 작업을 승인했습니다.",\n' +
    '  "hookSpecificOutput": {\n' +
    '    "hookEventName": "PreToolUse",\n' +
    '    "permissionDecision": "allow"\n' +
    '  }\n' +
    '}\n\n' +
    '// 종료 코드와 함께 세밀한 제어 가능'
  );

  addTableSlide(p, 'PreToolUse', [
    ['코드', '효과'],
    ['0', '출력 표시 안 됨. 훅 JSON 출력 적용'],
    ['2', 'stderr를 Claude에게 표시 + 도구 호출 차단'],
    ['기타', 'stderr 사용자에게만, 실행 계속']
  ]);

  addTextSlide(p, 'PreToolUse hookSpecificOutput',
    '입력: tool_name, tool_input, tool_use_id\n\n' +
    '[hookSpecificOutput 필드]\n' +
    '• permissionDecision: allow/deny/ask — 권한 재정의\n' +
    '• updatedInput: 도구가 받을 교체 입력\n' +
    '• additionalContext: 이 턴에 컨텍스트 주입\n\n' +
    '활용: 위험 커맨드 차단, 프롬프트 개선,\n' +
    '         권한 정책 자동 평가.'
  );

  addTableSlide(p, 'PostToolUse', [
    ['코드', '효과'],
    ['0', 'stdout이 트랜스크립트 모드에 표시 (Ctrl+O)'],
    ['2', 'stderr를 즉시 Claude에게 시스템 메시지로 표시'],
    ['기타', 'stderr 사용자에게만 표시']
  ]);

  addTableSlide(p, 'Stop', [
    ['코드', '효과'],
    ['0', '출력 표시 안 됨'],
    ['2', 'stderr 시스템 메시지 주입 + Claude 대화 계속'],
    ['기타', 'stderr 사용자만 + Claude 중지']
  ]);

  addTextSlide(p, 'Stop 팁',
    '종료 코드 2 → Claude 출력 확인 후\n' +
    '조건 미충족 시 대화 계속.\n\n' +
    '예: 테스트 여전히 실패 시.\n\n' +
    '이것으로 Claude가 일을 끝내기 전에\n' +
    '품질 게이트를 강제할 수 있음.'
  );

  addTextSlide(p, 'SessionStart hookSpecificOutput',
    '입력: source (startup/resume/clear/compact), model\n\n' +
    '[hookSpecificOutput 필드]\n' +
    '• additionalContext — 세션 시스템 프롬프트 주입\n' +
    '• initialUserMessage — 세션의 첫 사용자 메시지 자동 제출\n' +
    '• watchPaths — FileChanged 감시기에 등록할 절대 경로\n\n' +
    '활용:\n' +
    '• 초기 컨텍스트 주입\n' +
    '• 환경 변수 설정\n' +
    '• 자동 시작 프롬프트'
  );

  addTableSlide(p, 'UserPromptSubmit', [
    ['코드', '효과'],
    ['0', 'stdout이 Claude에게 추가 컨텍스트'],
    ['2', '처리 차단 + 원본 프롬프트 지움 + stderr 사용자 표시'],
    ['기타', 'stderr 사용자만 표시']
  ]);

  addTextSlide(p, 'PermissionRequest · CwdChanged · FileChanged',
    'PermissionRequest:\n' +
    '• 권한 다이얼로그 표시 시 발생\n' +
    '• hookSpecificOutput.decision으로 UI 없이 승인/거부\n\n' +
    'CwdChanged:\n' +
    '• 작업 디렉토리 변경 후\n' +
    '• 입력: old_cwd, new_cwd\n' +
    '• CLAUDE_ENV_FILE에 export 줄을 쓰면 이후 Bash에 적용\n\n' +
    'FileChanged:\n' +
    '• 감시 파일 change/add/unlink\n' +
    '• 입력: file_path, event'
  );

  addCodeSlide(p, '비동기 훅',
    '백그라운드 실행. 제약과 용도.',
    '{\n' +
    '  "async": true,\n' +
    '  "asyncTimeout": 30\n' +
    '}\n\n' +
    '// [제약]\n' +
    '// - 도구 실행 차단 불가\n' +
    '// - 컨텍스트 주입 불가\n' +
    '// - 에이전틱 루프 느리게 하면 안 되는 부작용 전용\n\n' +
    '// [적합 용도]\n' +
    '// 알림, 로깅, 메트릭 수집'
  );

  addCodeSlide(p, '실전: 세션 시작 시 보안 브리핑',
    '매 세션 시작 시 자동 컨텍스트 주입.',
    '{\n' +
    '  "hooks": {\n' +
    '    "SessionStart": [{\n' +
    '      "hooks": [{\n' +
    '        "type": "command",\n' +
    '        "command": "echo \'{\\"hookSpecificOutput\\": {\\"additionalContext\\": \\"이 저장소는 PII를 다룹니다. 모든 DB 쿼리에 익명화를 적용하세요.\\"}}\'"\n' +
    '      }]\n' +
    '    }]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '실전: Stop 훅으로 테스트 강제',
    'Claude가 마치려 할 때 테스트 실패 감지 → 대화 계속.',
    '{\n' +
    '  "hooks": {\n' +
    '    "Stop": [{\n' +
    '      "hooks": [{\n' +
    '        "type": "command",\n' +
    '        "command": "if ! npm test --silent 2>/dev/null; then echo \'테스트가 실패합니다. 수정하세요.\' >&2; exit 2; fi"\n' +
    '      }]\n' +
    '    }]\n' +
    '  }\n' +
    '}'
  );

  addBulletSlide(p, '훅 설계 원칙', [
    '단일 책임: 하나의 훅 = 하나의 작업',
    '빠름: 동기 훅은 수 초 내',
    '조용함: 사용자 혼란 방지 위해 불필요한 출력 최소화',
    '안전한 실패: 훅이 실패해도 주 흐름 방해 최소화',
    '디버깅 가능: 로그 파일 + statusMessage',
    '버전 관리: 훅 설정은 저장소에 커밋'
  ]);

  addClosingSlide(p, 'Q&A', [
    'Stop 훅으로 강제할 사내 품질 게이트는?',
    'SessionStart에 주입할 팀 공통 브리핑은?',
    '감사용 HTTP 훅의 이벤트 수집 파이프라인 설계?'
  ]);

  return logUrl(p);
}
