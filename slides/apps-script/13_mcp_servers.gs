/**
 * Ch.13 MCP 서버 — Google Slides 빌더
 */

function buildChapter13() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.13 MCP 서버');

  addTitleSlide(p, 'Ch.13 MCP 서버',
    'Model Context Protocol로 외부 도구 연결',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    'MCP 개요와 Claude Code 활용 의미',
    '서버 추가 방법 3가지 (CLI · --mcp-config · 설정 파일)',
    '설정 파일 형식 (stdio / HTTP / SSE)',
    '범위 3종과 우선순위',
    '서버 관리 커맨드 (/mcp)',
    'MCP 도구 호출 승인',
    '실전 예시 (filesystem · postgres)',
    '문제 해결 가이드'
  ]);

  addTextSlide(p, 'MCP란',
    'Model Context Protocol — Claude Code가 외부 데이터 소스·서비스에\n' +
    '연결하는 오픈 표준.\n\n' +
    '[활용]\n' +
    '• 데이터베이스 쿼리\n' +
    '• Jira 티켓 읽기\n' +
    '• Slack 워크스페이스 상호작용\n' +
    '• 사내 API 호출\n' +
    '• 브라우저 자동화\n\n' +
    '효과: Claude가 새로운 도구에 접근 → 역량 확장.'
  );

  addCodeSlide(p, '서버 추가 방법 1: CLI',
    '가장 빠르게 추가. 범위 지정 가능.',
    '# 기본 추가\n' +
    'claude mcp add <이름> -- <커맨드> [인수...]\n\n' +
    '# filesystem MCP 서버 예시\n' +
    'claude mcp add filesystem -- \\\n' +
    '  npx -y @modelcontextprotocol/server-filesystem /tmp\n\n' +
    '# 범위 지정\n' +
    'claude mcp add --scope project filesystem -- \\\n' +
    '  npx -y @modelcontextprotocol/server-filesystem /tmp\n' +
    'claude mcp add --scope user my-db -- \\\n' +
    '  npx -y @my-org/mcp-server-postgres'
  );

  addCodeSlide(p, '서버 추가 방법 2: --mcp-config',
    'CI 환경에서 설정 파일 직접 전달.',
    'claude --mcp-config ./my-mcp-config.json\n\n' +
    '# 활용:\n' +
    '# - CI 환경에서 설정 파일 직접 전달\n' +
    '# - 저장소에 커밋하지 않을 독립형 설정\n' +
    '# - 여러 설정 파일 혼합\n' +
    '#   (--mcp-config a.json --mcp-config b.json)'
  );

  addCodeSlide(p, '설정 파일: stdio (로컬)',
    '가장 일반적. 로컬 프로세스 기반.',
    '{\n' +
    '  "mcpServers": {\n' +
    '    "filesystem": {\n' +
    '      "command": "npx",\n' +
    '      "args": [\n' +
    '        "-y",\n' +
    '        "@modelcontextprotocol/server-filesystem",\n' +
    '        "/home/user/projects"\n' +
    '      ],\n' +
    '      "env": {\n' +
    '        "NODE_ENV": "production"\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}\n\n' +
    '// $VAR 및 ${VAR} 구문 지원'
  );

  addCodeSlide(p, '설정 파일: HTTP / SSE',
    '원격 서버 연결.',
    '// HTTP\n' +
    '{\n' +
    '  "mcpServers": {\n' +
    '    "my-api": {\n' +
    '      "type": "http",\n' +
    '      "url": "https://mcp.example.com/v1",\n' +
    '      "headers": {\n' +
    '        "Authorization": "Bearer $MY_API_TOKEN"\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}\n\n' +
    '// SSE (Server-Sent Events)\n' +
    '{\n' +
    '  "mcpServers": {\n' +
    '    "events-server": {\n' +
    '      "type": "sse",\n' +
    '      "url": "https://mcp.example.com/sse"\n' +
    '    }\n' +
    '  }\n' +
    '}'
  );

  addTableSlide(p, '설정 범위', [
    ['범위', '위치', '용도'],
    ['project', '.mcp.json (CWD)', '팀 공유 서버'],
    ['user', '~/.claude.json', '개인 전역'],
    ['local', '.claude/settings.local.json', '개인, VCS 미커밋']
  ]);

  addTextSlide(p, '우선순위',
    '같은 서버 이름이 여러 범위에 있으면:\n\n' +
    'local > project > user\n\n' +
    '→ 로컬 재정의가 가장 강함.\n' +
    '→ 팀 공유 설정은 .mcp.json에 기본으로 두고,\n' +
    '   개인 재정의가 필요하면 settings.local.json에 덮어씀.'
  );

  addCodeSlide(p, '서버 관리: /mcp',
    '활성화/비활성화, 재연결, 상태 확인.',
    '# 활성화/비활성화\n' +
    '/mcp enable <server-name>\n' +
    '/mcp disable <server-name>\n' +
    '/mcp enable all\n' +
    '/mcp disable all\n\n' +
    '# 재연결\n' +
    '/mcp reconnect <server-name>\n\n' +
    '# 상태 확인\n' +
    '/mcp    # 패널 오픈'
  );

  addTableSlide(p, '서버 상태 의미', [
    ['상태', '설명'],
    ['connected', '서버 실행 + 준비 완료'],
    ['pending', '서버 시작 중'],
    ['failed', '연결 실패 (오류 메시지 확인)'],
    ['needs-auth', 'OAuth 인증 필요'],
    ['disabled', '설정됐지만 꺼짐']
  ]);

  addTextSlide(p, 'MCP 도구 호출 승인',
    'Claude가 MCP 도구 호출 직전 권한 프롬프트 표시:\n\n' +
    '• 한 번 허용 — 이 호출만 승인\n' +
    '• 항상 허용 — 이 세션 동안 모든 호출 승인\n' +
    '• 거부 — 차단 → Claude가 다른 접근 시도\n\n' +
    '자동 모드에서 사전 승인:\n' +
    '{\n' +
    '  "permissions": {\n' +
    '    "allow": [\n' +
    '      "mcp__filesystem__read_file",\n' +
    '      "mcp__filesystem__write_file"\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '실전: filesystem 서버',
    '프로젝트 루트 밖 디렉토리에도 안전하게 접근.',
    '# 1. 서버 추가\n' +
    'claude mcp add --scope project filesystem -- \\\n' +
    '  npx -y @modelcontextprotocol/server-filesystem \\\n' +
    '  /home/user/projects\n\n' +
    '# 2. 연결 확인\n' +
    '#    /mcp 실행 → filesystem이 connected로 표시\n\n' +
    '# 3. 사용\n' +
    '#    Claude가 mcp__filesystem__read_file 등으로\n' +
    '#    /home/user/projects의 파일을 읽고 쓸 수 있음'
  );

  addCodeSlide(p, '실전: 데이터베이스 서버',
    '사내 DB에 Claude가 쿼리 가능.',
    '{\n' +
    '  "mcpServers": {\n' +
    '    "postgres": {\n' +
    '      "command": "npx",\n' +
    '      "args": [\n' +
    '        "-y",\n' +
    '        "@modelcontextprotocol/server-postgres"\n' +
    '      ],\n' +
    '      "env": {\n' +
    '        "POSTGRES_CONNECTION_STRING": "$DATABASE_URL"\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}\n\n' +
    '# 실행 전\n' +
    'export DATABASE_URL="postgresql://user:pass@host:5432/db"\n' +
    'claude'
  );

  addBulletSlide(p, '문제 해결: failed 상태', [
    '커맨드가 실행 가능한지 확인 (which npx)',
    '커맨드를 직접 실행해 오류 없이 시작되는지 확인',
    '필요한 환경 변수 설정 여부 확인',
    '상세 로그: claude --debug'
  ]);

  addTextSlide(p, '문제 해결: 기타',
    '도구가 안 보임\n' +
    '• 연결됐지만 미인증 상태일 가능성\n' +
    '• /mcp에서 needs-auth 확인 → OAuth 흐름\n' +
    '• /mcp reconnect <server-name>\n\n' +
    'Windows에서 npx 실패\n' +
    '  "command": "cmd",\n' +
    '  "args": ["/c", "npx", "-y", "@my-org/mcp-server"]\n' +
    '\n' +
    'WSL을 쓸 수 있다면 WSL 권장.'
  );

  addBulletSlide(p, '보안 체크리스트', [
    'MCP 서버 코드 감사 완료',
    '시크릿은 env + allowedEnvVars',
    '프로덕션 DB는 읽기 전용 권한만',
    '범위 확인 (project vs user vs local)',
    '낯선 저장소 클론 시 .mcp.json 검토',
    'allowManagedMcpServersOnly로 화이트리스트 강제 (엔터프라이즈)'
  ]);

  addClosingSlide(p, 'Q&A / 실습', [
    '사내에 MCP 서버로 만들 후보 도구는?',
    '기존 SaaS 중 MCP 서버가 이미 있는지 조사',
    '.mcp.json을 PR 리뷰 대상에 포함시킬지 결정'
  ]);

  return logUrl(p);
}
