---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.15 스킬'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.15 스킬 (Skills)

**재사용 가능한 온디맨드 워크플로우**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- 스킬 **작동 방식**과 지연 로딩
- `SKILL.md` 파일 구조
- **프론트매터** 전체 필드
- **인수 대입** (`$ARGUMENTS`, 명명 인수)
- **인라인 셸 커맨드**
- **네임스페이스** 스킬
- **경로 기반 조건부** 스킬
- **사용자 레벨** 스킬
- **실전 예시** (컴포넌트 생성기, 릴리즈)
- **훅 vs 스킬** 비교

---

## 스킬이란

> **슬래시 커맨드로 호출하는** 재사용 가능한 마크다운 기반 워크플로우.

사용:

```
/skill-name [arguments]
```

Claude가 해당 스킬 `SKILL.md`를 **액션의 프롬프트**로 로드.

**용도:**
- 배포 실행
- 변경 내역 작성
- PR 검토
- 팀 컨벤션 적용
- 세션 간 **반복 작업**

---

## 핵심 특성: 지연 로딩

스킬은 **호출될 때만 읽힘**.

→ 수백 개의 스킬을 정의해도:
- **시작 시간에 영향 없음**
- **컨텍스트 크기에 영향 없음**

→ 팀/조직 전체에 스킬 라이브러리를 유지할 수 있음.

---

## 스킬 만들기 (1/3): 디렉토리

```bash
mkdir -p .claude/skills/my-skill
```

**위치:**

| 범위 | 경로 |
|---|---|
| 프로젝트 | `.claude/skills/` (CWD) |
| 사용자 | `~/.claude/skills/` (전역) |

---

## 스킬 만들기 (2/3): SKILL.md

```markdown
---
description: 이 프로젝트의 전체 릴리즈 프로세스 실행
argument-hint: 버전 번호 (예: 1.2.3)
---

$ARGUMENTS 버전으로 프로젝트를 릴리즈합니다.

단계:
1. `package.json`의 버전을 $ARGUMENTS로 업데이트
2. CHANGELOG.md에 이 버전의 새 섹션 추가
3. `npm test` 실행 및 모든 테스트 통과 확인
4. "chore: release v$ARGUMENTS" 메시지로 커밋
5. `v$ARGUMENTS` git 태그 생성
```

---

## 스킬 만들기 (3/3): 호출

```
/my-skill 1.2.3
```

**동작:**
- 스킬 로드
- 지시사항 실행
- `1.2.3`이 `$ARGUMENTS`에 대입

→ Claude가 각 단계를 **실제로 수행** (커밋, 태그 등은 권한 확인을 거침).

---

## 프론트매터 필드 (1/2)

| 필드 | 설명 |
|---|---|
| `description` | `/skills`에 표시 · Claude가 언제 쓸지 판단 |
| `argument-hint` | 슬래시 커맨드 **자동완성** 힌트 |
| `allowed-tools` | 사용 가능 도구 목록 (기본 모두) |
| `when_to_use` | Claude가 **적극 사용**할 조건 |
| `model` | 이 스킬용 모델 (예: `claude-sonnet-4-6`) |

---

## 프론트매터 필드 (2/2)

| 필드 | 설명 |
|---|---|
| `user-invocable` | `false` → 슬래시 커맨드 목록에서 숨김 (Claude는 여전히 사용 가능) |
| `context` | `fork` → 격리된 서브에이전트 컨텍스트에서 실행 |
| `paths` | 일치 파일 터치 시에만 스킬 활성화 Glob |
| `version` | 스킬 버전 문자열 |
| `hooks` | 이 스킬 실행에 범위 제한된 훅 |

모든 필드 **선택사항**.

---

## 인수 대입

**`$ARGUMENTS`** — 슬래시 커맨드 뒤 전체 텍스트 삽입.

```markdown
$ARGUMENTS라는 이름의 새 React 컴포넌트를
프로젝트 컨벤션에 따라 생성합니다.
```

```
/new-component UserProfile
```

**명명된 인수**:

```yaml
---
arguments: [name, directory]
---
```

→ `$name`, `$directory`로 참조.

---

## 인라인 셸 커맨드

**스킬이 로드될 때가 아닌 호출될 때 실행.**

```markdown
---
description: 최근 변경 사항 검토
---

컨텍스트를 위한 최근 커밋들:

!`git log --oneline -20`

위 변경 사항을 검토하고 무엇이 달성됐는지 요약해주세요.
```

**`!` 프리픽스 + 백틱 감싸기** → 커맨드 실행, 결과로 교체.

⚠️ **셸과 동일 권한**으로 실행 → 스킬을 신뢰할 수 있을 때만.

