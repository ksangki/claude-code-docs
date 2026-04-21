---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.16 커맨드 개요'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 26px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.16 커맨드 개요

**CLI 플래그 vs 슬래시 커맨드 · 키보드 단축키**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **CLI 플래그**와 **슬래시 커맨드**의 차이
- **`--help` vs `/help`** 사용
- CLI 플래그 **기본 사용법**
- 슬래시 커맨드 **기본 사용법**
- **키보드 단축키 6종**
- `claude` 서브커맨드 4종 (`mcp`, `doctor`, `update`)

---

## 두 가지 커맨드 타입

| 타입 | 사용 시점 | 예시 |
|---|---|---|
| **CLI 플래그** | 세션 **시작 시** — 모델/형식/모드 설정 | `claude --permission-mode acceptEdits "..."` |
| **슬래시 커맨드** | 실행 중 **세션과 상호작용** | `/commit` |

**주의**: CLI 플래그는 **한 번 소비**되고 세션 중간에 변경 불가.
예외: `/model`, `/permissions` — 실행 중 설정 변경 가능.

---

## 도움말 확인

```bash
# 모든 CLI 플래그
claude --help

# 세션 내 슬래시 커맨드 목록
/help
```

**`/help`의 출력 포함:**
- 내장 커맨드
- 플러그인이 추가한 커맨드
- 스킬이 노출한 커맨드

→ 세션마다 다를 수 있음.

---

## CLI 플래그 사용법

```bash
claude [플래그] [프롬프트]
```

**비대화형:**

```bash
claude -p "README.md를 요약해줘" < README.md
```

**모델 지정:**

```bash
claude --model opus
```

**편집 자동 승인:**

```bash
claude --permission-mode acceptEdits
```

→ 상세 레퍼런스는 Ch.17.

---

## 슬래시 커맨드 사용법

세션 내 입력 프롬프트에:

```
/command [인수]
```

**예시:**

```
/init
/compact 최근 세 작업만 요약해줘
/model claude-opus-4-5
```

→ 상세 레퍼런스는 Ch.18.

---

## 키보드 단축키 (1/2)

**대화형 세션 기본 단축키:**

| 키 | 동작 |
|---|---|
| `Ctrl+C` | **현재 응답 중단** (Claude가 턴 중간에 멈춤) |
| `Ctrl+D` | **Claude Code 종료** |
| `Ctrl+L` | 터미널 화면 지우기 (**대화 기록은 유지**) |

**중요 구분:**
- `Ctrl+C` → 현재 응답만 중단, **대화는 살아있음**
- `Ctrl+D` 또는 `/exit` → **세션 완전 종료**

---

## 키보드 단축키 (2/2)

| 키 | 동작 |
|---|---|
| `↑` / `↓` | 입력 **기록 탐색** |
| `Tab` | **슬래시 커맨드 이름 자동완성** |
| `Escape` | 진행 중인 **권한 프롬프트 취소** |

**실무 팁:**
- `Tab`으로 `/sk<Tab>` → `/skills`
- `↑`으로 이전 프롬프트 재사용
- `Escape`으로 잘못 요청한 권한 다이얼로그 빠르게 취소

---

## 서브커맨드: `claude mcp`

**MCP 서버 설정·관리.**

```bash
claude mcp --help
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /tmp
claude mcp serve      # Claude Code를 MCP 서버로 실행
```

**`mcp serve`의 용도**: 다른 Claude Code 인스턴스가 이 인스턴스를 MCP 서버로 사용.

---

## 서브커맨드: `claude doctor`

**설치/설정 문제 진단.**

```bash
claude doctor
```

**확인 항목:**
- Node.js 버전
- 설치 경로
- 설정 파일 위치
- 인증 상태
- MCP 연결 상태

**활용**: 설치 후 첫 동작 확인, 환경 문제 트러블슈팅.

---

## 서브커맨드: `claude update`

**최신 버전으로 업데이트.**

```bash
claude update
```

대안:

```bash
npm update -g @anthropic-ai/claude-code
```

**사내 운영**: SessionStart 훅으로 **주 1회 업데이트 체크** 자동화 가능.

---

## CLI vs 슬래시 선택 가이드

| 작업 | 추천 |
|---|---|
| 세션 시작 시 설정 | CLI 플래그 |
| 스크립트/CI 실행 | CLI 플래그 + `-p` |
| 진행 중 모델 변경 | `/model` |
| 진행 중 권한 변경 | `/permissions` |
| 메모리 편집 | `/memory` |
| 컨텍스트 요약 | `/compact` |
| 컨텍스트 완전 초기화 | `/clear` |

---

## 일반적 실수

| 실수 | 대안 |
|---|---|
| 세션 중 `--model` 변경 시도 | `/model <name>` |
| `/help` 대신 `claude --help` (세션 내) | 세션에선 `/help` |
| `Ctrl+C`를 세션 종료로 오해 | 종료는 `Ctrl+D` 또는 `/exit` |
| `claude update` 건너뛰기 | 주기적 업데이트 습관 |
| `claude doctor`를 잊음 | 환경 문제 시 **첫 단계** |

---

## 다음 챕터 예고

**Ch.17 CLI 플래그** — 모든 옵션 상세와 조합 예시

---

## Q&A

- 우리 팀이 **가장 자주 쓸 CLI 조합**은?
- 신규 입사자 가이드에 **어떤 단축키를 강조**할까?
- `claude doctor`를 **사내 온보딩 체크리스트**에 포함?
