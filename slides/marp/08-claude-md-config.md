---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.08 CLAUDE.md 설정'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.08 CLAUDE.md 설정

**실무자를 위한 메모리 파일 작성법**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- `CLAUDE.md`에 **포함할 것 / 제외할 것**
- **파일 위치**와 우선순위 재확인
- `@include` **경로 구문** 완전 가이드
- **프론트매터 경로 타겟팅** 사용 예
- **TypeScript 프로젝트 실전 예시**
- `/init`으로 **자동 생성**하기
- `/memory`로 **편집 반영**
- **파일 제외** (`claudeMdExcludes`)

---

## CLAUDE.md의 목적

> 세션마다 자동 로드되는 **지속적 프로젝트 지식**.

**왜 필요한가:**
- 매번 프로젝트 컨벤션·빌드 시스템 설명 반복 불필요
- 팀 공유 지식을 **코드로 버전 관리**
- Claude의 실수 감소 → 리뷰 부담 감소

**핵심 원칙**: 빠진 경우 **실수를 일으킬 지시사항**만.

---

## 포함할 것

✅ **빌드, 테스트, lint 커맨드** — 도구 이름만이 아닌 **정확한 호출**
- 예: `bun test` (x) → `bun test --run packages/api` (o)

✅ **아키텍처 결정** — 코드 작성/구성에 영향
- 레이어 규칙, 금지된 직접 접근

✅ **프로젝트 고유 코딩 컨벤션** — 네이밍·파일 구조 규칙

✅ **환경 설정 요구사항** — env 변수, 실행 중인 서비스

✅ **일반적 함정 / 패턴** — Claude가 놓치기 쉬운 제약

✅ **모노레포 구조 · 패키지별 책임**

---

## 제외할 것

❌ **Claude가 이미 아는 것**
- 표준 TypeScript 구문, 일반 라이브러리 API

❌ **자명한 알림**
- "깔끔한 코드를 작성하세요"
- "주석을 추가하세요"

❌ **민감 데이터**
- API 키, 비밀번호, 토큰, 시크릿 **일체 금지**

❌ **자주 변경되어 오래될 정보**
- 진행 중인 티켓 번호, 임시 디버깅 노트

---

## 테스트

**한 줄 한 줄이 이 테스트를 통과해야 함:**

> *"이 줄을 제거하면 Claude가 이 코드베이스에서 **실수를 할까?**"*

**No** → 즉시 삭제.

- 노이즈는 신호를 덮는다
- 매 세션 컨텍스트 비용
- 40,000자 한계 소모

---

## 파일 위치 (재확인)

| 파일 | 타입 | 용도 |
|---|---|---|
| `/etc/claude-code/CLAUDE.md` | Managed | 관리자 시스템 전체 |
| `~/.claude/CLAUDE.md` | User | 모든 프로젝트 개인 전역 |
| `~/.claude/rules/*.md` | User | 모듈식 전역 규칙 |
| `CLAUDE.md` (루트) | Project | 팀 공유, 커밋 |
| `.claude/CLAUDE.md` (루트) | Project | 대안 위치 |
| `.claude/rules/*.md` (루트) | Project | 모듈식 프로젝트 규칙 |
| `CLAUDE.local.md` (루트) | Local | 개인, gitignore |

---

## 로딩 순서 (요약)

```
Managed  (lowest)
   ↓
User  (~/.claude/…)
   ↓
Project  (루트 → CWD 순회, 하위 디렉토리가 우선)
   ↓
Local  (CLAUDE.local.md, 동일 순회)   (highest)
```

→ **나중에 로드 = 높은 우선순위**.
CWD에 가까운 파일일수록 영향력이 큼.

---

## @include 지시어

다른 파일을 **포함 파일 이전에 컨텍스트 삽입**.

```markdown
# CLAUDE.md

@./docs/architecture.md
@~/shared/style-guide.md
@/etc/company-standards.md
```

**구문 정리:**

| 구문 | 해석 |
|---|---|
| `@filename` | 현재 파일 기준 상대 |
| `@./relative/path` | 명시적 상대 |
| `@~/path/in/home` | 홈 디렉토리 기준 |
| `@/absolute/path` | 절대 경로 |

---

## @include 동작 규칙

- **비존재 파일** → 조용히 무시
- **순환 참조** → 감지·방지
- **최대 5단계** 깊이
- **텍스트 파일만** 지원 (이진 파일 건너뜀)
- **코드 블록 안의 `@include`는 무시**됨

**활용 패턴:**
- 사내 공통 규칙 파일 → `@~/company/common.md`
- 모노레포 패키지별 규칙 → `@./packages/*/CONVENTIONS.md`
- 보안/규정 문서 → `@/etc/claude-code/security.md`

---

## 프론트매터 경로 타겟팅

`.claude/rules/`의 파일은 **특정 경로에만 적용 가능**.

