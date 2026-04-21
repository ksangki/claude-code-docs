---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.18 슬래시 커맨드'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.18 슬래시 커맨드

**세션 내 전체 커맨드 레퍼런스**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- 내장 슬래시 커맨드 **17종**
- **프로젝트·메모리** 커맨드 (`/init`, `/memory`)
- **설정** 커맨드 (`/config`, `/hooks`, `/mcp`, `/permissions`, `/model`)
- **세션 관리** (`/plan`, `/compact`, `/clear`, `/skills`)
- **Git** (`/commit`, `/review`)
- **계정/도움말** (`/help`, `/login`, `/logout`)
- **커스텀 스킬** 커맨드

---

## 빠른 참조 (1/2)

| 커맨드 | 설명 |
|---|---|
| `/init` | `CLAUDE.md` + 선택적 스킬/훅 생성 |
| `/memory` | 메모리 파일 편집 |
| `/config` | 설정 패널 |
| `/hooks` | 훅 설정 보기 |
| `/mcp` | MCP 서버 관리 |
| `/permissions` | 권한 규칙 관리 |
| `/plan` | plan 모드 / 계획 관리 |
| `/model` | AI 모델 설정 |

---

## 빠른 참조 (2/2)

| 커맨드 | 설명 |
|---|---|
| `/commit` | AI 생성 메시지 커밋 |
| `/review` | PR 리뷰 |
| `/skills` | 사용 가능 스킬 목록 |
| `/compact` | 대화 기록 요약 |
| `/clear` | 대화 기록 지우기 |
| `/help` | 도움말 |
| `/login` | 로그인/전환 |
| `/logout` | 로그아웃 |

---

## `/init`

**코드베이스 분석 → `CLAUDE.md` + 선택적 스킬/훅 설정.**

**분석 대상:**
- 매니페스트 파일 (`package.json`, `Cargo.toml` 등)
- CI 설정
- 빌드 스크립트
- README

**인터뷰를 통해 빠진 내용 채움.**

**출력 선택지:**
- 프로젝트 `CLAUDE.md`
- 개인 `CLAUDE.local.md` (gitignore)
- 스킬 (`.claude/skills/`)
- 훅 (설정 JSON)

> 언제든 다시 실행 → 기존 파일 덮어쓰기 대신 **구체적 변경 제안**.

---

## `/memory`

**메모리 파일 대화형 에디터.**

**3가지 범위:**

| 범위 | 파일 | 적용 |
|---|---|---|
| 전역 | `~/.claude/CLAUDE.md` | 모든 프로젝트의 나 |
| 프로젝트 | 루트 `CLAUDE.md` | 팀 전체 |
| 로컬 | 루트 `CLAUDE.local.md` | 이 프로젝트의 나 |

**저장 시 즉시 리로드** → 현재 세션 반영.

---

## `/config` (별칭 `/settings`)

**설정 패널 열기.**

- 각 범위 **활성 설정** 확인
- JSON 파일 **직접 편집** 가능
- 파일 변경 감지 → **자동 리로드**

**활용**: 권한 규칙, 훅, env 변수 중앙 관리.

---

## `/hooks`

**활성화된 훅 설정 표시.**

훅을 만들거나 편집하려면:
- `/init` 실행
- 또는 `.claude/settings.json` **직접 편집**

→ 슬래시 커맨드만으로는 훅 편집 불가. 설정 파일로 관리.

---

## `/mcp`

**MCP 서버 관리** (Ch.13 상세).

| 인수 | 효과 |
|---|---|
| (없음) | MCP 관리 패널 |
| `enable` | 모든 비활성 서버 활성화 |
| `enable <server>` | 특정 서버 활성화 |
| `disable` | 모든 활성 서버 비활성화 |
| `disable <server>` | 특정 서버 비활성화 |
| `reconnect <server>` | 재연결 |

> **주의**: `/mcp enable/disable` 변경은 **현재 세션만**.

---

## `/permissions` (별칭 `/allowed-tools`)

**권한 패널 열기** — 허용/차단 규칙 관리.

**활용:**
- 세션 중 특정 커맨드 허용
- 위험 커맨드 즉시 차단
- 규칙을 **세션 → 설정 파일로 영구화**

→ 모드 변경은 `/permissions` 내에서.

---

## `/plan [open | <설명>]`

| 인수 | 효과 |
|---|---|
| (없음) | plan 모드 **토글** |
| `open` | 현재 계획 **열기** |
| `<설명>` | 주어진 설명으로 **새 계획** |

**plan 모드 동작**: 어떤 작업도 실행 전에 **작성된 계획 제시** → 승인 대기.

