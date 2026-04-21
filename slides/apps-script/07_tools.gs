/**
 * Ch.07 도구 목록 — Google Slides 빌더
 */

function buildChapter07() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.07 도구 목록');

  addTitleSlide(p, 'Ch.07 도구 목록',
    '내장 도구 전체 레퍼런스',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '파일 도구 4종 (Read, Edit, Write, Glob)',
    '셸 도구 (Bash) 복합 커맨드·백그라운드 실행',
    '검색 도구 2종 (Grep, LS)',
    '웹 도구 2종 (WebFetch, WebSearch)',
    '에이전트 도구 2종 (Task, TodoWrite)',
    'MCP 도구 네이밍 규칙',
    '노트북 도구 (NotebookEdit)',
    '도구 가용성 제어 방법'
  ]);

  addTextSlide(p, '파일 도구: Read',
    '로컬 파일시스템 파일 읽기.\n\n' +
    '[특성]\n' +
    '• 기본 최대 2,000줄\n' +
    '• offset, limit 지원 → 대용량 파일 타겟 읽기\n' +
    '• 출력 형식: cat -n처럼 줄 번호 포함\n' +
    '• 지원 타입:\n' +
    '  - 이미지 (PNG, JPG 등)\n' +
    '  - PDF (한 번에 최대 20페이지)\n' +
    '  - Jupyter 노트북 (.ipynb)\n\n' +
    '권한: 읽기 전용 → 항상 자동 승인.'
  );

  addTextSlide(p, '파일 도구: Edit',
    '정확한 문자열 교체.\n\n' +
    '[특성]\n' +
    '• Read 먼저 필수 — 같은 대화에서 읽지 않으면 실패\n' +
    '• old_string → new_string 교체\n' +
    '• old_string은 파일에서 유일해야 함\n' +
    '• replace_all: true → 파일 전체에서 이름 변경\n\n' +
    '실패 조건: old_string이 두 번 이상 나타나면 실패\n' +
    '(replace_all이 없을 때).'
  );

  addTextSlide(p, '파일 도구: Write',
    '새 파일 생성 또는 완전 덮어쓰기.\n\n' +
    '[특성]\n' +
    '• 기존 파일 수정 시에는 먼저 Read 필요\n' +
    '• 기존 파일 수정에는 Edit 선호\n' +
    '• Write는 전체 파일 내용을 매번 전송 → 작은 변경에 비효율\n' +
    '• 새 파일 또는 전체 재작성에 적합'
  );

  addTextSlide(p, '파일 도구: Glob',
    '파일 이름 패턴 검색.\n\n' +
    '[특성]\n' +
    '• 어떤 코드베이스 크기에서도 빠른 매칭\n' +
    '• 수정 시간 기준 정렬된 경로 반환\n' +
    '• 지원 패턴:\n' +
    '  - **/*.ts\n' +
    '  - src/**/*.test.js\n' +
    '  - **/CLAUDE.md\n\n' +
    '권한: 읽기 전용 → 항상 자동 승인.'
  );

  addTextSlide(p, '셸 도구: Bash',
    '대화 내 지속되는 셸 세션에서 커맨드 실행.\n\n' +
    '[주요 동작]\n' +
    '• 도구 호출 간 환경 변수·작업 디렉토리 유지\n' +
    '• timeout 파라미터 지원\n' +
    '• 복합 커맨드 (&&, ||, ;, |) → 서브커맨드 독립 검사\n' +
    '• 백그라운드 실행 → run_in_background: true\n' +
    '• 출력 제한 → 예산 초과 시 미리보기 + 파일 경로\n\n' +
    '팁: 콘텐츠 검색은 Bash(grep) 대신 전용 Grep 도구 사용.'
  );

  addTableSlide(p, '검색 도구: Grep 출력 모드', [
    ['모드', '반환'],
    ['files_with_matches (기본)', '파일 경로만'],
    ['content', '매칭 줄 + 컨텍스트'],
    ['count', '파일당 매칭 수']
  ]);

  addTextSlide(p, '검색 도구: Grep / LS',
    'Grep (ripgrep 기반):\n' +
    '• 전체 regex 구문\n' +
    '• 파일 타입 필터 (*.ts, **/*.py)\n' +
    '• multiline: true로 멀티라인 패턴\n' +
    '• 읽기 전용 → 항상 자동 승인\n\n' +
    'LS:\n' +
    '• 구조화된 형식으로 파일/서브디렉토리 반환\n' +
    '• 파일 읽기/편집 전에 구조 탐색\n' +
    '• 읽기 전용 → 항상 자동 승인\n\n' +
    '활용 패턴: LS → Glob → Grep → Read'
  );

  addTextSlide(p, '웹 도구: WebFetch / WebSearch',
    'WebFetch:\n' +
    '• URL에서 정보 가져오기\n' +
    '• HTML → 마크다운 변환 + 보조 모델로 답변 생성\n' +
    '• HTTP → 자동 HTTPS 업그레이드\n' +
    '• 15분 자가 정리 캐시\n' +
    '• default 모드에서 승인 요청\n\n' +
    'WebSearch:\n' +
    '• 웹 검색 결과를 마크다운 링크로 반환\n' +
    '• 훈련 컷오프 이후 정보 접근\n' +
    '• Sources: 섹션 자동 추가\n' +
    '• 현재 미국에서만 이용 가능'
  );

  addTextSlide(p, '에이전트 도구: Task (Agent)',
    '서브에이전트 생성.\n\n' +
    '[특성]\n' +
    '• 별도 컨텍스트에서 시작\n' +
    '• 자체 대화 기록\n' +
    '• (선택) 제한된 도구 집합\n' +
    '• 완료 후 결과를 부모에 반환\n\n' +
    '[실행 위치]\n' +
    '• 로컬 — 인프로세스, 파일시스템/셸 공유\n' +
    '• 원격 — 원격 에이전트 기준 충족 시\n\n' +
    '언제 사용: 개방형 검색, 병렬 워크스트림, 격리된 서브 문제.'
  );

  addTextSlide(p, '에이전트 도구: TodoWrite',
    '작업 목록 관리.\n\n' +
    '[특성]\n' +
    '• 상태: pending, in_progress, completed\n' +
    '• 터미널 UI 영구 패널에 표시\n' +
    '• Claude가 복잡한 다단계 작업의 진행을 추적\n\n' +
    '사용 기준: 3개 이상의 별개 단계가 있는 작업에 적극 사용.\n\n' +
    '사내 효과: 리팩터링, 마이그레이션, 릴리즈 작업에서\n' +
    '진행 가시성 확보.'
  );

  addCodeSlide(p, 'MCP 도구 네이밍',
    'MCP 서버가 노출하는 도구도 내장 도구와 함께 목록에 나타남.',
    '# 네이밍 규칙\n' +
    'mcp__<server-name>__<tool-name>\n\n' +
    '# 예\n' +
    'mcp__mydb__query\n' +
    'mcp__filesystem__read_file\n' +
    'mcp__github__create_pull_request\n\n' +
    '# 일반적 범주\n' +
    '# - DB 쿼리/관리\n' +
    '# - 브라우저·웹 자동화\n' +
    '# - 클라우드 API (AWS, GCP, Azure)\n' +
    '# - 이슈 트래커 (GitHub, Linear, Jira)'
  );

  addTableSlide(p, '도구 가용성 제어', [
    ['제어', '효과'],
    ['CLAUDE_CODE_SIMPLE=1', 'Bash, Read, Edit만 활성'],
    ['권한 차단 규칙', '포괄 차단 도구는 모델이 보기 전에 제거'],
    ['isEnabled() 검사', '환경 조건 따라 자가 비활성'],
    ['MCP 서버 연결 상태', '서버 실행 + 연결된 경우만'],
    ['/tools (REPL)', '활성 도구 집합 확인']
  ]);

  addTableSlide(p, '도구 선택 가이드', [
    ['작업', '선호 도구'],
    ['파일 위치 찾기', 'Glob'],
    ['내용 검색', 'Grep (not Bash grep)'],
    ['파일 구조 파악', 'LS → Glob'],
    ['읽기', 'Read (대용량은 offset/limit)'],
    ['기존 파일 수정', 'Edit (not Write)'],
    ['새 파일', 'Write'],
    ['다단계 진행', 'TodoWrite']
  ]);

  addBulletSlide(p, '사내 가이드라인 제안', [
    'Read/Grep/Glob/LS는 전역 allow → 탐색 쾌적',
    'Edit/Write는 프로젝트별 allow 또는 acceptEdits',
    'Bash는 세분화 패턴 allow (git, npm 등)',
    'WebFetch/WebSearch는 민감 데이터 주의',
    'MCP 도구는 서버별 allow/deny 관리',
    '노트북은 실험 데이터 커밋 전 검증'
  ]);

  addClosingSlide(p, 'Q&A', [
    '우리 팀이 가장 자주 사용할 도구는 무엇이고, 해당 도구의 allow 규칙은?',
    '사내 MCP 서버를 만든다면 어떤 도구를 노출할 것인가?',
    'Edit vs Write 구분이 코드 리뷰 품질에 미치는 영향은?'
  ]);

  return logUrl(p);
}
