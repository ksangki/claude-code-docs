---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.20 SDK 개요'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.20 SDK 개요

**stdin/stdout 제어 프로토콜 · 메시지 타입 · 통합 패턴**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- SDK의 **역할**과 일반 API와의 차이
- **작동 5단계**
- 3가지 **출력 형식** 비교
- 제어 프로토콜 **메시지 봉투 2종**
- **초기화 요청** 완전한 형태
- **사용자 메시지**와 우선순위
- **SDK 메시지 스트림 타입 5종**
- **기타 제어 요청** 8종
- **TypeScript 세션 API**
- **사용 사례 3종**

---

## SDK란

> 다른 애플리케이션에 Claude Code를 **임베드하기 위한 제어 프로토콜**.

**대상:**
- IDE 통합
- 자동화 스크립트
- CI/CD 파이프라인
- 서브프로세스 기반 모든 호스트

**차이점**:
- 라이브러리 API 직접 노출 **아님**
- **구조화된 JSON 메시지 스트림**으로 `claude` 프로세스와 통신
- 호스트 ↔ CLI 양방향 통신

---

## 작동 5단계

**1. Claude Code 프로세스 스폰**

```bash
claude --output-format stream-json --print --verbose
```

- `stdin`, `stdout`을 호스트 프로세스에 파이핑
- 영속 세션은 `--print` 생략 후 stdin에 `SDKUserMessage` 전송

**2. 초기화 요청 전송**
- stdin에 `control_request` (`subtype: "initialize"`)
- CLI가 `SDKControlInitializeResponse`로 응답

**3. stdout 메시지 스트리밍**
- 줄바꿈 구분 JSON 읽기
- 각 줄이 `SDKMessage` 유니온 타입

**4. 사용자 메시지 전송** (계속 대화)
**5. 결과 처리**

---

## 출력 형식

| 형식 | 설명 |
|---|---|
| `text` | 일반 텍스트 응답만. 대화형 기본 |
| `json` | 완료 시 작성되는 **단일 JSON 객체**. 일회성 스크립트 |
| `stream-json` | 줄바꿈 구분 **JSON 스트림**. 이벤트 발생 시 줄당 하나. **SDK에 필수** |

**SDK 통합**: `stream-json` 사용.
**CI 스크립트**: `json`으로 결과 파싱.

---

## 제어 프로토콜 메시지 봉투

**호스트 → CLI** (`SDKControlRequest`)

```json
{
  "type": "control_request",
  "request_id": "<고유-문자열>",
  "request": { "subtype": "...", ...페이로드 }
}
```

**CLI → 호스트** (`SDKControlResponse`)

```json
{
  "type": "control_response",
  "response": {
    "subtype": "success",
    "request_id": "<에코된-id>",
    "response": { ...페이로드 }
  }
}
```

오류 시 `subtype`은 `"error"` + `error` 필드.

---

## 초기화 요청

**반드시 먼저 전송.** 세션 설정 + 기능 반환.

```json
{
  "type": "control_request",
  "request_id": "init-1",
  "request": {
    "subtype": "initialize",
    "systemPrompt": "당신은 CI 자동화 에이전트입니다.",
    "appendSystemPrompt": "항상 테스트 커버리지를 추가하세요.",
    "hooks": {
      "PreToolUse": [
        { "matcher": "Bash", "hookCallbackIds": ["my-hook-id"] }
      ]
    },
    "agents": {
      "CodeReviewer": {
        "description": "코드 품질과 보안을 검토합니다.",
        "prompt": "당신은 전문 코드 리뷰어입니다...",
        "model": "opus"
      }
    }
  }
}
```

---

## 초기화 응답

```json
{
  "type": "control_response",
  "response": {
    "subtype": "success",
    "request_id": "init-1",
    "response": {
      "commands": [...],
      "agents": [...],
      "output_style": "stream-json",
      "models": [...],
      "account": {
        "email": "user@example.com",
        "organization": "Acme Corp",
        "apiProvider": "firstParty"
      }
    }
  }
}
```

