/**
 * Ch.09 환경 변수 레퍼런스 — Google Slides 빌더
 */

function buildChapter09() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.09 환경 변수');

  addTitleSlide(p, 'Ch.09 환경 변수 레퍼런스',
    '인증 · 경로 · 모델 · 동작 · 리소스 · 관찰 가능성',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '인증 관련 env 변수 전체',
    '설정 경로 재정의',
    '모델 선택 변수 3종',
    '동작 토글 10+종',
    '리소스 제한 튜닝',
    '원격 측정 · 관찰 가능성 설정',
    'Node.js 런타임 주의 사항',
    '클라우드 리전 재정의'
  ]);

  addTableSlide(p, '인증 관련 (1/2)', [
    ['변수', '설명'],
    ['ANTHROPIC_API_KEY', 'Anthropic 직접 인증 API 키. OAuth보다 우선'],
    ['ANTHROPIC_AUTH_TOKEN', '대안 인증 토큰'],
    ['ANTHROPIC_BASE_URL', 'API 기본 URL 재정의'],
    ['CLAUDE_CODE_API_BASE_URL', 'Claude Code 전용 URL (ANTHROPIC_BASE_URL보다 우선)'],
    ['ANTHROPIC_BEDROCK_BASE_URL', 'Bedrock 기본 URL'],
    ['ANTHROPIC_VERTEX_PROJECT_ID', 'Vertex AI GCP 프로젝트 ID']
  ]);

  addTableSlide(p, '인증 관련 (2/2)', [
    ['변수', '설명'],
    ['CLAUDE_CODE_USE_BEDROCK', '1/true → Bedrock 공급자로 사용'],
    ['CLAUDE_CODE_USE_FOUNDRY', '1/true → Anthropic Foundry 사용'],
    ['CLAUDE_CODE_OAUTH_TOKEN', 'OAuth 토큰 직접 사용 (자동화)']
  ]);

  addTextSlide(p, '인증 우선순위',
    '다음 중 먼저 찾은 것 사용:\n\n' +
    '1. ANTHROPIC_AUTH_TOKEN\n' +
    '2. CLAUDE_CODE_OAUTH_TOKEN\n' +
    '3. 파일 디스크립터 OAuth 토큰 (managed 배포)\n' +
    '4. apiKeyHelper\n' +
    '5. 저장된 OAuth 토큰 (Keychain/자격 파일)\n' +
    '6. ANTHROPIC_API_KEY'
  );

  addTableSlide(p, '설정 경로', [
    ['변수', '기본값', '설명'],
    ['CLAUDE_CONFIG_DIR', '~/.claude', '설정/트랜스크립트 디렉토리'],
    ['CLAUDE_CODE_MANAGED_SETTINGS_PATH', '-', 'Managed 설정 파일 경로']
  ]);

  addTableSlide(p, '모델 선택', [
    ['변수', '설명'],
    ['ANTHROPIC_MODEL', '기본 모델. --model 플래그에 의해 재정의'],
    ['CLAUDE_CODE_SUBAGENT_MODEL', '서브에이전트용 모델'],
    ['CLAUDE_CODE_AUTO_MODE_MODEL', '자동 모드용 모델']
  ]);

  addTableSlide(p, '동작 토글 (1/2)', [
    ['변수', '설명'],
    ['CLAUDE_CODE_REMOTE', '1 → 원격/컨테이너 모드'],
    ['CLAUDE_CODE_SIMPLE', '1 → bare 모드 (훅·LSP 등 건너뜀)'],
    ['DISABLE_AUTO_COMPACT', '1 → 자동 컴팩션 비활성'],
    ['CLAUDE_CODE_DISABLE_BACKGROUND_TASKS', '1 → 백그라운드 작업 비활성'],
    ['CLAUDE_CODE_DISABLE_THINKING', '1 → 확장 thinking 비활성']
  ]);

  addTableSlide(p, '동작 토글 (2/2)', [
    ['변수', '설명'],
    ['CLAUDE_CODE_DISABLE_AUTO_MEMORY', '1 → 자동 메모리 비활성'],
    ['CLAUDE_CODE_DISABLE_CLAUDE_MDS', '1 → CLAUDE.md 로딩 완전 비활성'],
    ['CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', '1 → 비필수 트래픽 억제'],
    ['CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR', '1 → Bash 후 프로젝트 루트 복귀']
  ]);

  addTableSlide(p, '리소스 제한', [
    ['변수', '설명'],
    ['CLAUDE_CODE_MAX_OUTPUT_TOKENS', 'API 응답당 최대 출력 토큰'],
    ['CLAUDE_CODE_MAX_CONTEXT_TOKENS', '최대 컨텍스트 윈도우'],
    ['BASH_MAX_OUTPUT_LENGTH', 'Bash 출력 최대 문자 수'],
    ['API_TIMEOUT_MS', 'API 타임아웃 (기본 300,000ms)']
  ]);

  addCodeSlide(p, '리소스 제한 예시',
    '성능·비용 최적화에 활용.',
    'export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096\n' +
    'export BASH_MAX_OUTPUT_LENGTH=50000\n' +
    'export API_TIMEOUT_MS=60000'
  );

  addTableSlide(p, '원격 측정 · 관찰 가능성', [
    ['변수', '설명'],
    ['CLAUDE_CODE_ENABLE_TELEMETRY', '1 → OpenTelemetry 내보내기 활성화'],
    ['CLAUDE_CODE_JSONL_TRANSCRIPT', '세션 JSONL 트랜스크립트 저장 경로']
  ]);

  addCodeSlide(p, 'Node.js 런타임 주의',
    'NODE_OPTIONS는 Claude Code가 --max-old-space-size 등을 감지하기 위해 읽음.',
    '# OK\n' +
    'export NODE_OPTIONS="--max-old-space-size=4096"\n\n' +
    '# 위험 — 금지\n' +
    'export NODE_OPTIONS="--require suspicious-module"\n\n' +
    '# 코드 실행 플래그 포함하는 값으로 설정하지 말 것'
  );

  addTableSlide(p, 'Vertex 클라우드 리전 재정의', [
    ['모델 프리픽스', '환경 변수'],
    ['claude-haiku-4-5', 'VERTEX_REGION_CLAUDE_HAIKU_4_5'],
    ['claude-3-5-sonnet', 'VERTEX_REGION_CLAUDE_3_5_SONNET'],
    ['claude-sonnet-4-6', 'VERTEX_REGION_CLAUDE_4_6_SONNET'],
    ['claude-opus-4', 'VERTEX_REGION_CLAUDE_4_0_OPUS']
  ]);

  addTextSlide(p, 'AWS 자격 증명',
    '표준 AWS 자격 증명 환경 변수 지원.\n\n' +
    '• AWS_REGION — Bedrock API 리전 (AWS_DEFAULT_REGION 폴백, 최종 us-east-1)\n' +
    '• AWS_DEFAULT_REGION — AWS_REGION 미설정 시 폴백\n\n' +
    '[자격 증명 소스]\n' +
    '• ~/.aws/credentials\n' +
    '• AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN\n' +
    '• IAM 역할 (EC2, ECS, EKS)\n' +
    '• AWS SSO (aws sso login)'
  );

  addCodeSlide(p, '모든 세션에 env 변수 설정',
    '셸 프로파일 대신 설정 파일의 env 필드 사용.',
    '{\n' +
    '  "env": {\n' +
    '    "DISABLE_AUTO_COMPACT": "1",\n' +
    '    "BASH_MAX_OUTPUT_LENGTH": "30000",\n' +
    '    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"\n' +
    '  }\n' +
    '}\n\n' +
    '// 장점:\n' +
    '// - 프로젝트별 별도 env 프로파일\n' +
    '// - 저장소에 커밋되어 팀 공유'
  );

  addCodeSlide(p, '실전 조합 예시',
    '시나리오별 env 변수 조합.',
    '# CI/자동화 파이프라인\n' +
    'export ANTHROPIC_API_KEY=sk-ant-...\n' +
    'export CLAUDE_CODE_REMOTE=1\n' +
    'export API_TIMEOUT_MS=120000\n' +
    'export CLAUDE_CODE_SIMPLE=1\n\n' +
    '# 사내 보안 환경\n' +
    'export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1\n' +
    'export CLAUDE_CODE_JSONL_TRANSCRIPT=/var/log/claude/session.jsonl\n\n' +
    '# 비용 제어\n' +
    'export CLAUDE_CODE_SUBAGENT_MODEL=claude-haiku-4-5\n' +
    'export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096'
  );

  addClosingSlide(p, 'Q&A', [
    '사내 CI 이미지에 어떤 env 변수를 사전 주입할까?',
    '비필수 트래픽 비활성화가 필요한 프로젝트가 있는가?',
    '비용 최적화 → 메인/서브에이전트 모델을 분리 운영?'
  ]);

  return logUrl(p);
}
