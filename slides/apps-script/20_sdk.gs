/**
 * Ch.20 SDK 개요 — Google Slides 빌더
 */

function buildChapter20() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.20 SDK 개요');

  addTitleSlide(p, 'Ch.20 SDK 개요',
    'stdin/stdout 제어 프로토콜 · 메시지 타입 · 통합 패턴',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    'SDK의 역할과 일반 API와의 차이',
    '작동 5단계',
    '3가지 출력 형식 비교',
    '제어 프로토콜 메시지 봉투 2종',
    '초기화 요청 완전한 형태',
    '사용자 메시지와 우선순위',
    'SDK 메시지 스트림 타입 5종',
    'TypeScript 세션 API',
    '사용 사례 3종'
  ]);

  addTextSlide(p, 'SDK란',
    '다른 애플리케이션에 Claude Code를\n' +
    '임베드하기 위한 제어 프로토콜.\n\n' +
    '[대상]\n' +
    '• IDE 통합\n' +
    '• 자동화 스크립트\n' +
    '• CI/CD 파이프라인\n' +
    '• 서브프로세스 기반 모든 호스트\n\n' +
    '[차이점]\n' +
    '• 라이브러리 API 직접 노출 아님\n' +
    '• 구조화된 JSON 메시지 스트림으로 claude 프로세스와 통신\n' +
    '• 호스트 ↔ CLI 양방향 통신'
  );

  addCodeSlide(p, '작동 5단계',
    'stdin/stdout 기반 통신.',
    '# 1. 프로세스 스폰\n' +
    'claude --output-format stream-json --print --verbose\n\n' +
    '# 2. 초기화 요청 전송 (stdin)\n' +
    '#    control_request (subtype: "initialize")\n\n' +
    '# 3. stdout 메시지 스트리밍 (줄바꿈 구분 JSON)\n' +
    '# 4. 사용자 메시지 전송 (계속 대화)\n' +
    '# 5. 결과 처리'
  );

  addTableSlide(p, '출력 형식', [
    ['형식', '설명'],
    ['text', '일반 텍스트. 대화형 기본'],
    ['json', '단일 JSON 객체. 일회성 스크립트'],
    ['stream-json', '줄바꿈 구분 JSON 스트림. SDK 필수']
  ]);

  addCodeSlide(p, '제어 프로토콜 메시지 봉투',
    '호스트 ↔ CLI 양방향.',
    '// 호스트 → CLI\n' +
    '{\n' +
    '  "type": "control_request",\n' +
    '  "request_id": "<고유-문자열>",\n' +
    '  "request": { "subtype": "...", ...payload }\n' +
    '}\n\n' +
    '// CLI → 호스트\n' +
    '{\n' +
    '  "type": "control_response",\n' +
    '  "response": {\n' +
    '    "subtype": "success",\n' +
    '    "request_id": "<에코된-id>",\n' +
    '    "response": { ...payload }\n' +
    '  }\n' +
    '}\n\n' +
    '// 오류 시 subtype: "error" + error 필드'
  );

  addCodeSlide(p, '초기화 요청 (필수)',
    '반드시 먼저 전송. 세션 설정 + 기능 반환.',
    '{\n' +
    '  "type": "control_request",\n' +
    '  "request_id": "init-1",\n' +
    '  "request": {\n' +
    '    "subtype": "initialize",\n' +
    '    "systemPrompt": "당신은 CI 자동화 에이전트입니다.",\n' +
    '    "appendSystemPrompt": "항상 테스트 커버리지를 추가하세요.",\n' +
    '    "hooks": {\n' +
    '      "PreToolUse": [\n' +
    '        { "matcher": "Bash",\n' +
    '          "hookCallbackIds": ["my-hook-id"] }\n' +
    '      ]\n' +
    '    },\n' +
    '    "agents": {\n' +
    '      "CodeReviewer": {\n' +
    '        "description": "코드 품질과 보안을 검토합니다.",\n' +
    '        "prompt": "당신은 전문 코드 리뷰어입니다...",\n' +
    '        "model": "opus"\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '초기화 응답',
    '호스트가 받는 정보: 커맨드, 에이전트, 계정, 모델.',
    '{\n' +
    '  "type": "control_response",\n' +
    '  "response": {\n' +
    '    "subtype": "success",\n' +
    '    "request_id": "init-1",\n' +
    '    "response": {\n' +
    '      "commands": [...],\n' +
    '      "agents": [...],\n' +
    '      "output_style": "stream-json",\n' +
    '      "models": [...],\n' +
    '      "account": {\n' +
    '        "email": "user@example.com",\n' +
    '        "organization": "Acme Corp",\n' +
    '        "apiProvider": "firstParty"\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '사용자 메시지',
    '계속 대화하려면 stdin에 전송.',
    '{\n' +
    '  "type": "user",\n' +
    '  "message": {\n' +
    '    "role": "user",\n' +
    '    "content": "이 함수를 async/await으로 리팩터링해줘."\n' +
    '  },\n' +
    '  "parent_tool_use_id": null\n' +
    '}\n\n' +
    '// 필드\n' +
    '// - parent_tool_use_id: 응답하는 도구 사용 ID (최상위는 null)\n' +
    '// - priority: "now"/"next"/"later" 스케줄링 힌트'
  );

  addTableSlide(p, 'SDK 메시지 스트림 타입', [
    ['타입', '설명'],
    ['system (init)', '세션 시작 시 한 번. 모델, 도구, MCP, 모드, ID'],
    ['assistant', '모델 턴 생성. tool_use 블록 포함 가능'],
    ['stream_event', '스트리밍 중 부분 토큰'],
    ['tool_progress', '장시간 도구 주기적 상태 업데이트'],
    ['result', '각 턴 종료. 성공 또는 오류 서브타입']
  ]);

  addCodeSlide(p, 'result 메시지 예시',
    '비용·성능·오류 모니터링에 활용.',
    '{\n' +
    '  "type": "result",\n' +
    '  "subtype": "success",\n' +
    '  "result": "함수가 리팩터링되었습니다.",\n' +
    '  "duration_ms": 4200,\n' +
    '  "total_cost_usd": 0.0042,\n' +
    '  "num_turns": 3,\n' +
    '  "is_error": false,\n' +
    '  "session_id": "abc123"\n' +
    '}\n\n' +
    '// 호스트 활용:\n' +
    '// - 비용 모니터링 (total_cost_usd)\n' +
    '// - 성능 추적 (duration_ms, num_turns)\n' +
    '// - 오류 처리 (is_error, subtype)'
  );

  addTableSlide(p, '기타 제어 요청', [
    ['subtype', '방향', '설명'],
    ['interrupt', '호스트→CLI', '현재 턴 중단'],
    ['set_permission_mode', '호스트→CLI', '권한 모드 변경'],
    ['set_model', '호스트→CLI', '세션 중간 모델 전환'],
    ['can_use_tool', 'CLI→호스트', '도구 호출 권한 요청'],
    ['mcp_status', '호스트→CLI', 'MCP 서버 상태'],
    ['get_context_usage', '호스트→CLI', '컨텍스트 사용량'],
    ['rewind_files', '호스트→CLI', '파일 변경 되돌리기'],
    ['hook_callback', 'CLI→호스트', '등록된 훅 이벤트 전달']
  ]);

  addCodeSlide(p, 'TypeScript 세션 관리 API',
    'SDK는 ~/.claude/ 트랜스크립트 조작 함수도 내보냄.',
    'import {\n' +
    '  query,\n' +
    '  listSessions,\n' +
    '  getSessionInfo,\n' +
    '  getSessionMessages,\n' +
    '  forkSession,\n' +
    '  renameSession,\n' +
    '  tagSession,\n' +
    '} from \'@anthropic-ai/claude-code\''
  );

  addCodeSlide(p, 'query — 주요 SDK 진입점',
    '비동기 이터러블 반환. 메시지 순회.',
    'for await (const message of query({\n' +
    '  prompt: \'이 디렉토리에 어떤 파일이 있나요?\',\n' +
    '  options: { cwd: \'/my/project\' }\n' +
    '})) {\n' +
    '  if (message.type === \'result\') {\n' +
    '    console.log(message.result)\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '세션 관리 함수',
    '목록, 읽기, 분기.',
    '// 저장된 세션 목록\n' +
    'const sessions = await listSessions({\n' +
    '  dir: \'/my/project\',\n' +
    '  limit: 50\n' +
    '})\n\n' +
    '// 트랜스크립트 읽기\n' +
    'const messages = await getSessionMessages(sessionId, {\n' +
    '  dir: \'/my/project\',\n' +
    '  includeSystemMessages: false,\n' +
    '})\n\n' +
    '// 대화 분기\n' +
    'const { sessionId: newId } = await forkSession(originalSessionId, {\n' +
    '  upToMessageId: \'msg-uuid\',\n' +
    '  title: \'실험적 분기\',\n' +
    '})'
  );

  addTextSlide(p, '사용 사례 1: IDE 통합',
    'IDE가 영속 Claude Code 프로세스 스폰.\n\n' +
    '[구현]\n' +
    '• 제어 프로토콜로 메시지 라우팅\n' +
    '• PreToolUse 훅 콜백으로 파일 편집 가로채기\n' +
    '• 적용 전 IDE 네이티브 UI에 diff 표시\n' +
    '• 사용자 승인 → 적용\n\n' +
    '예시: VS Code 확장, JetBrains 플러그인.'
  );

  addCodeSlide(p, '사용 사례 2: CI/CD 자동화',
    'PR 자동 리뷰, 테스트 실패 자동 수정, 문서 업데이트.',
    'result=$(echo "diff를 검토하고 pass/fail을 출력해줘" | \\\n' +
    '  claude --output-format json --print \\\n' +
    '         --permission-mode bypassPermissions)\n\n' +
    '# 통합 시나리오:\n' +
    '# - PR 자동 리뷰\n' +
    '# - 테스트 실패 자동 수정 시도\n' +
    '# - 문서 자동 업데이트\n' +
    '# - 보안 감사\n\n' +
    '# 주의: 샌드박스 + 비용/턴 상한 필수'
  );

  addTextSlide(p, '사용 사례 3: 헤드리스 에이전트',
    '[구성]\n' +
    '• TypeScript SDK query() 스트리밍 사용\n' +
    '• 지속 데몬 프로세스 유지\n' +
    '• 크론 스케줄로 작업 실행\n\n' +
    '[시나리오]\n' +
    '• 매일 밤 의존성 업데이트 PR 생성\n' +
    '• 특정 시간마다 릴리즈 노트 초안\n' +
    '• 이슈 트리아지 자동화'
  );

  addBulletSlide(p, '실전 통합 체크리스트', [
    'stream-json 출력 형식 선택',
    'initialize 요청 먼저 전송',
    'request_id 고유성 보장',
    'result 메시지에서 비용·오류 처리',
    'can_use_tool 응답으로 권한 제어',
    'hook_callback으로 도구 이벤트 관찰',
    'set_permission_mode / set_model로 세션 중 튜닝',
    'interrupt로 무한 루프 방어'
  ]);

  addBulletSlide(p, '보안 고려사항', [
    'CI에서 bypassPermissions 사용 시 반드시 샌드박스',
    'SDK 통합에서 사용자 입력 sanitize',
    'systemPrompt 교체 시 안전 가드 손실 가능 → append 권장',
    'can_use_tool 콜백에서 세밀한 허용 정책 구현',
    'hook_callback으로 모든 도구 호출 감사',
    '시크릿은 CLI 인수가 아닌 env로 전달'
  ]);

  addTextSlide(p, '전체 과정 정리',
    '20개 챕터 완주!\n\n' +
    '소개: Ch.01-03 → Claude Code 본질, 빠른 시작, 설치\n' +
    '핵심 개념: Ch.04-07 → 작동 원리, 메모리, 권한, 도구\n' +
    '설정: Ch.08-10 → CLAUDE.md, 환경 변수, settings.json\n' +
    '가이드: Ch.11-15 → 인증, 훅, MCP, 멀티에이전트, 스킬\n' +
    '레퍼런스: Ch.16-20 → 커맨드, CLI, 슬래시, 훅, SDK'
  );

  addBulletSlide(p, '사내 도입 로드맵', [
    'Week 1: 개발자 온보딩 + OAuth 설정 + /init',
    'Week 2: 프로젝트별 CLAUDE.md 작성 + 권한 규칙 표준화',
    'Week 3: 훅 도입 (포맷/lint/로깅) + MCP 서버 목록 정의',
    'Week 4: 스킬 라이브러리 구축 + 멀티에이전트 실험',
    'Week 5+: SDK 기반 CI 자동화 + 엔터프라이즈 Managed 설정'
  ]);

  addClosingSlide(p, 'Q&A / 마무리', [
    '우리 팀의 첫 SDK 통합 대상은?',
    '비용 상한을 어떻게 조직 전체에 강제할까?',
    '훅 + SDK로 사내 에이전트 플랫폼을 만든다면?'
  ]);

  return logUrl(p);
}