**호스트가 받는 정보**: 사용 가능한 커맨드/에이전트, 계정 정보, 모델 목록.

---

## 사용자 메시지

```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "이 함수를 async/await으로 리팩터링해줘."
  },
  "parent_tool_use_id": null
}
```

**필드:**
- `parent_tool_use_id` — 이 메시지가 응답하는 **도구 사용 ID**. 최상위는 `null`
- `priority` — `'now'` / `'next'` / `'later'` — 비동기 **큐잉 스케줄링 힌트**

---

## SDK 메시지 스트림 타입

| 타입 | 설명 |
|---|---|
| `system` (`subtype: "init"`) | 세션 시작 시 **한 번** 출력. 모델, 도구, MCP 상태, 모드, 세션 ID |
| `assistant` | 모델 턴 생성 시 출력. `tool_use` 블록 포함 가능 |
| `stream_event` | **스트리밍 중 부분 토큰** 출력. 점진적 렌더링 |
| `tool_progress` | 장시간 도구의 **주기적 상태 업데이트** |
| `result` | 각 턴 종료 시 출력. 성공 또는 오류 서브타입 |

---

## `result` 메시지 예시

```json
{
  "type": "result",
  "subtype": "success",
  "result": "함수가 리팩터링되었습니다.",
  "duration_ms": 4200,
  "total_cost_usd": 0.0042,
  "num_turns": 3,
  "is_error": false,
  "session_id": "abc123"
}
```

**호스트가 활용:**
- **비용 모니터링** (`total_cost_usd`)
- **성능 추적** (`duration_ms`, `num_turns`)
- **오류 처리** (`is_error`, `subtype`)
- **세션 재개** (`session_id`)

---

## 기타 제어 요청

| `subtype` | 방향 | 설명 |
|---|---|---|
| `interrupt` | 호스트→CLI | 현재 턴 중단 |
| `set_permission_mode` | 호스트→CLI | 권한 모드 변경 |
| `set_model` | 호스트→CLI | 세션 중간 모델 전환 |
| `can_use_tool` | CLI→호스트 | **도구 호출 권한 요청** |
| `mcp_status` | 호스트→CLI | MCP 서버 연결 상태 |
| `get_context_usage` | 호스트→CLI | 컨텍스트 사용량 |
| `rewind_files` | 호스트→CLI | 특정 메시지 이후 파일 변경 **되돌리기** |
| `hook_callback` | CLI→호스트 | **등록된 훅 이벤트 전달** |

---

## TypeScript 세션 관리 API

SDK는 `~/.claude/` 트랜스크립트 **조작 함수**도 내보냄:

```typescript
import {
  query,
  listSessions,
  getSessionInfo,
  getSessionMessages,
  forkSession,
  renameSession,
  tagSession,
} from '@anthropic-ai/claude-code'
```

---

## `query` — 주요 SDK 진입점

```typescript
for await (const message of query({
  prompt: '이 디렉토리에 어떤 파일이 있나요?',
  options: { cwd: '/my/project' }
})) {
  if (message.type === 'result') {
    console.log(message.result)
  }
}
```

**특성:**
- **비동기 이터러블** 반환
- 스트리밍 메시지 순회
- 타입으로 분기 처리

---

## 세션 관리 함수

**`listSessions` — 저장된 세션 목록:**

```typescript
const sessions = await listSessions({ dir: '/my/project', limit: 50 })
```

**`getSessionMessages` — 트랜스크립트 읽기:**

```typescript
const messages = await getSessionMessages(sessionId, {
  dir: '/my/project',
  includeSystemMessages: false,
})
```

**`forkSession` — 대화 분기:**

```typescript
const { sessionId: newId } = await forkSession(originalSessionId, {
  upToMessageId: 'msg-uuid',
  title: '실험적 분기',
})
```

---

## 사용 사례 1: IDE 통합

**시나리오**: IDE가 영속 Claude Code 프로세스 스폰.

