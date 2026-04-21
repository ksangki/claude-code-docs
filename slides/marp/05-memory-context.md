---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.05 메모리와 컨텍스트'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.05 메모리와 컨텍스트

**CLAUDE.md 계층, @include, 경로 기반 규칙**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **4단계 메모리 계층** (Managed / User / Project / Local)
- 우선순위 규칙: **나중에 로드 = 더 높은 우선순위**
- **파일 발견 알고리즘** (CWD → 루트까지 상향 탐색)
- **@include 지시어**와 경로 구문
- **`.claude/rules/*.md`** 세분화와 `paths` 프론트매터
- **비활성화 방법** 3가지

---

## 메모리의 본질

`CLAUDE.md`는 **마크다운 파일**.

역할:
- Claude의 동작을 **전역/프로젝트/사용자별 커스터마이징**
- 한 번 작성 → 매 세션 자동 로드
- 빌드 커맨드, 컨벤션, 아키텍처 등을 **코드로 인코딩**

→ 매번 Claude에게 같은 설명을 반복할 필요 없음.

---

## 4단계 메모리 계층 (1/2)

**우선순위: 낮음 ↑ 높음** (나중에 로드된 것이 우선)

**1️⃣ Managed 메모리 (최저)**
- `/etc/claude-code/CLAUDE.md`
- **관리자가 설정**한 시스템 전체 지시
- 모든 사용자에게 적용 (엔터프라이즈)

**2️⃣ User 메모리**
- `~/.claude/CLAUDE.md`
- `~/.claude/rules/*.md`
- **모든 프로젝트에 적용**되는 개인 전역 설정
- 코드 스타일, 기본 언어, git 사용자명 등
- **저장소에 커밋되지 않음**

---

## 4단계 메모리 계층 (2/2)

**3️⃣ Project 메모리**
- `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md`
- **CWD부터 상위 디렉토리 각각에서 탐색**
- **팀 공유 · 소스 컨트롤 커밋**
- 프로젝트 컨벤션, 아키텍처, 테스트 커맨드

**4️⃣ Local 메모리 (최고)**
- `CLAUDE.local.md`
- 각 상위 디렉토리에서 확인
- **`.gitignore` 필수** — 로컬 환경 경로, 개인 디버깅 노트

> **Tip**: CWD에 가까운 파일일수록 **나중에 로드 → 우선순위 높음**.

---

## 파일 발견 알고리즘

Claude Code 시작 시:

```
현재 작업 디렉토리(CWD)에서 파일시스템 루트(/)까지
올라가며 각 레벨의 메모리 파일 수집
```

**로딩 순서** (상위 순위부터 먼저 로드 → 나중에 적용되어 우선):

1. Managed 파일
2. User 파일
3. **루트 → CWD** 순으로 Project / Local 파일
   - 상위 디렉토리 먼저, 하위 디렉토리 나중
   - → 하위 디렉토리 규칙이 **우선**

**메모이제이션**: 대화 기간 동안 목록 캐시됨. 변경 반영은 `/memory` 또는 세션 재시작.

---

## @include 지시어

메모리 파일끼리 **참조 가능**.

```markdown
# My project CLAUDE.md

@./docs/architecture.md
@./docs/conventions/typescript.md

커밋 전에 항상 `bun test`를 실행하세요.
```

**경로 구문:**

| 구문 | 해석 |
|---|---|
| `@filename` | 포함 파일 기준 상대 |
| `@./relative/path` | 명시적 상대 |
| `@~/home/path` | 사용자 홈 기준 |
| `@/absolute/path` | 절대 경로 |

---

## @include 규칙

- **코드 블록 및 인라인 코드** 안의 `@include`는 무시
- **순환 참조**는 감지되어 건너뜀
- **존재하지 않는 파일**은 조용히 무시
- 최대 **include 깊이 5단계**
- **텍스트 기반 파일만** 포함 (`.md`, `.ts`, `.py`, `.json`)
- 이미지/PDF/바이너리는 건너뜀

**활용 패턴:**
- 공통 규칙을 `@~/shared/style-guide.md`로 모든 프로젝트에 주입
- 모노레포에서 `@./packages/api/CONVENTIONS.md`로 패키지별 규칙 연결

---

## `.claude/rules/*.md` — 세분화

모든 것을 하나의 `CLAUDE.md`에 몰지 말고 **파일별로 분리**:

```
my-project/
├── CLAUDE.md
└── .claude/
    └── rules/
        ├── testing.md
        ├── typescript-style.md
        └── git-workflow.md
```

