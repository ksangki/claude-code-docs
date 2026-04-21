---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.12 훅'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 24px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 18px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.12 훅 (Hooks)

**도구 이벤트 자동화 · 강제 · 관찰**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **훅 작동 방식**과 종료 코드 시맨틱
- **17가지 훅 이벤트** 개요
- 훅 **설정 JSON 구조**
- **4가지 훅 타입** (command / http / prompt / agent)
- 실전 예시 4종 (포맷 / 차단 / 로깅 / env 주입)
- **훅 vs 스킬** 차이

---

## 훅이란

> 특정 **이벤트에 바인딩된** 커맨드.

**지원 타입:**
- 셸 스크립트
- HTTP 엔드포인트
- LLM 프롬프트
- 에이전트

**활용:**
- 코드 스타일 **강제** (prettier, biome)
- 테스트 **자동 실행**
- 도구 사용 **로깅**
- 위험한 커맨드 **차단**

---

## 훅 작동 방식

1. 이벤트 발생 (예: `PostToolUse`)
2. 매칭된 훅이 **자동 실행**
3. 종료 코드와 출력에 따라 **다음 동작 결정**

**각 훅의 입력**: 무슨 일이 일어났는지 설명하는 **JSON 객체** (stdin).

---

## 종료 코드 의미

| 코드 | 의미 |
|---|---|
| `0` | 성공. stdout이 Claude에게 표시될 수 있음 (이벤트별 다름) |
| `2` | **차단 또는 주입**. stderr를 Claude에게 표시(`PreToolUse`) + 도구 호출 방지 |
| 기타 | stderr를 **사용자에게만** 표시, 실행 계속 |

> `2`는 **강제 게이팅** 용도의 핵심 코드.

---

## 훅 이벤트 (1/2)

| 이벤트 | 설명 |
|---|---|
| `PreToolUse` | 도구 호출 직전. 검사·승인/차단/입력 수정. `2` → 차단 |
| `PostToolUse` | 성공 호출 후. 관찰·컨텍스트 주입 |
| `PostToolUseFailure` | 도구 호출 오류 종료 시 |
| `Stop` | Claude 응답 종료 직전. `2` → 대화 계속 |
| `SubagentStop` | 서브에이전트 종료 직전 |
| `SubagentStart` | 서브에이전트 시작 시 |
| `SessionStart` | 세션 시작/재개/`/clear`/`/compact` 후 |
| `UserPromptSubmit` | 사용자 프롬프트 제출 시. `2` → 차단 |

---

## 훅 이벤트 (2/2)

| 이벤트 | 설명 |
|---|---|
| `PreCompact` | 컴팩션 시작 직전. `2` → 컴팩션 차단 |
| `PostCompact` | 컴팩션 완료 후 |
| `Setup` | `init` 또는 유지보수 시 |
| `PermissionRequest` | 권한 다이얼로그 표시 시 |
| `PermissionDenied` | 도구 호출 거부 후 |
| `Notification` | 각종 알림 |
| `CwdChanged` | 작업 디렉토리 변경 |
| `FileChanged` | 감시 파일 변경 |
| `SessionEnd` | 세션 종료 |
| `ConfigChange` | 세션 중 설정 파일 변경 |

---

## 훅 설정 구조

