---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.17 CLI 플래그'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 24px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 18px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.17 CLI 플래그 상세

**모든 옵션 레퍼런스와 조합 예시**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **핵심 플래그** (`-p`, `--output-format`, `--verbose`)
- **세션 계속** (`-c`, `-r`, `--fork-session`)
- **모델·effort** 플래그
- **권한·보안** 플래그
- **컨텍스트·프롬프트** 플래그
- **출력 제어** 플래그
- **Worktree / 디버그** 플래그
- **실전 조합 5종**

---

## `-p, --print`

**비대화형 실행**. 응답 출력 후 종료.

```bash
claude -p "src/index.ts의 메인 함수를 설명해줘"
echo "이게 뭐야?" | claude -p
```

⚠️ **`--print` 모드는 작업 공간 신뢰 다이얼로그 건너뜀.**
→ 신뢰하는 디렉토리에서만 사용.

---

## `--output-format <형식>`

`--print`와 함께만 작동.

| 값 | 설명 |
|---|---|
| `text` | 일반 텍스트 (기본) |
| `json` | 완전한 결과 단일 JSON |
| `stream-json` | 줄바꿈 구분 JSON 스트림 |

**활용:**
- CI에서 결과 파싱 → `json`
- SDK 통합 → `stream-json`
- 로그 확인 → `text`

---

## `--verbose` / `-v, --version`

**`--verbose`**: 상세 출력 활성화 → 디버깅 시 유용.

**`-v, --version`**: 버전 번호 출력 후 종료.

```bash
claude --version
```

사내 스크립트에서 **버전 호환성** 체크에 활용.

---

## 세션 계속: `-c, --continue`

현재 디렉토리 **가장 최근 대화 재개**.

```bash
claude --continue
claude -c "이제 테스트 추가해줘"
```

**활용**:
- 회의 참석 후 복귀
- 다음 날 작업 이어가기
- `/exit` 후 재개

---

## 세션 계속: `-r, --resume`

**세션 ID로 재개**. ID 없이 사용하면 목록에서 선택.

```bash
claude --resume
claude --resume 550e8400-e29b-41d4-a716-446655440000
claude --resume "auth refactor"
```

**`--fork-session`**: `--continue` 또는 `--resume`과 함께 → **분기된 새 세션**.

**`-n, --name <이름>`**: 세션 표시 이름 설정.

**`--no-session-persistence`**: 세션 영속성 비활성 (`--print`와만).

---

## `--model <모델>`

세션 모델 설정.

**허용:**
- 별칭: `sonnet`, `opus`, `haiku`
- 전체 ID: `claude-sonnet-4-6`

```bash
claude --model sonnet
claude --model opus
claude --model claude-sonnet-4-6
```

---

## `--effort <레벨>`

thinking 예산.

| 레벨 | 용도 |
|---|---|
| `low` | 빠른 응답, 간단 작업 |
| `medium` (기본) | 일반 작업 |
| `high` | 복잡한 설계·분석 |
| `max` | 최대 thinking |

```bash
claude --effort high "이 아키텍처를 검토해줘"
```

**`--fallback-model <모델>`**: 기본 모델 과부하 시 자동 대체 (`--print`와만).

---

## 권한 플래그

**`--permission-mode <모드>`**

| 모드 | 동작 |
|---|---|
| `default` | 커맨드/편집 전 확인 |
| `acceptEdits` | 편집 자동, 셸 확인 |
| `plan` | 계획 제안 후 대기 |
| `bypassPermissions` | 프롬프트 없이 실행 — **샌드박스 전용** |

**`--dangerously-skip-permissions`**
= `--permission-mode bypassPermissions`와 동일.

⚠️ **인터넷 접근 없는 샌드박스**에서만.

---

## 도구 제어 플래그

**`--allowed-tools <도구...>`** (별칭 `--allowedTools`)
사용 가능 도구 지정.

```bash
claude --allowed-tools "Bash(git:*) Edit Read"
```

**`--disallowed-tools <도구...>`**
사용 불가 도구.

**`--tools <도구...>`**
정확한 도구 집합 지정. `""` → 모든 도구 비활성.

---

## 컨텍스트 플래그

**`--add-dir <디렉토리...>`** — 접근 컨텍스트 추가

```bash
claude --add-dir /shared/libs --add-dir /shared/config
```

**`--system-prompt <프롬프트>`** — 기본 시스템 프롬프트 **교체**

**`--append-system-prompt <텍스트>`** — 기본에 **추가** (권장)
내장 지시사항 유지.