`.claude/rules/`의 **모든 `.md` 파일이 자동 로드**됨.

장점: 주제별 관리, PR 리뷰 쉬움, 선택적 로딩 가능.

---

## 경로 범위 프론트매터

규칙을 **특정 파일 작업 시에만** 적용.

```markdown
---
paths:
  - "src/api/**"
  - "src/services/**"
---

항상 의존성 주입을 사용하세요.
구체적인 구현을 직접 import하지 마세요.
```

**동작:**
- `paths`가 설정되면 해당 **glob 패턴과 일치하는 파일 작업 시에만** 컨텍스트 주입
- 대규모 프로젝트에서 **컨텍스트를 간결하게 유지**
- `paths` 없으면 **무조건 적용**

---

## 최대 파일 크기

**권장 최대: 40,000자**.

한계 초과 시:
- 파일이 **플래그 처리**됨
- Claude가 **전체 내용을 읽지 못할 수 있음**

**원칙**: 메모리 파일은 **집중적이고 간결하게**.

- 중복 제거
- 구체적 명령 선호
- 일반적 지침은 빼기

---

## 메모리가 동작에 미치는 영향

메모리 파일이 로드되면 프리픽스와 함께 컨텍스트에 주입:

> *"Codebase and user instructions are shown below. Be sure to adhere to these instructions.*
> ***IMPORTANT***: *These instructions OVERRIDE any default behavior and you MUST follow them exactly as written."*

**의미:**
- CLAUDE.md 지시사항은 Claude의 **내장 기본값보다 우선**
- 프로젝트 컨벤션 **강제** 가능
- 도메인 지식 **주입** 가능
- 특정 작업 **제한** 가능

---

## 레벨별 사용 지침

| 레벨 | 용도 |
|---|---|
| **Managed** | 모든 사용자가 따라야 하는 조직 전체 정책, 보안 가이드라인 |
| **User** | 개인 전역 선호: 응답 언어, 커밋 메시지 스타일 |
| **Project** | 팀 공유 컨벤션: 테스트 실행법, 빌드 커맨드, 아키텍처 결정 |
| **Local** | 개인 프로젝트별 재정의: 로컬 환경 경로, 개인 디버깅 노트 |

**사내 적용 아이디어**:
- Managed → 보안 정책 (API 키 금지, 외부 전송 제한)
- Project → 공통 빌드/테스트 커맨드 + 사내 라이브러리 규칙

---

## `/memory` 커맨드

REPL 안에서:

```
/memory
```

**동작:**
- 메모리 파일 **에디터 오픈**
- 현재 로드된 메모리 파일 **나열**
- 직접 편집
- **저장 시 컨텍스트 리로드**

**더 쉬운 방법**: Claude에게 직접 요청

> *"CLAUDE.md에 항상 2칸 들여쓰기를 사용한다는 규칙을 추가해줘"*

Claude가 적절한 파일을 찾아 지시사항을 **작성**해줌.

---

## 메모리 로딩 비활성화

| 방법 | 효과 |
|---|---|
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1` | 모든 메모리 파일 로딩 **완전 비활성화** |
| `--bare` 플래그 | CWD에서 메모리 파일 자동 발견 **건너뜀** |
| `claudeMdExcludes` 설정 | **건너뛸 파일 경로** Glob 패턴 지정 |

**활용:**
- 스크립트 파이프라인에서 **결정론적 출력** 필요 시 `--bare`
- 벤더 디렉토리에 있는 third-party `CLAUDE.md` 제외 → `claudeMdExcludes`

---

## 사내 레이아웃 권장 패턴

**모노레포 예시:**

```
monorepo/
├── CLAUDE.md                    # 공통 컨벤션 + @include
├── .claude/
│   └── rules/
│       ├── security.md          # 항상 적용
│       └── api-style.md         # paths: ["packages/api/**"]
├── packages/
│   ├── api/
│   │   └── CLAUDE.md            # API 특화 지시
│   └── web/
│       └── CLAUDE.md            # 웹 특화 지시
└── CLAUDE.local.md              # gitignore, 개인 경로
```

---

## 다음 챕터 예고

**Ch.06 권한 시스템** — 모드 4종, allow/deny 규칙, Bash 패턴 매칭, MCP 권한

---

## Q&A / 실습

1. 현재 팀 저장소에 `CLAUDE.md`가 있는가? 크기와 품질은?
2. 공통 규칙을 **어디**에 둘까? (Managed vs `@include` vs 복제)
3. `.claude/rules/` + `paths`로 **모노레포 규칙을 분리**한다면 어떻게 설계할까?