---

## 스킬 목록 보기

```
/skills
```

**표시:**
- 모든 범위의 사용 가능한 스킬
- 각 스킬의 **설명**
- (프로젝트 / 사용자 / Managed)

**사내 활용**: 신규 입사자 온보딩 시 `/skills`로 팀 워크플로우 발견.

---

## 네임스페이스 스킬

서브디렉토리는 **콜론으로 네임스페이스**.

```
.claude/skills/
  deployment/
    SKILL.md      → /deployment
  database/
    migrate/
      SKILL.md    → /database:migrate
    seed/
      SKILL.md    → /database:seed
```

**활용**: 관련 스킬을 **계층적으로 관리** → `/database:migrate`, `/database:seed`.

---

## 경로 기반 조건부 스킬

`paths` + `when_to_use`로 **자동 컨텍스트 로딩**.

```yaml
---
description: Django 모델 검토
paths: "**/*.py"
when_to_use: Django 모델 파일 편집 시 사용
---
```

**동작:**
- glob 패턴 일치 파일 **Read/Write/Edit** 시 자동 로드
- 해당 파일 작업할 때만 Claude 컨텍스트에 들어감

**효과**: 규모가 커져도 컨텍스트 **간결 유지**.

---

## 사용자 레벨 스킬

`~/.claude/skills/` → **모든 프로젝트에서 사용 가능**.

```bash
mkdir -p ~/.claude/skills/standup
cat > ~/.claude/skills/standup/SKILL.md << 'EOF'
---
description: 스탠드업 업데이트를 위해 오늘 작업한 내용 요약
---

이 저장소에서 오늘의 git 커밋을 확인하고
스탠드업 형식으로 요약해주세요: 한 일, 다음에 할 일, 막히는 것.
3-4문장으로 유지해주세요.
EOF
```

→ 어느 프로젝트에서든 `/standup` 사용 가능.

---

## 실전 예시: 컴포넌트 생성기

```markdown
---
description: 테스트와 함께 새 React 컴포넌트 생성
argument-hint: ComponentName
allowed-tools: Write, Bash
---

$ARGUMENTS라는 이름의 새 React 컴포넌트를 만듭니다.

1. `src/components/$ARGUMENTS/$ARGUMENTS.tsx` 생성
   - TypeScript 함수형 컴포넌트
   - `$ARGUMENTSProps` 인터페이스
   - JSDoc 주석
   - default export

2. `src/components/$ARGUMENTS/$ARGUMENTS.test.tsx` 생성
   - React Testing Library 렌더링 테스트
   - 스냅샷 테스트

3. `src/components/$ARGUMENTS/index.ts` 생성 (re-export)

4. `npx tsc --noEmit`으로 타입 확인
```

```
/new-component Button
```

---

## 훅 vs 스킬 비교

| 특성 | **스킬** | **훅** |
|---|---|---|
| 호출 | **명시적** `/skill-name` 또는 Claude 자발 | **자동** 도구 이벤트 |
| 용도 | 의도적 워크플로우 | 부작용 · 포맷 · 게이팅 |
| 설정 | `.claude/skills/SKILL.md` | 설정 JSON `hooks` |
| 컨텍스트 | 파일 · 셸 출력 · 지시사항 포함 | 이벤트 JSON + 종료 코드 |

**규칙 (Ch.12 재확인):**
- 자동화 → 훅
- 의도적 트리거 → 스킬

---

## 사내 스킬 라이브러리 아이디어

- `/deploy <env>` — 배포 실행
- `/release <version>` — 버전 릴리즈
- `/review <pr-num>` — PR 리뷰
- `/migrate <name>` — DB 마이그레이션
- `/standup` — 스탠드업 요약
- `/postmortem <incident>` — 포스트모템 초안
- `/rfc <topic>` — RFC 템플릿
- `/onboard` — 신규 입사자 가이드

---

## 보안 고려사항

- **인라인 셸 커맨드**는 스킬을 **신뢰할 때만**
- `allowed-tools` 제한 → 불필요한 도구 접근 차단
- **시크릿을 스킬 내 하드코딩 금지**
- 사용자 레벨 스킬은 **개인 책임**
- 프로젝트 레벨 스킬은 **PR 리뷰 대상** 포함

---

## 다음 챕터 예고

**Ch.16 커맨드 개요** — CLI 플래그 vs 슬래시 커맨드, 키보드 단축키

---

## Q&A / 실습

1. 우리 팀이 반복하는 **3가지 워크플로우** → 스킬 후보
2. 스킬 **네임스페이스 전략** (예: `/infra:*`, `/db:*`)
3. 사용자 레벨 vs 프로젝트 레벨 **분배 기준**