세션에서 `/hooks`로 설정 패널 오픈.
실제 저장: 설정 파일 `hooks` 필드.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          { "type": "command", "command": "prettier --write $CLAUDE_FILE_PATH" }
        ]
      }
    ]
  }
}
```

- `matcher` (선택) — 이벤트의 매칭 가능한 필드와 매칭 패턴
- `hooks` — 매처 일치 시 실행할 훅 배열
- `matcher` 없음 → **모든 입력과 일치**

---

## 훅 타입 1: 셸 커맨드

```json
{
  "type": "command",
  "command": "npm test",
  "timeout": 60,
  "shell": "bash",
  "async": false
}
```

**주요 필드:**

| 필드 | 설명 |
|---|---|
| `command` | 실행할 셸 커맨드 (필수) |
| `timeout` | 초 단위 |
| `shell` | `bash` (기본) 또는 `powershell` |
| `async` | 백그라운드 실행 (출력 무시) |
| `once` | 한 번 실행 후 자동 제거 |
| `if` | 조건부 건너뛰기 (권한 규칙 구문) |
| `statusMessage` | 스피너 메시지 커스텀 |

---

## 훅 타입 2: HTTP 요청

```json
{
  "type": "http",
  "url": "https://hooks.example.com/claude-event",
  "headers": {
    "Authorization": "Bearer $MY_TOKEN"
  },
  "allowedEnvVars": ["MY_TOKEN"],
  "timeout": 10
}
```

Claude Code가 훅 입력 JSON을 **URL에 POST**.

**활용**: Slack 웹훅, 사내 로깅 서버, 감사 시스템 연동.

---

## 훅 타입 3: LLM 프롬프트

```json
{
  "type": "prompt",
  "prompt": "이 bash 커맨드에 보안 문제가 있는지 확인하세요: $ARGUMENTS. 문제가 있으면 설명하고 코드 2로 종료하세요.",
  "model": "claude-haiku-4-5",
  "timeout": 30
}
```

→ **LLM이 판단하는 게이트**.
예: 위험 커맨드 탐지, PR 설명 자동 요약.

---

## 훅 타입 4: 에이전트 훅

```json
{
  "type": "agent",
  "prompt": "단위 테스트가 실행되고 통과했는지 확인하세요.",
  "timeout": 60
}
```

**동작:**
- 도구 접근 권한이 있는 **짧은 에이전틱 루프** 실행
- 파일 읽기·커맨드 실행 필요한 **검증 작업**에 적합

**사내 활용**: 커밋 전 테스트 통과 확인, 특정 규약 준수 검증.

---

## 실전: 파일 편집 후 자동 포맷

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

→ Claude가 쓴 파일이 **자동으로 포맷**됨.
팀 코드 스타일 일관성 유지.

---

## 실전: 위험한 커맨드 차단

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'rm -rf'; then echo '차단: rm -rf는 허용되지 않습니다' >&2; exit 2; fi"
          }
        ]
      }
    ]
  }
}
```

→ 종료 코드 2 → **도구 호출 차단** + Claude에게 이유 전달.

---

## 실전: 모든 도구 사용 로깅

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) $CLAUDE_TOOL_NAME\" >> ~/.claude-tool-log.txt",
            "async": true
          }
        ]
      }
    ]
  }
}
```

→ 비동기 실행 → 루프 블로킹 없음.
**사내 감사/사용량 분석** 기반.

---

## 실전: 디렉토리 변경 시 env 주입

```json
{
  "hooks": {
    "CwdChanged": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "if [ -f .envrc ]; then grep '^export ' .envrc >> \"$CLAUDE_ENV_FILE\"; fi"
          }
        ]
      }
    ]
  }
}
```

→ `cd` 후 자동으로 **프로젝트별 env 적용**.
direnv 패턴을 Claude Code에 통합.

---

## 훅 vs 스킬 비교

| 특성 | **훅** | **스킬** |
|---|---|---|
| 실행 시점 | **도구 이벤트에 자동** | `/skill-name`으로 명시적 호출 |
| 목적 | 부작용 · 게이팅 · 관찰 | 온디맨드 워크플로우 |
| 설정 위치 | 설정 JSON | `.claude/skills/` 마크다운 |
| 예시 | prettier 자동 실행 | `/deploy staging` |

**규칙**: 자동화되어야 할 것은 **훅**, 의도적 트리거면 **스킬**.

---

## 일반적 실수

| 실수 | 대안 |
|---|---|
| 훅에서 긴 작업을 동기 실행 | `async: true` 또는 timeout 단축 |
| 훅이 조용히 실패 | stderr + 종료 코드 명시 |
| 모든 이벤트에 광범위 훅 | `matcher`로 범위 제한 |
| 시크릿을 커맨드에 하드코딩 | env + `allowedEnvVars` |
| 훅 디버깅 어려움 | `statusMessage` + 로그 파일 |

---

## 다음 챕터 예고

**Ch.13 MCP 서버** — 외부 도구 연결, 설정 범위, 문제 해결

---

## Q&A

- 우리 팀에 **자동 포맷**을 강제할 훅이 이미 있는가?
- 사내 **감사 로그 서버**에 HTTP 훅을 붙일 수 있을까?
- `PreToolUse` LLM 프롬프트 훅으로 **PR 규약 검증** 가능한가?