**구현:**
- 제어 프로토콜로 메시지 라우팅
- **`PreToolUse` 훅 콜백**으로 파일 편집 가로채기
- 적용 전 **IDE 네이티브 UI에 diff 표시**
- 사용자 승인 → 적용

**예시**: VS Code 확장, JetBrains 플러그인.

---

## 사용 사례 2: CI/CD 자동화

```bash
result=$(echo "diff를 검토하고 pass/fail을 출력해줘" | \
  claude --output-format json --print \
         --permission-mode bypassPermissions)
```

**통합:**
- PR 자동 리뷰
- 테스트 실패 자동 수정 시도
- 문서 자동 업데이트
- 보안 감사

**주의**: 샌드박스 환경 + 비용/턴 상한 필수.

---

## 사용 사례 3: 헤드리스 에이전트

**구성:**
- TypeScript SDK `query()` 스트리밍 사용
- **지속 데몬 프로세스** 유지
- **크론 스케줄**로 작업 실행

**시나리오:**
- 매일 밤 의존성 업데이트 PR 생성
- 특정 시간마다 릴리즈 노트 초안
- 이슈 트리아지 자동화

---

## 실전 통합 체크리스트

- [ ] `stream-json` 출력 형식 선택
- [ ] `initialize` 요청 먼저 전송
- [ ] `request_id` **고유성** 보장
- [ ] `result` 메시지에서 **비용·오류 처리**
- [ ] `can_use_tool` 응답으로 **권한 제어**
- [ ] `hook_callback`으로 **도구 이벤트 관찰**
- [ ] `set_permission_mode` / `set_model`로 **세션 중 튜닝**
- [ ] `interrupt`로 **무한 루프 방어**

---

## 일반적 실수

| 실수 | 대안 |
|---|---|
| `text` 출력으로 SDK 통합 시도 | `stream-json` 필수 |
| 초기화 없이 사용자 메시지 전송 | `initialize` 먼저 |
| `result` 메시지 무시 | 비용/오류 모니터링 필수 |
| 무한 루프 가드 없음 | `max-turns` + `interrupt` 준비 |
| 세션 ID 저장 안 함 | 재개/감사를 위해 저장 |

---

## 보안 고려사항

- **CI에서 bypassPermissions** 사용 시 **반드시 샌드박스**
- SDK 통합에서 **사용자 입력 sanitize**
- `systemPrompt` 교체 시 내장 안전 가드 **손실** 가능 → `appendSystemPrompt` 권장
- `can_use_tool` 콜백에서 **세밀한 허용 정책** 구현
- `hook_callback`으로 **모든 도구 호출 감사**
- 시크릿은 CLI 인수가 **아닌 env**로 전달

---

## 전체 과정 정리

**20개 챕터 완주!**

**소개**: Ch.01-03 → Claude Code의 본질, 빠른 시작, 설치
**핵심 개념**: Ch.04-07 → 작동 원리, 메모리, 권한, 도구
**설정**: Ch.08-10 → CLAUDE.md, 환경 변수, settings.json
**가이드**: Ch.11-15 → 인증, 훅, MCP, 멀티에이전트, 스킬
**레퍼런스**: Ch.16-20 → 커맨드, CLI, 슬래시, 훅, SDK

---

## 다음 단계: 사내 도입 로드맵

**Week 1**: 개발자 온보딩 + OAuth 설정 + `/init`
**Week 2**: 프로젝트별 `CLAUDE.md` 작성 + 권한 규칙 표준화
**Week 3**: 훅 도입 (포맷/lint/로깅) + MCP 서버 목록 정의
**Week 4**: 스킬 라이브러리 구축 + 멀티에이전트 실험
**Week 5+**: SDK 기반 CI 자동화 + 엔터프라이즈 Managed 설정

---

## Q&A / 마무리

- 우리 팀의 **첫 SDK 통합 대상**은?
- **비용 상한**을 어떻게 조직 전체에 강제할까?
- **훅 + SDK**로 사내 에이전트 플랫폼을 만든다면?

**감사합니다!**

> 이 슬라이드의 원본 문서: `/home/user/claude-code-docs/` (Ch.01~20)
