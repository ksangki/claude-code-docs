---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.19 훅 레퍼런스'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 24px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 18px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.19 훅 레퍼런스

**모든 이벤트 · 입력 · 출력 · 종료 코드**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **매처 설정**과 이벤트별 매칭 필드
- 4가지 **훅 타입**의 완전한 필드 목록
- **기본 훅 입력** (모든 이벤트 공통)
- **동기 훅 출력 JSON** 스키마
- 이벤트별 **입력/출력/종료 코드 시맨틱**
- **비동기 훅**의 제약과 용도

---

## 훅 설정 구조 (재확인)

설정 파일 최상위 `hooks` 키.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'bash 커맨드 실행 예정' >&2"
          }
        ]
      }
    ]
  }
}
```

각 이벤트 → **매처 객체 배열** → 각 매처마다 **훅 커맨드 배열**.

---

## 매처 설정: 이벤트별 매칭 필드

| 이벤트 | 매칭 필드 |
|---|---|
| `PreToolUse` / `PostToolUse` / `PostToolUseFailure` / `PermissionRequest` / `PermissionDenied` | `tool_name` |
| `Notification` | `notification_type` |
| `SessionStart` | `source` (`startup`, `resume`, `clear`, `compact`) |
| `Setup` | `trigger` (`init`, `maintenance`) |
| `SubagentStart` / `SubagentStop` | `agent_type` |
| `PreCompact` / `PostCompact` | `trigger` (`manual`, `auto`) |
| `ConfigChange` | `source` |
| `FileChanged` | 파일 이름 패턴 (예: `.envrc\|.env`) |

---

## 훅 타입 1: 셸 커맨드 (전체 필드)

```json
{
  "type": "command",
  "command": "jq '.tool_name' && my-validator",
  "timeout": 30,
  "shell": "bash",
  "async": false,
  "once": false,
  "if": "Bash(git *)",
  "statusMessage": "검증 중..."
}
```

| 필드 | 의미 |
|---|---|
| `command` | 실행할 커맨드 (필수) |
| `timeout` | 초 (기본 60) |
| `shell` | `bash` / `powershell` |
| `async` | 백그라운드 비블로킹 |
| `asyncRewake` | 백그라운드 + 코드 2 종료 시 **모델 깨움** |
| `once` | 한 번 실행 후 자동 제거 |
| `if` | 조건부 건너뛰기 (권한 규칙 구문) |
| `statusMessage` | 스피너 메시지 커스텀 |

---

## 훅 타입 2: LLM 평가

```json
{
  "type": "prompt",
  "prompt": "이 bash 커맨드가 안전한지 확인하세요: $ARGUMENTS",
  "model": "claude-haiku-4-5",
  "timeout": 30
}
```

**활용**: LLM 기반 보안 체크, 규약 검증, 품질 게이트.

---

## 훅 타입 3: 에이전틱 검증기

```json
{
  "type": "agent",
  "prompt": "단위 테스트가 실행되고 통과했는지 확인하세요.",
  "model": "claude-haiku-4-5",
  "timeout": 120
}
```

**차이**: 단순 프롬프트가 아닌 **도구 접근 권한** 있는 짧은 에이전트.
파일 읽기·커맨드 실행이 필요한 **검증 작업**에 적합.

---

## 훅 타입 4: HTTP 엔드포인트

```json
{
  "type": "http",
  "url": "https://my-server.example.com/hook",
  "headers": {
    "Authorization": "Bearer $MY_TOKEN"
  },
  "allowedEnvVars": ["MY_TOKEN"],
  "timeout": 10
}
```

**활용**: 외부 감사 로그, 이벤트 버스 통합, 사내 알림.

---

## 기본 훅 입력 (공통 필드)

모든 훅이 stdin에서 받는 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| `hook_event_name` | string | `"PreToolUse"` 등 |
| `session_id` | string | 현재 세션 ID |
| `transcript_path` | string | JSONL 트랜스크립트 **절대 경로** |
| `cwd` | string | 훅 발생 시점 CWD |
| `permission_mode` | string | 활성 권한 모드 |
| `agent_id` | string | 서브에이전트에서 발생 시 식별자 |

**활용**: 감사 로그에 세션 ID, 모드, CWD 기록.

---

## 동기 훅 출력 (stdout JSON)

블로킹 훅이 종료 전에 출력 가능:

```json
{
  "continue": true,
  "suppressOutput": false,
  "decision": "approve",
  "reason": "커맨드가 안전합니다",
  "systemMessage": "훅이 이 작업을 승인했습니다.",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
  }
}
```

→ 종료 코드와 함께 **세밀한 제어** 가능.

---

## 이벤트 상세: `PreToolUse`

**발생**: 도구가 실행되기 **직전**.

**입력 필드**: `tool_name`, `tool_input`, `tool_use_id`

**종료 코드:**

| 코드 | 효과 |
|---|---|
| `0` | 출력 표시 안 됨. 훅 JSON 출력 적용 |
| `2` | stderr를 **Claude에게 표시** + 도구 호출 **차단** |
| 기타 | stderr **사용자에게만** 표시, 실행 계속 |

**`hookSpecificOutput` 필드:**
- `permissionDecision`: `'allow'` / `'deny'` / `'ask'` — 권한 결정 재정의
- `updatedInput`: **도구가 받을 교체 입력**
- `additionalContext`: 이 턴에 **컨텍스트 주입**

---

## 이벤트 상세: `PostToolUse`

**발생**: 도구가 성공 완료된 후.

**입력 필드**: `tool_name`, `tool_input`, `tool_response`, `tool_use_id`

**종료 코드:**

| 코드 | 효과 |
|---|---|
| `0` | stdout이 **트랜스크립트 모드에 표시** (Ctrl+O) |
| `2` | stderr를 **즉시 Claude에게** 시스템 메시지로 표시 |
| 기타 | stderr 사용자에게만 표시 |

**활용**: 도구 결과 관찰, 컨텍스트 보강.

---

## 이벤트 상세: `Stop`

**발생**: Claude 응답 종료 직전.

**입력 필드**: `stop_hook_active`, `last_assistant_message`

**종료 코드:**

| 코드 | 효과 |
|---|---|
| `0` | 출력 표시 안 됨 |
| `2` | stderr를 **시스템 메시지 주입** + Claude **대화 계속** |
| 기타 | stderr 사용자에게만 표시 + Claude **중지** |

> **팁**: 종료 코드 2 → Claude 출력 확인 후 **조건 미충족 시 대화 계속**. 예: 테스트 여전히 실패 시.

---

## 이벤트 상세: `SessionStart`

**발생**: 세션 시작 시.

**입력 필드**: `source` (`startup`/`resume`/`clear`/`compact`), `model`

**`hookSpecificOutput` 필드:**
- `additionalContext` — 세션 시스템 프롬프트 **주입**
- `initialUserMessage` — 세션의 **첫 사용자 메시지** 자동 제출
- `watchPaths` — `FileChanged` 감시기에 등록할 **절대 파일 경로**

**활용**: 초기 컨텍스트 주입, 환경 변수 설정, 자동 시작 프롬프트.

---

## 이벤트 상세: `UserPromptSubmit`

**발생**: 사용자가 프롬프트 제출 시.

**입력 필드**: `prompt`

**종료 코드:**

| 코드 | 효과 |
|---|---|
| `0` | stdout이 Claude에게 **추가 컨텍스트** |
| `2` | 처리 **차단** + 원본 프롬프트 지움 + stderr 사용자 표시 |
| 기타 | stderr 사용자만 표시 |

**활용**: 민감정보 감지 → 차단, 프롬프트 템플릿 확장.

---

## 이벤트 상세: `PermissionRequest`

**발생**: 권한 다이얼로그 표시 시.

**종료 코드:**

| 코드 | 효과 |
|---|---|
| `0` | `hookSpecificOutput.decision` 설정 시 **훅 결정 적용** |
| 기타 | stderr 사용자 표시 + **일반 다이얼로그로 폴백** |

**활용**: UI 없이 **프로그래밍 방식** 승인/거부.
예: 허용 IP 범위에서만 승인.

---

## 이벤트 상세: `CwdChanged`

**발생**: 작업 디렉토리 변경 후.

**입력 필드**: `old_cwd`, `new_cwd`

**특수 env 변수**: `CLAUDE_ENV_FILE`이 설정됨.
→ 훅이 `export KEY=value` 줄을 **이 파일에 쓰면** 이후 Bash 도구 호출에 적용.

**활용**: direnv 패턴, 프로젝트별 env 자동 주입.

---

## 이벤트 상세: `FileChanged`

**발생**: 감시 중인 파일 변경/추가/제거 시.

**입력 필드**:
- `file_path`
- `event`: `'change'` / `'add'` / `'unlink'`

**활용**:
- 설정 파일 변경 감지 → Claude에 컨텍스트 주입
- 테스트 재실행 트리거
- 자동 빌드

---

## 비동기 훅

백그라운드 실행. 일반 동기 출력 대신 **비동기 확인** 출력:

```json
{
  "async": true,
  "asyncTimeout": 30
}
```

**제약:**
- **도구 실행 차단 불가**
- **컨텍스트 주입 불가**
- **에이전틱 루프 느리게 하면 안 되는** 부작용 전용

**적합 용도**: 알림, 로깅, 메트릭 수집.

---

## 실전: 세션 시작 시 보안 브리핑 주입

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "echo '{\"hookSpecificOutput\": {\"additionalContext\": \"이 저장소는 PII를 다룹니다. 모든 DB 쿼리에 익명화를 적용하세요.\"}}'"
      }]
    }]
  }
}
```

