/**
 * Ch.10 설정 파일 (settings.json) — Google Slides 빌더
 */

function buildChapter10() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.10 설정 파일');

  addTitleSlide(p, 'Ch.10 설정 파일 (settings.json)',
    '사용자 · 프로젝트 · Managed 레벨 설정 완전 가이드',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '4개 범위의 설정 파일 위치',
    '우선순위 병합 규칙',
    '/config UI 사용',
    '핵심 필드 레퍼런스 15종',
    'Managed 설정 배포 방법',
    'Managed 전용 잠금 설정',
    'JSON 스키마 연결로 자동완성'
  ]);

  addTableSlide(p, '설정 파일 위치 (4개 범위)', [
    ['범위', '경로', '적용'],
    ['전역 (사용자)', '~/.claude/settings.json', '모든 프로젝트'],
    ['프로젝트 (공유)', '.claude/settings.json', '저장소 참여자 전체, 커밋'],
    ['로컬 (개인)', '.claude/settings.local.json', 'gitignore'],
    ['Managed', '플랫폼별 시스템 경로', '엔터프라이즈 배포']
  ]);

  addTextSlide(p, '우선순위 병합',
    '플러그인 기본값\n' +
    '    ↓\n' +
    '사용자 설정\n' +
    '    ↓\n' +
    '프로젝트 설정\n' +
    '    ↓\n' +
    '로컬 설정\n' +
    '    ↓\n' +
    'Managed (정책) 설정   ← 최우선, 재정의 불가\n\n' +
    'Managed가 가장 강력, 이후 CWD에 가까운 쪽이 우선.'
  );

  addTextSlide(p, '설정 UI: /config',
    '세션 내에서: /config\n\n' +
    '• 각 범위의 현재 활성 설정 확인\n' +
    '• 파일 직접 편집도 가능\n' +
    '• Claude Code가 변경 감지 → 자동 리로드\n' +
    '• 별칭: /settings'
  );

  addCodeSlide(p, '필드: model',
    'Claude Code가 사용하는 기본 모델 재정의.',
    '{ "model": "claude-opus-4-5" }\n\n' +
    '// 공급자가 지원하는 모든 모델 ID 허용\n' +
    '// 우선순위: --model 플래그 > ANTHROPIC_MODEL env > 설정 model'
  );

  addTableSlide(p, '필드: permissions', [
    ['필드', '설명'],
    ['allow', '확인 없이 수행 가능한 작업'],
    ['deny', '항상 차단되는 작업'],
    ['ask', '항상 확인 요청'],
    ['defaultMode', '기본 권한 모드'],
    ['disableBypassPermissionsMode', 'bypass 모드 진입 방지'],
    ['additionalDirectories', '추가 접근 디렉토리']
  ]);

  addCodeSlide(p, '필드: hooks',
    '도구 실행 전후에 커스텀 커맨드 실행.',
    '{\n' +
    '  "hooks": {\n' +
    '    "PostToolUse": [\n' +
    '      {\n' +
    '        "matcher": "Write",\n' +
    '        "hooks": [\n' +
    '          {\n' +
    '            "type": "command",\n' +
    '            "command": "prettier --write $CLAUDE_FILE_PATHS"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '필드: env와 cleanupPeriodDays',
    'env: 주입할 환경 변수. cleanupPeriodDays: 트랜스크립트 보관 일수.',
    '{\n' +
    '  "env": {\n' +
    '    "NODE_ENV": "development",\n' +
    '    "MY_API_URL": "https://api.example.com",\n' +
    '    "DISABLE_AUTO_COMPACT": "1"\n' +
    '  },\n' +
    '  "cleanupPeriodDays": 7\n' +
    '}\n\n' +
    '// cleanupPeriodDays 기본값: 30\n' +
    '// 0 → 세션 영속성 완전 비활성화'
  );

  addTextSlide(p, '필드: availableModels (Managed 전용)',
    '사용자가 선택 가능한 모델의 엔터프라이즈 허용 목록.\n\n' +
    '[허용 형식]\n' +
    '• 패밀리 별칭 — "opus" → 모든 Opus 버전\n' +
    '• 버전 프리픽스 — "claude-sonnet-4"\n' +
    '• 전체 ID — "claude-opus-4-5"\n\n' +
    '비용 정책이나 보안 정책을 강제.'
  );

  addCodeSlide(p, '필드: worktree',
    '--worktree 플래그 동작 설정.',
    '{\n' +
    '  "worktree": {\n' +
    '    "symlinkDirectories": [\n' +
    '      "node_modules",\n' +
    '      ".next/cache"\n' +
    '    ],\n' +
    '    "sparsePaths": [\n' +
    '      "packages/api",\n' +
    '      "packages/shared"\n' +
    '    ]\n' +
    '  }\n' +
    '}'
  );

  addCodeSlide(p, '필드: attribution',
    'Claude가 커밋과 PR 설명에 추가하는 텍스트 커스터마이징.',
    '{\n' +
    '  "attribution": {\n' +
    '    "commit": "Co-Authored-By: Claude <noreply@anthropic.com>",\n' +
    '    "pr": ""\n' +
    '  }\n' +
    '}\n\n' +
    '// 빈 문자열 → 어트리뷰션 제거'
  );

  addTableSlide(p, '기타 필드', [
    ['필드', '설명'],
    ['language', '응답/음성 언어 ("korean")'],
    ['alwaysThinkingEnabled', '확장 thinking 기본 활성'],
    ['effortLevel', 'low/medium/high thinking 예산'],
    ['autoMemoryEnabled', '자동 메모리 on/off'],
    ['respectGitignore', '.gitignore 존중 (기본 true)'],
    ['defaultShell', 'bash 또는 powershell'],
    ['apiKeyHelper', 'API 키 동적 검색 스크립트']
  ]);

  addCodeSlide(p, '사내 표준 프로젝트 설정 예시',
    '권장 기본값을 한 파일로.',
    '{\n' +
    '  "$schema": "https://schemas.anthropic.com/claude-code/settings.json",\n' +
    '  "permissions": {\n' +
    '    "defaultMode": "default",\n' +
    '    "allow": [\n' +
    '      "Read(*)", "Grep(*)", "Glob(*)",\n' +
    '      "Bash(git status)", "Bash(git diff *)",\n' +
    '      "Bash(npm test *)", "Bash(npm run lint *)"\n' +
    '    ],\n' +
    '    "deny": [\n' +
    '      "Bash(rm -rf *)", "Bash(sudo *)"\n' +
    '    ]\n' +
    '  },\n' +
    '  "env": {\n' +
    '    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"\n' +
    '  },\n' +
    '  "cleanupPeriodDays": 14,\n' +
    '  "language": "korean"\n' +
    '}'
  );

  addTableSlide(p, 'Managed 설정 배포', [
    ['플랫폼', '메커니즘'],
    ['macOS', '/Library/Preferences/ plist 또는 MDM'],
    ['Windows', 'HKLM\\Software\\Anthropic\\Claude Code 레지스트리'],
    ['파일 기반', '플랫폼별 managed 경로'],
    ['드롭인', 'managed-settings.d/ (알파벳 정렬 병합)']
  ]);

  addTableSlide(p, 'Managed 전용 잠금 설정', [
    ['설정', '효과'],
    ['allowManagedHooksOnly', 'Managed 훅만 실행'],
    ['allowManagedPermissionRulesOnly', 'Managed 권한 규칙만 존중'],
    ['allowManagedMcpServersOnly', 'Managed MCP 서버만 허용'],
    ['strictPluginOnlyCustomization', '특정 커스터마이징 플러그인 전용']
  ]);

  addCodeSlide(p, 'JSON 스키마 연결',
    '에디터 자동완성과 유효성 검사.',
    '{\n' +
    '  "$schema": "https://schemas.anthropic.com/claude-code/settings.json"\n' +
    '}\n\n' +
    '// 효과:\n' +
    '// - VS Code / IntelliJ 자동완성\n' +
    '// - 오타·잘못된 값 실시간 경고\n' +
    '// - 모든 사내 저장소 settings.json에 추가 권장'
  );

  addClosingSlide(p, 'Q&A / 실습', [
    '우리 팀 프로젝트의 .claude/settings.json 초안 작성',
    'Managed 설정으로 강제해야 할 사내 정책은?',
    '비용 제어를 위해 availableModels를 어디까지 제한할까?'
  ]);

  return logUrl(p);
}
