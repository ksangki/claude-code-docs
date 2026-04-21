/**
 * Ch.15 스킬 — Google Slides 빌더
 */

function buildChapter15() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.15 스킬');

  addTitleSlide(p, 'Ch.15 스킬 (Skills)',
    '재사용 가능한 온디맨드 워크플로우',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '스킬 작동 방식과 지연 로딩',
    'SKILL.md 파일 구조',
    '프론트매터 전체 필드',
    '인수 대입 ($ARGUMENTS, 명명 인수)',
    '인라인 셸 커맨드',
    '네임스페이스 스킬',
    '경로 기반 조건부 스킬',
    '사용자 레벨 스킬',
    '실전 예시 + 훅 vs 스킬 비교'
  ]);

  addTextSlide(p, '스킬이란',
    '슬래시 커맨드로 호출하는 재사용 가능한 마크다운 기반 워크플로우.\n\n' +
    '사용: /skill-name [arguments]\n\n' +
    'Claude가 해당 스킬 SKILL.md를 액션의 프롬프트로 로드.\n\n' +
    '[용도]\n' +
    '• 배포 실행\n' +
    '• 변경 내역 작성\n' +
    '• PR 검토\n' +
    '• 팀 컨벤션 적용\n' +
    '• 세션 간 반복 작업'
  );

  addTextSlide(p, '핵심 특성: 지연 로딩',
    '스킬은 호출될 때만 읽힘.\n\n' +
    '수백 개의 스킬을 정의해도:\n' +
    '• 시작 시간에 영향 없음\n' +
    '• 컨텍스트 크기에 영향 없음\n\n' +
    '→ 팀/조직 전체에 스킬 라이브러리 유지 가능.'
  );

  addCodeSlide(p, '스킬 만들기 (1/3): 디렉토리',
    '위치별로 범위가 달라짐.',
    'mkdir -p .claude/skills/my-skill\n\n' +
    '# 위치\n' +
    '# 프로젝트: .claude/skills/ (CWD)\n' +
    '# 사용자: ~/.claude/skills/ (전역)'
  );

  addCodeSlide(p, '스킬 만들기 (2/3): SKILL.md',
    '릴리즈 프로세스 자동화 예시.',
    '---\n' +
    'description: 이 프로젝트의 전체 릴리즈 프로세스 실행\n' +
    'argument-hint: 버전 번호 (예: 1.2.3)\n' +
    '---\n\n' +
    '$ARGUMENTS 버전으로 프로젝트를 릴리즈합니다.\n\n' +
    '단계:\n' +
    '1. `package.json`의 버전을 $ARGUMENTS로 업데이트\n' +
    '2. CHANGELOG.md에 이 버전의 새 섹션 추가\n' +
    '3. `npm test` 실행 및 모든 테스트 통과 확인\n' +
    '4. "chore: release v$ARGUMENTS" 메시지로 커밋\n' +
    '5. `v$ARGUMENTS` git 태그 생성'
  );

  addTextSlide(p, '스킬 만들기 (3/3): 호출',
    '/my-skill 1.2.3\n\n' +
    '[동작]\n' +
    '• 스킬 로드\n' +
    '• 지시사항 실행\n' +
    '• 1.2.3이 $ARGUMENTS에 대입\n\n' +
    'Claude가 각 단계를 실제로 수행\n' +
    '(커밋, 태그 등은 권한 확인을 거침).'
  );

  addTableSlide(p, '프론트매터 필드 (1/2)', [
    ['필드', '설명'],
    ['description', '/skills에 표시, Claude가 언제 쓸지 판단'],
    ['argument-hint', '슬래시 커맨드 자동완성 힌트'],
    ['allowed-tools', '사용 가능 도구 목록 (기본 모두)'],
    ['when_to_use', 'Claude가 적극 사용할 조건'],
    ['model', '이 스킬용 모델']
  ]);

  addTableSlide(p, '프론트매터 필드 (2/2)', [
    ['필드', '설명'],
    ['user-invocable', 'false → 슬래시 커맨드 목록에서 숨김'],
    ['context', 'fork → 격리된 서브에이전트 컨텍스트'],
    ['paths', '일치 파일 터치 시에만 활성화 Glob'],
    ['version', '스킬 버전 문자열'],
    ['hooks', '이 스킬 실행에 범위 제한된 훅']
  ]);

  addCodeSlide(p, '인수 대입',
    '$ARGUMENTS 또는 명명된 인수.',
    '# $ARGUMENTS 사용\n' +
    '$ARGUMENTS라는 이름의 새 React 컴포넌트를\n' +
    '프로젝트 컨벤션에 따라 생성합니다.\n\n' +
    '# 호출\n' +
    '/new-component UserProfile\n\n' +
    '# 명명된 인수\n' +
    '---\n' +
    'arguments: [name, directory]\n' +
    '---\n\n' +
    '# 참조: $name, $directory'
  );

  addCodeSlide(p, '인라인 셸 커맨드',
    '스킬이 호출될 때 실행. ! 프리픽스 + 백틱.',
    '---\n' +
    'description: 최근 변경 사항 검토\n' +
    '---\n\n' +
    '컨텍스트를 위한 최근 커밋들:\n\n' +
    '!`git log --oneline -20`\n\n' +
    '위 변경 사항을 검토하고 무엇이 달성됐는지 요약해주세요.\n\n' +
    '# ⚠️ 셸과 동일 권한으로 실행\n' +
    '# → 스킬을 신뢰할 수 있을 때만'
  );

  addTextSlide(p, '스킬 목록 보기: /skills',
    '/skills\n\n' +
    '[표시]\n' +
    '• 모든 범위의 사용 가능한 스킬\n' +
    '• 각 스킬의 설명\n' +
    '• (프로젝트 / 사용자 / Managed)\n\n' +
    '사내 활용: 신규 입사자 온보딩 시\n' +
    '/skills로 팀 워크플로우 발견.'
  );

  addCodeSlide(p, '네임스페이스 스킬',
    '서브디렉토리는 콜론으로 네임스페이스.',
    '.claude/skills/\n' +
    '  deployment/\n' +
    '    SKILL.md      → /deployment\n' +
    '  database/\n' +
    '    migrate/\n' +
    '      SKILL.md    → /database:migrate\n' +
    '    seed/\n' +
    '      SKILL.md    → /database:seed\n\n' +
    '# 활용: 관련 스킬을 계층적으로 관리\n' +
    '# /database:migrate, /database:seed'
  );

  addCodeSlide(p, '경로 기반 조건부 스킬',
    'paths + when_to_use로 자동 컨텍스트 로딩.',
    '---\n' +
    'description: Django 모델 검토\n' +
    'paths: "**/*.py"\n' +
    'when_to_use: Django 모델 파일 편집 시 사용\n' +
    '---\n\n' +
    '# 동작\n' +
    '# - glob 패턴 일치 파일 Read/Write/Edit 시 자동 로드\n' +
    '# - 해당 파일 작업할 때만 Claude 컨텍스트에 들어감\n\n' +
    '# 효과: 규모가 커져도 컨텍스트 간결 유지'
  );

  addCodeSlide(p, '사용자 레벨 스킬',
    '모든 프로젝트에서 사용 가능한 전역 스킬.',
    'mkdir -p ~/.claude/skills/standup\n\n' +
    'cat > ~/.claude/skills/standup/SKILL.md << \'EOF\'\n' +
    '---\n' +
    'description: 스탠드업 업데이트를 위해 오늘 작업한 내용 요약\n' +
    '---\n\n' +
    '이 저장소에서 오늘의 git 커밋을 확인하고\n' +
    '스탠드업 형식으로 요약해주세요: 한 일, 다음에 할 일, 막히는 것.\n' +
    '3-4문장으로 유지해주세요.\n' +
    'EOF\n\n' +
    '# 어느 프로젝트에서든 /standup 사용 가능'
  );

  addCodeSlide(p, '실전: 컴포넌트 생성기',
    '컨벤션 강제 + 테스트 함께 생성.',
    '---\n' +
    'description: 테스트와 함께 새 React 컴포넌트 생성\n' +
    'argument-hint: ComponentName\n' +
    'allowed-tools: Write, Bash\n' +
    '---\n\n' +
    '$ARGUMENTS라는 이름의 새 React 컴포넌트를 만듭니다.\n\n' +
    '1. src/components/$ARGUMENTS/$ARGUMENTS.tsx 생성\n' +
    '   - TypeScript 함수형 컴포넌트\n' +
    '   - $ARGUMENTSProps 인터페이스\n' +
    '   - JSDoc 주석\n' +
    '   - default export\n\n' +
    '2. .test.tsx 생성 — 렌더링 테스트 + 스냅샷\n' +
    '3. index.ts 생성 (re-export)\n' +
    '4. npx tsc --noEmit으로 타입 확인'
  );

  addTwoColumnSlide(p, '훅 vs 스킬 비교',
    '스킬',
    [
      '명시적 /skill-name',
      '의도적 워크플로우',
      '.claude/skills/SKILL.md',
      '파일·셸 출력·지시사항'
    ],
    '훅',
    [
      '자동 도구 이벤트',
      '부작용·포맷·게이팅',
      '설정 JSON hooks',
      '이벤트 JSON + 종료 코드'
    ]
  );

  addBulletSlide(p, '사내 스킬 라이브러리 아이디어', [
    '/deploy <env> — 배포 실행',
    '/release <version> — 버전 릴리즈',
    '/review <pr-num> — PR 리뷰',
    '/migrate <name> — DB 마이그레이션',
    '/standup — 스탠드업 요약',
    '/postmortem <incident> — 포스트모템 초안',
    '/rfc <topic> — RFC 템플릿',
    '/onboard — 신규 입사자 가이드'
  ]);

  addBulletSlide(p, '보안 고려사항', [
    '인라인 셸 커맨드는 스킬을 신뢰할 때만',
    'allowed-tools 제한 → 불필요한 도구 접근 차단',
    '시크릿을 스킬 내 하드코딩 금지',
    '사용자 레벨 스킬은 개인 책임',
    '프로젝트 레벨 스킬은 PR 리뷰 대상 포함'
  ]);

  addClosingSlide(p, 'Q&A / 실습', [
    '우리 팀이 반복하는 3가지 워크플로우 → 스킬 후보',
    '스킬 네임스페이스 전략 (/infra:*, /db:*)',
    '사용자 레벨 vs 프로젝트 레벨 분배 기준'
  ]);

  return logUrl(p);
}