→ 매 세션 시작 시 자동 컨텍스트 주입.

---

## 실전: Stop 훅으로 테스트 강제

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "if ! npm test --silent 2>/dev/null; then echo '테스트가 실패합니다. 수정하세요.' >&2; exit 2; fi"
      }]
    }]
  }
}
```

→ Claude가 마치려 할 때 **테스트 실패** 감지 → **대화 계속**.

---

## 훅 설계 원칙

- **단일 책임**: 하나의 훅 = 하나의 작업
- **빠름**: 동기 훅은 **수 초 내**
- **조용함**: 사용자 혼란 방지 위해 **불필요한 출력 최소화**
- **안전한 실패**: 훅이 실패해도 **주 흐름 방해 최소화**
- **디버깅 가능**: 로그 파일 + `statusMessage`
- **버전 관리**: 훅 설정은 **저장소에 커밋**

---

## 다음 챕터 예고

**Ch.20 SDK 개요** — stdin/stdout 제어 프로토콜, SDK 메시지 타입, 통합 패턴

---

## Q&A

- `Stop` 훅으로 강제할 **사내 품질 게이트**는?
- `SessionStart`에 주입할 **팀 공통 브리핑**은?
- 감사용 HTTP 훅의 **이벤트 수집 파이프라인** 설계?