---

## MCP 플래그

**`--mcp-config <설정...>`**
JSON 파일 경로 또는 인라인 JSON에서 MCP 서버 로드.

**`--strict-mcp-config`**
`--mcp-config`의 서버만 사용, 다른 모든 MCP 설정 무시.

**`--settings <파일-또는-json>`**
추가 설정 로드.

**`--agents <json>`**
커스텀 에이전트 인라인 정의.

---

## 출력 제어 플래그

**`--max-turns <n>`**
비대화형 모드 에이전틱 턴 제한 (`--print`와만).

**`--max-budget-usd <금액>`**
API 호출 최대 지출 (`--print`와만).

**`--json-schema <스키마>`**
구조화된 출력 검증.

**사내 활용**: 비용 폭주 방지, 무한 루프 차단.

---

## Worktree 플래그

**`-w, --worktree [이름]`**
세션에 새 git worktree 생성.

```bash
claude --worktree
claude --worktree feature-auth
claude --worktree "#142"              # PR 번호
```

**`--tmux`**
worktree와 함께 tmux 세션 생성 (`--worktree` 필요).

---

## 디버그 플래그

**`-d, --debug [필터]`**

```bash
claude --debug
claude --debug "api,hooks"
claude --debug "!file,!1p"   # 제외
```

**`--debug-file <경로>`**
디버그 로그를 **파일에 저장**.

**`--bare`**
최소 모드: 훅 · LSP · 플러그인 동기화 · 어트리뷰션 · 자동 메모리 · 백그라운드 프리페치 · 키체인 읽기 · `CLAUDE.md` 자동 발견 모두 **건너뜀**.

---

## 실전 조합 1: JSON 출력 비대화형

```bash
claude -p "모든 내보낸 타입 목록" --output-format json
```

**활용**: CI에서 결과를 스크립트로 파싱.

---

## 실전 조합 2: CI 권한 우회

```bash
claude -p "전체 테스트 스위트 실행하고 실패 수정해줘" \
       --dangerously-skip-permissions
```

**조건**: 샌드박스 + 인터넷 접근 없음 + 비-root.

---

## 실전 조합 3: 세션 이어가기

```bash
claude --continue -p "이제 그것에 대한 테스트 작성해줘"
```

**활용**: 대화형 → 비대화형 전환, 배치 실행.

---

## 실전 조합 4: 엄격한 MCP 격리

```bash
claude --mcp-config ./ci-mcp.json --strict-mcp-config \
       -p "스키마 분석해줘"
```

**활용**: 사용자 개인 MCP 설정을 **무시**하고 CI 전용 서버만.

---

## 실전 조합 5: 시스템 프롬프트 확장

```bash
claude --append-system-prompt "항상 JavaScript가 아닌 TypeScript를 출력하세요."
```

**활용**: 내장 지시사항을 유지하면서 **한 가지 규칙 추가**.

---

## 실전 조합 6: Worktree + tmux 병렬 개발

```bash
claude --worktree feature-auth --tmux
```

새 worktree + tmux 창 → 메인 작업 방해하지 않고 **병렬 개발**.

---

## 일반적 실수

| 실수 | 대안 |
|---|---|
| `--output-format`을 대화형에서 사용 | `--print`와 함께만 |
| `--system-prompt`로 기본 완전 교체 | `--append-system-prompt` 권장 |
| `--max-turns` 없이 무한 루프 위험 | CI에선 항상 설정 |
| `--bare`를 필요 기능 있을 때 사용 | 기능 필요 시 빼기 |
| 민감 저장소에 `--dangerously-skip-*` | 샌드박스 전용 |

---

## 사내 CI 템플릿 예시

```bash
claude -p "$PROMPT" \
  --output-format json \
  --max-turns 20 \
  --max-budget-usd 2.00 \
  --permission-mode acceptEdits \
  --allowed-tools "Bash(npm test *) Bash(git diff *) Read(*) Grep(*)" \
  --bare
```

**방어**:
- `--max-turns` → 무한 루프 차단
- `--max-budget-usd` → 비용 상한
- `--allowed-tools` → 위험 작업 차단

---

## 다음 챕터 예고

**Ch.18 슬래시 커맨드** — 세션 내 전체 커맨드 레퍼런스

---

## Q&A

- 우리 팀 CI에 맞는 **CLI 조합**은?
- `--append-system-prompt`로 적용할 **사내 공통 규칙**?
- 비용 통제를 위해 `--max-budget-usd`의 **적정값**은?