**활용**: 큰 변경·리팩터링 전 설계 검토.

---

## `/model [모델]`

세션 AI 모델 설정.

```
/model
/model sonnet
/model claude-opus-4-5
```

**활용**:
- 시작은 Haiku로 빠르게
- 복잡 작업에서 Opus로 전환
- 비용 최적화 흐름

---

## `/compact [지시사항]`

**대화 기록 요약** → 컨텍스트 윈도우 관리.

```
/compact
/compact 데이터베이스 스키마 변경에만 집중해줘
/compact 완료된 최근 세 작업만 요약해줘
```

**차이**:
- `/compact` → **요약**
- `/clear` → **완전 삭제**

**습관화**: 작업 단위 끝에 `/compact` 실행 → 다음 작업에 깨끗한 컨텍스트.

---

## `/clear` (별칭 `/reset`, `/new`)

**전체 대화 기록 지우기** + 컨텍스트 해제.

- 같은 작업 디렉토리에서 **새 세션**
- `/compact`와 달리 **모든 기록 제거**
- 트랜스크립트 파일 자체는 **보존** (재개는 가능)

**활용**: 완전히 다른 주제로 전환할 때.

---

## `/skills`

**사용 가능한 스킬 나열.**

- 내장 + 사용자 + 프로젝트 + Managed 범위 **전부**
- 각 스킬의 **설명** 표시
- `user-invocable: false` 스킬은 숨김

**활용**: 신규 입사자 온보딩, 팀 워크플로우 발견.

---

## `/commit`

**AI 생성 메시지 git 커밋.**

**동작:**
- 현재 git 상태와 diff **읽기**
- 스테이징된 변경 **분석**
- **"무엇"보다 "왜"에 초점**인 메시지 작성

**안전 규칙:**
- 기존 커밋 **amend 안 함**
- 훅 건너뛰기 안 함 (`--no-verify` 사용 안 함)
- **시크릿 포함 가능 파일** 커밋 안 함
- 변경 없으면 **빈 커밋 안 만듦**

→ `git add`, `git status`, `git commit` **접근만 가능**. push/rebase 등 불가.

---

## `/review [PR-번호]`

**GitHub CLI(`gh`)로 PR에 AI 코드 리뷰 실행.**

PR 번호 없이 → **열린 PR 목록**.

**리뷰 내용:**
- PR 개요
- 코드 품질·스타일 분석
- 구체적 개선 제안
- 잠재적 문제/리스크
- 성능·테스트 커버리지·보안 고려

> [GitHub CLI](https://cli.github.com/) (`gh`) **설치 + 인증** 필요.

---

## `/help` · `/login` · `/logout`

**`/help`**
현재 세션의 모든 커맨드 — 내장 + 스킬 + 플러그인.

**`/login`**
Anthropic 계정 로그인 / 계정 전환.
새 OAuth 흐름.

**`/logout`**
계정 로그아웃.
다음 세션에서 재인증 요청.

---

## 커스텀 스킬 커맨드

`.claude/skills/<name>/SKILL.md` 생성 시 **자동으로** `/<name>`으로 사용 가능.

```
/verify
/deploy staging
/fix-issue 123
```

**확인 방법**: `/skills` 실행 → 로드된 스킬 목록.

→ 팀의 반복 작업을 **명명된 커맨드**로 전환.

---

## 자주 쓰는 조합 패턴

**작업 시작:**
```
/init           # 저장소에 CLAUDE.md 없으면
/model sonnet
/plan           # 큰 작업이면
```

**작업 중간 정리:**
```
/compact 지금까지 정리
```

**마무리:**
```
/commit
/exit
```

---

## 일반적 실수

| 실수 | 대안 |
|---|---|
| `/clear`로 실수로 세션 전체 초기화 | 먼저 `/compact` 시도 |
| `/mcp enable`을 영구 설정으로 착각 | 세션만 적용 → 설정 파일 편집 |
| `/commit`이 push까지 할 거라 기대 | push는 별도 |
| `/review`인데 `gh` 미설치 | `gh` 설치 + `gh auth login` |
| `/model` 변경 후 비용 급증 | 확인 습관 + `--max-budget-usd` |

---

## 다음 챕터 예고

**Ch.19 훅 레퍼런스** — 모든 이벤트·입력·출력·종료 코드 전체 레퍼런스

---

## Q&A

- 우리 팀에 **가장 유용할 커맨드 3개**는?
- `/commit`을 **사내 커밋 규약**과 어떻게 조화시킬까?
- `/review`를 **CI/PR 자동화**에 연결할 방법은?
