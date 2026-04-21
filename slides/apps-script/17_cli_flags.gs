/**
 * Ch.17 CLI 플래그 상세 — Google Slides 빌더
 */

function buildChapter17() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.17 CLI 플래그');

  addTitleSlide(p, 'Ch.17 CLI 플래그 상세',
    '모든 옵션 레퍼런스와 조합 예시',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '핵심 플래그 (-p, --output-format, --verbose)',
    '세션 계속 (-c, -r, --fork-session)',
    '모델·effort 플래그',
    '권한·보안 플래그',
    '컨텍스트·프롬프트 플래그',
    '출력 제어 플래그',
    'Worktree / 디버그 플래그',
    '실전 조합 5종'
  ]);

  addCodeSlide(p, '-p, --print',
    '비대화형 실행. 응답 출력 후 종료.',
    'claude -p "src/index.ts의 메인 함수를 설명해줘"\n' +
    'echo "이게 뭐야?" | claude -p\n\n' +
    '# ⚠️ --print 모드는 작업 공간 신뢰 다이얼로그 건너뜀\n' +
    '# → 신뢰하는 디렉토리에서만 사용'
  );

  addTableSlide(p, '--output-format (--print 필요)', [
    ['값', '설명'],
    ['text', '일반 텍스트 (기본)'],
    ['json', '완전한 결과 단일 JSON'],
    ['stream-json', '줄바꿈 구분 JSON 스트림']
  ]);

  addCodeSlide(p, '세션 계속: --continue / --resume',
    '대화 이어가기.',
    '# 현재 디렉토리 가장 최근 대화 재개\n' +
    'claude --continue\n' +
    'claude -c "이제 테스트 추가해줘"\n\n' +
    '# 세션 ID로 재개\n' +
    'claude --resume\n' +
    'claude --resume 550e8400-e29b-41d4-a716-446655440000\n' +
    'claude --resume "auth refactor"\n\n' +
    '# 재개된 대화에서 분기\n' +
    'claude --continue --fork-session'
  );

  addCodeSlide(p, '--model <모델>',
    '별칭 또는 전체 ID.',
    'claude --model sonnet\n' +
    'claude --model opus\n' +
    'claude --model claude-sonnet-4-6\n\n' +
    '# 별칭: sonnet, opus, haiku\n' +
    '# 전체 ID: claude-sonnet-4-6 등'
  );

  addTableSlide(p, '--effort 레벨', [
    ['레벨', '용도'],
    ['low', '빠른 응답, 간단 작업'],
    ['medium (기본)', '일반 작업'],
    ['high', '복잡한 설계·분석'],
    ['max', '최대 thinking']
  ]);

  addTableSlide(p, '--permission-mode', [
    ['모드', '동작'],
    ['default', '커맨드/편집 전 확인'],
    ['acceptEdits', '편집 자동, 셸 확인'],
    ['plan', '계획 제안 후 대기'],
    ['bypassPermissions', '프롬프트 없이 실행 — 샌드박스 전용']
  ]);

  addTextSlide(p, '--dangerously-skip-permissions',
    '--permission-mode bypassPermissions와 동일.\n\n' +
    '⚠️ 인터넷 접근 없는 샌드박스에서만 사용.\n\n' +
    '이 플래그는 Claude Code의 샌드박스 안전 검사를 통과한\n' +
    '환경(비-root, 인터넷 없음)에서만 작동.'
  );

  addCodeSlide(p, '도구 제어 플래그',
    '--allowed-tools, --disallowed-tools, --tools.',
    '# 사용 가능 도구\n' +
    'claude --allowed-tools "Bash(git:*) Edit Read"\n\n' +
    '# 사용 불가 도구\n' +
    'claude --disallowed-tools "Write Bash(rm *)"\n\n' +
    '# 정확한 도구 집합 지정\n' +
    'claude --tools "Read Grep"\n\n' +
    '# 모든 도구 비활성\n' +
    'claude --tools ""'
  );

  addCodeSlide(p, '컨텍스트 플래그',
    '디렉토리 추가와 시스템 프롬프트.',
    '# 접근 컨텍스트 추가\n' +
    'claude --add-dir /shared/libs --add-dir /shared/config\n\n' +
    '# 시스템 프롬프트 교체\n' +
    'claude --system-prompt "..."\n\n' +
    '# 시스템 프롬프트 추가 (권장)\n' +
    'claude --append-system-prompt "항상 TypeScript를 출력하세요."'
  );

  addCodeSlide(p, '출력 제어 플래그 (--print 필요)',
    '비용·반복 안전장치.',
    '# 에이전틱 턴 제한\n' +
    'claude -p "..." --max-turns 20\n\n' +
    '# 최대 지출\n' +
    'claude -p "..." --max-budget-usd 2.00\n\n' +
    '# 구조화된 출력 검증\n' +
    'claude -p "..." --json-schema \'{"type":"object"}\''
  );

  addCodeSlide(p, 'Worktree 플래그',
    '--worktree와 --tmux.',
    '# 세션에 새 git worktree\n' +
    'claude --worktree\n' +
    'claude --worktree feature-auth\n' +
    'claude --worktree "#142"    # PR 번호\n\n' +
    '# tmux 세션과 함께\n' +
    'claude --worktree feature-auth --tmux'
  );

  addCodeSlide(p, '디버그 플래그',
    '트러블슈팅에 유용.',
    'claude --debug\n' +
    'claude --debug "api,hooks"\n' +
    'claude --debug "!file,!1p"    # 제외\n\n' +
    '# 파일에 저장\n' +
    'claude --debug-file /tmp/claude-debug.log\n\n' +
    '# 최소 모드\n' +
    'claude --bare'
  );

  addCodeSlide(p, '실전 조합 1: JSON 비대화형',
    'CI에서 결과를 스크립트로 파싱.',
    'claude -p "모든 내보낸 타입 목록" \\\n' +
    '       --output-format json'
  );

  addCodeSlide(p, '실전 조합 2-3: CI 권한 우회 / 세션 이어가기',
    '자동화와 배치 실행.',
    '# CI 권한 우회 (샌드박스)\n' +
    'claude -p "전체 테스트 스위트 실행하고 실패 수정해줘" \\\n' +
    '       --dangerously-skip-permissions\n\n' +
    '# 세션 이어가기\n' +
    'claude --continue -p "이제 그것에 대한 테스트 작성해줘"'
  );

  addCodeSlide(p, '실전 조합 4-5: MCP 격리 / 시스템 프롬프트 확장',
    '사용자 개인 설정 무시, 규칙 추가.',
    '# 엄격한 MCP 격리\n' +
    'claude --mcp-config ./ci-mcp.json --strict-mcp-config \\\n' +
    '       -p "스키마 분석해줘"\n\n' +
    '# 시스템 프롬프트 확장\n' +
    'claude --append-system-prompt \\\n' +
    '       "항상 JavaScript가 아닌 TypeScript를 출력하세요."'
  );

  addCodeSlide(p, '사내 CI 템플릿',
    '방어적 기본값.',
    'claude -p "$PROMPT" \\\n' +
    '  --output-format json \\\n' +
    '  --max-turns 20 \\\n' +
    '  --max-budget-usd 2.00 \\\n' +
    '  --permission-mode acceptEdits \\\n' +
    '  --allowed-tools "Bash(npm test *) Bash(git diff *) Read(*) Grep(*)" \\\n' +
    '  --bare\n\n' +
    '# 방어:\n' +
    '# --max-turns → 무한 루프 차단\n' +
    '# --max-budget-usd → 비용 상한\n' +
    '# --allowed-tools → 위험 작업 차단'
  );

  addClosingSlide(p, 'Q&A', [
    '우리 팀 CI에 맞는 CLI 조합은?',
    '--append-system-prompt로 적용할 사내 공통 규칙?',
    '비용 통제를 위해 --max-budget-usd의 적정값은?'
  ]);

  return logUrl(p);
}