```markdown
---
paths:
  - "src/api/**"
  - "*.graphql"
---

# API 컨벤션

모든 API 핸들러는 공유 `validate()` 헬퍼로 입력을 검증해야 합니다.
GraphQL 리졸버는 직접 데이터베이스 쿼리를 수행하면 안 됩니다
— 데이터 레이어를 사용하세요.
```

- `paths` **없음** → 무조건 적용
- `paths` **있음** → glob 매칭 시에만 적용

---

## 실전 예시: TypeScript 프로젝트 (1/2)

```markdown
# Project: Payments API

## 빌드 및 테스트

- 빌드: `bun run build`
- 테스트: `bun test` (Bun 내장 테스트 — Jest 사용 금지)
- Lint: `bun run lint` (biome)
- 타입 체크: `bun run typecheck`

변경 사항 완료 전에 항상 `bun run typecheck` 실행.

## 아키텍처

- `src/handlers/` — HTTP 핸들러
- `src/services/` — 비즈니스 로직, 직접 DB 접근 금지
- `src/db/` — DB 레이어 (Drizzle ORM)
- `src/schemas/` — Zod 스키마

레이어 건너뛰기 금지.
```

---

## 실전 예시: TypeScript 프로젝트 (2/2)

```markdown
## 컨벤션

- 모든 검증 스키마에 `z.object().strict()` 사용
- 에러는 `Result<T, AppError>`로 전파 — throw 금지
- 금액은 **센트 단위 정수**
- 타임스탬프는 **Unix 초 (number)**, Date 객체 아님

## 환경

필요한 env: `DATABASE_URL`, `STRIPE_SECRET_KEY`, `JWT_SECRET`
로컬 개발: `.env.example` → `.env.local`

## 피해야 할 실수

- `new Date()` 직접 사용 금지 — `utils/time.ts::getCurrentTimestamp()`
- `console.log` 금지 — `utils/logger.ts::logger`
- Raw SQL 금지 — Drizzle 쿼리 빌더
```

---

## /init으로 자동 생성

세션에서:

```
/init
```

**자동 수행:**
- 매니페스트, CI 설정, 빌드 스크립트, README 조사
- 빈 부분은 **인터뷰로 채움**
- 출력 파일 작성 (+ 선택적 스킬/훅)

**결과물:**
- 프로젝트 `CLAUDE.md`
- (선택) `CLAUDE.local.md`
- (선택) 스킬, 훅

> **필수**: 생성 결과를 **검토·편집 후 커밋**. 그대로 두지 말 것.

---

## /memory로 편집

```
/memory
```

**동작:**
- 대화형 에디터 오픈
- 모든 로드된 메모리 파일 **나열**
- **세션 내에서 직접 편집**
- 저장 시 **즉시 리로드** → 현재 세션 반영

**더 쉬운 방법**: 자연어로 요청

> *"CLAUDE.md에 커밋 전 항상 `bun typecheck`를 실행한다는 규칙을 추가해줘"*

---

## 파일 제외: `claudeMdExcludes`

벤더 디렉토리나 생성된 코드의 `CLAUDE.md`를 **건너뛰기**:

```json
{
  "claudeMdExcludes": [
    "/absolute/path/to/vendor/CLAUDE.md",
    "**/generated/**",
    "**/third-party/.claude/rules/**"
  ]
}
```

- **picomatch** 절대 경로 매칭
- User / Project / Local 만 제외 가능
- **Managed는 항상 로드** (정책 보호)

---

## 사내 템플릿 제안

**팀 공통 시작점:**

```markdown
# <Project Name>

## 빌드
- 설치: <cmd>
- 빌드: <cmd>
- 테스트: <cmd>
- 타입체크: <cmd>

## 아키텍처
<3-5줄 요약 + 레이어 규칙>

## 컨벤션
- 네이밍:
- 에러 처리:
- 비동기 패턴:

## 환경
필요한 env:
로컬 실행:

## 피해야 할 실수
- ...
```

---

## 안티패턴

| 패턴 | 문제 |
|---|---|
| 긴 일반론 | 노이즈 → Claude가 중요한 지시 놓침 |
| 시크릿 포함 | 보안 사고 · 저장소 유출 위험 |
| 버전·티켓 하드코딩 | 금방 오래됨 |
| Claude가 이미 아는 내용 | 토큰 낭비 |
| 40,000자 초과 | 전체를 못 읽을 수 있음 |
| `/init` 생성물 그대로 커밋 | 잘못된 가정 포함 가능 |

---

## 다음 챕터 예고

**Ch.09 환경 변수** — 인증·경로·모델·동작·리소스·관찰 가능성 전체 레퍼런스

---

## Q&A / 실습

1. 우리 팀 저장소에서 `/init` 실행 후 **결과 리뷰**
2. **시크릿** 관련 규칙을 어느 레벨에 둘까?
3. 공통 규칙 공유를 `@include`로 할지 복제로 할지 결정
