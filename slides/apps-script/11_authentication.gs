/**
 * Ch.11 인증 — Google Slides 빌더
 */

function buildChapter11() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.11 인증');

  addTitleSlide(p, 'Ch.11 인증',
    'OAuth · API Key · Bedrock · Vertex 설정과 운영',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    'claude.ai OAuth 기본 흐름',
    'API 키 두 가지 설정 방식 (env · apiKeyHelper)',
    'AWS Bedrock 통합',
    'GCP Vertex AI 통합',
    '계정 전환 (/login, /logout)',
    '토큰 만료와 자동 갱신',
    '인증 소스 우선순위'
  ]);

  addTableSlide(p, '인증 방식 개요', [
    ['방식', '사용 대상', '자동 갱신'],
    ['Claude.ai OAuth', '개인 개발자 · 대화형', 'Yes'],
    ['API 키', 'CI · 자동화 · 서버', '-'],
    ['AWS Bedrock', 'AWS 기반 엔터프라이즈', 'Yes'],
    ['GCP Vertex AI', 'GCP 기반 엔터프라이즈', 'Yes']
  ]);

  addTextSlide(p, 'Claude.ai OAuth (기본)',
    'API 키 없이 claude 실행 시 자동 개시.\n\n' +
    '[흐름]\n' +
    '1. 터미널에서 claude\n' +
    '2. URL 표시 → 브라우저로 열기\n' +
    '3. claude.ai 계정 로그인 + 권한 부여\n' +
    '4. Claude Code가 자동으로 토큰 수신\n' +
    '5. 안전 저장:\n' +
    '   - macOS → Keychain\n' +
    '   - 다른 플랫폼 → 자격 증명 파일\n\n' +
    '토큰 갱신: 만료 전 자동. 명시적 로그아웃 전까지 재인증 불필요.'
  );

  addCodeSlide(p, 'API 키: 환경 변수',
    '가장 간단한 자동화 방식.',
    'export ANTHROPIC_API_KEY=sk-ant-...\n\n' +
    '# 변수 설정 시 직접 사용 (OAuth 요청 안 함)\n' +
    '# CI, Docker, 서버에 적합\n\n' +
    '# 사내 운영:\n' +
    '# Secret Manager (AWS Secrets Manager, GCP Secret Manager)\n' +
    '# 에서 주입\n\n' +
    '# ⚠️ ANTHROPIC_API_KEY 설정 시 OAuth 흐름 비활성화'
  );

  addCodeSlide(p, 'API 키: apiKeyHelper',
    '자격 증명을 동적으로 가져오는 스크립트 지정.',
    '{\n' +
    '  "apiKeyHelper": "cat ~/.anthropic/api-key"\n' +
    '}\n\n' +
    '// 동작:\n' +
    '// - Claude Code가 이 커맨드 실행\n' +
    '// - stdout에 API 키만 출력, 코드 0 종료\n' +
    '// - 결과는 5분 캐시 (CLAUDE_CODE_API_KEY_HELPER_TTL_MS로 조정)\n\n' +
    '// 활용:\n' +
    '// - 사내 시크릿 볼트에서 동적 조회\n' +
    '// - IAM 역할 assume → 임시 토큰 발급'
  );

  addCodeSlide(p, 'AWS Bedrock 설정',
    '표준 AWS 자격 증명 체인 사용.',
    '# 1. Bedrock 모드 활성화\n' +
    'export CLAUDE_CODE_USE_BEDROCK=1\n\n' +
    '# 2. AWS 자격 증명 (다음 중 하나)\n' +
    '#   - ~/.aws/credentials\n' +
    '#   - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY\n' +
    '#   - IAM 역할 (EC2, ECS, EKS)\n' +
    '#   - aws sso login\n\n' +
    '# 3. 리전 (선택)\n' +
    'export AWS_REGION=us-east-1'
  );

  addCodeSlide(p, 'AWS 자격 증명 자동 갱신',
    '단기 SSO 토큰 만료 대응.',
    '{\n' +
    '  "awsAuthRefresh": "aws sso login --profile my-profile"\n' +
    '}\n\n' +
    '// 커맨드에서 자격 내보내기\n' +
    '{\n' +
    '  "awsCredentialExport": "aws sts assume-role --role-arn arn:aws:iam::123456789012:role/MyRole --role-session-name claude-code --query Credentials --output json"\n' +
    '}\n\n' +
    '// 장시간 작업 세션 중에도 중단 없이 갱신'
  );

  addCodeSlide(p, 'GCP Vertex AI 설정',
    '표준 GCP 자격 증명 체인 사용.',
    '# 1. Vertex 모드 활성화\n' +
    'export CLAUDE_CODE_USE_VERTEX=1\n\n' +
    '# 2. GCP 자격 증명\n' +
    '#   - gcloud auth application-default login\n' +
    '#   - GOOGLE_APPLICATION_CREDENTIALS\n' +
    '#   - 워크로드 아이덴티티 (GKE)\n\n' +
    '# 3. 프로젝트 · 리전 (선택)\n' +
    'export ANTHROPIC_VERTEX_PROJECT_ID=my-gcp-project\n' +
    'export CLOUD_ML_REGION=us-central1\n\n' +
    '# 자동 갱신\n' +
    '# { "gcpAuthRefresh": "gcloud auth application-default login" }'
  );

  addTextSlide(p, '계정 전환',
    '다른 계정으로 로그인:\n' +
    '/login\n' +
    '- 새 OAuth 흐름 시작\n' +
    '- 저장된 토큰이 새 계정 토큰으로 교체\n\n' +
    '로그아웃:\n' +
    '/logout\n' +
    '- 저장된 자격 증명 제거\n' +
    '- 다음 실행 시 재인증 요청\n\n' +
    '활용: 개인/팀 계정 전환, 공용 머신 사용 후 정리.'
  );

  addTextSlide(p, '토큰 만료와 갱신 메커니즘',
    'Claude Code가 조용히 처리:\n\n' +
    '• 각 API 요청 전에 액세스 토큰 만료 확인\n' +
    '• 만료 시 저장된 갱신 토큰으로 잠금 획득 → 갱신\n' +
    '• 여러 동시 Claude Code 인스턴스는 잠금 파일로 중복 갱신 방지\n' +
    '• API에서 401 응답 → 즉시 강제 갱신\n\n' +
    '사용자는 갱신을 의식할 필요 없음.'
  );

  addTextSlide(p, '인증 우선순위',
    '여러 소스 설정 시 이 순서로 해석:\n\n' +
    '1. ANTHROPIC_AUTH_TOKEN env\n' +
    '2. CLAUDE_CODE_OAUTH_TOKEN env\n' +
    '3. 파일 디스크립터의 OAuth 토큰 (관리형 배포용)\n' +
    '4. 설정의 apiKeyHelper\n' +
    '5. 저장된 claude.ai OAuth 토큰 (Keychain/자격 파일)\n' +
    '6. ANTHROPIC_API_KEY env\n\n' +
    '[CI/비대화형]\n' +
    'ANTHROPIC_API_KEY 또는 CLAUDE_CODE_OAUTH_TOKEN 사용.\n' +
    '대화형 흐름보다 먼저 확인됨.'
  );

  addTableSlide(p, '사내 인증 패턴 권장', [
    ['시나리오', '권장'],
    ['개발자 로컬', 'OAuth (자동 갱신)'],
    ['CI/CD', 'API Key via Secret'],
    ['사내 서버 (AWS)', 'Bedrock + IAM 역할'],
    ['사내 서버 (GCP)', 'Vertex + 워크로드 아이덴티티'],
    ['단기 자동화', 'apiKeyHelper + STS assume'],
    ['공용 머신', '세션 끝마다 /logout']
  ]);

  addBulletSlide(p, '보안 체크리스트', [
    'API 키는 절대 저장소·CLAUDE.md에 기록하지 않음',
    'CI에서는 Secret Manager 또는 환경 변수 주입',
    'IAM 역할 사용 시 최소 권한 원칙',
    '공용 머신은 세션 후 /logout',
    'Managed 설정에서 인증 방식 강제',
    '감사 로그 → CLAUDE_CODE_JSONL_TRANSCRIPT + 중앙 수집',
    '토큰 갱신 실패 모니터링 알림'
  ]);

  addClosingSlide(p, 'Q&A / 실습', [
    '우리 조직은 OAuth vs API Key 중 무엇을 표준으로?',
    'Bedrock/Vertex 사용 시 리전 정책은?',
    'apiKeyHelper로 사내 볼트에 연결한다면 스크립트 설계는?'
  ]);

  return logUrl(p);
}
