---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.06 권한 시스템'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.06 권한 시스템

**모드 · 허용/차단 규칙 · Bash 패턴 · MCP 권한**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- 권한이 제어하는 **3가지 작업 범주**
- 4개 **권한 모드** 비교와 사용 시기
- 모드 설정 **3가지 방법** (CLI · 슬래시 · 설정 파일)
- 허용/차단 규칙 **구성 요소**와 평가 순서
- **Bash 패턴 매칭** 세부 규칙
- **MCP 도구 권한** 제어
- **보안 권장 사항** 체크리스트

---

## 권한이 제어하는 3가지 범주

Claude Code는 로컬 머신에서 도구를 **실제로 실행**.

| 범주 | 도구 | 예시 |
|---|---|---|
| **파일 작업** | `Read`, `Edit`, `Write` | 소스 파일 읽기/편집/쓰기 |
| **Bash 커맨드** | `Bash` | 빌드, git, 스크립트 |
| **MCP 도구** | `mcp__*__*` | DB 쿼리, API 호출, 브라우저 자동화 |

→ 권한 시스템은 **이 세 범주를 모두 게이팅**.

---

## 권한 모드 4종

> 모드는 **규칙 매칭이 없을 때**의 기본 동작.
> 모드는 세션 전체에 적용.

1. **`default`** — 잠재적 위험 작업에 확인 요청
2. **`acceptEdits`** — 파일 편집 자동 승인
3. **`plan`** — 읽기 전용 계획 모드
4. **`bypassPermissions`** — 모든 검사 건너뛰기

---

## `default` 모드

**표준 모드. 일상 권장.**

- 셸 커맨드 · 파일 편집 · 네트워크 요청에 **확인 요청**
- 파일 **읽기/검색**은 자동 승인
- 부작용 있는 모든 도구를 한 번씩 묻는다

**사용 시기**: 대부분의 대화형 작업.

```bash
claude              # 기본
```

---

## `acceptEdits` 모드

**편집 자동 · 셸은 확인.**

- `Edit`, `Write` → **프롬프트 없이 적용**
- Bash → 여전히 확인 필요

**사용 시기:**
- Claude가 자유롭게 파일을 **여러 개 편집**해야 하는 작업
- 셸 작업은 수동 검토하고 싶을 때
- 리팩터링, 일괄 교체

```bash
claude --permission-mode acceptEdits
```

---

## `plan` 모드

**쓰기 작업이 전부 차단됨.**

- 파일 읽기, 검색, **논의 가능**
- `Edit`, `Write`, `Bash` (부작용) → **전부 차단**
- 큰 변경을 **미리 설계**할 때 안전망

**사용 시기:**
- 낯선 코드베이스 탐색
- 큰 리팩터링 계획
- 아키텍처 논의 중

```bash
claude --permission-mode plan
```

---

## `bypassPermissions` 모드

**모든 확인 비활성화. 즉시 실행.**

⚠️ **대화형 세션에서 절대 사용 금지.**

허용 조건:
- **완전 스크립트화된 자동화**
- 작업 범위를 **미리 감사**
- 격리된 샌드박스 (Docker, CI)

```bash
claude --permission-mode bypassPermissions
# 또는
claude --dangerously-skip-permissions
```

---

## 모드 설정 방법 3가지

**1. CLI 플래그** (세션 시작 시)
```bash
claude --permission-mode acceptEdits
```

**2. `/permissions` 슬래시 커맨드** (세션 중)
```
/permissions
```

**3. settings.json**
```json
{
  "defaultMode": "acceptEdits"
}
```
유효값: `"default"`, `"acceptEdits"`, `"bypassPermissions"`, `"plan"`, `"dontAsk"`

---

## 권한 규칙: 세분화된 제어

전역 모드 외에도 **특정 호출을 항상 허용/차단/요청**.

**구성 요소:**

| 필드 | 설명 |
|---|---|
| `toolName` | `"Bash"`, `"Edit"`, `"mcp__myserver"` |
| `ruleContent` | 도구 입력과 매칭할 선택 패턴 |
| `behavior` | `"allow"`, `"deny"`, `"ask"` |

**중요**: 규칙은 **모드보다 먼저 평가됨**.
일치하면 즉시 해당 동작 적용.

---

## 규칙 예시: 안전한 git 자동화

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Read(*)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)"
    ]
  }
}
```

→ `default` 모드 유지하면서도 **자주 쓰는 읽기 git 작업 자동화**.

---

## Bash 패턴 매칭

**패턴 종류:**

| 패턴 | 매칭 |
|---|---|
| `git status` | 정확한 일치만 |
| `git *` | 모든 `git` 서브커맨드 |
| `npm run *` | 모든 `npm run` 스크립트 |
| `*` | 모든 bash 커맨드 ⚠️ 극도의 주의 |

**복합 커맨드** (`&&`, `||`, `;`, `|`):
- **각 서브커맨드 독립 검사**
- **하나라도 차단**되면 전체 차단

→ `git status && npm test`는 둘 다 허용되어야 실행됨.

---

## 항상 차단/에스컬레이션되는 작업

Claude Code가 **반드시 묻거나 차단**:

- 프로젝트 외부로의 출력 리다이렉션 (`>`, `>>`)
- 워킹트리 외부로 `cd`
- `sed -i` 편집 커맨드 (파일 수정 추적 때문에 특수 처리)
- `.claude/` 또는 `.git/` 설정 디렉토리 대상 커맨드
- 셸 설정 파일 수정 (`.bashrc`, `.zshrc`, `.profile`)

→ **정책 우회** 시도를 예방하는 안전망.

---

## MCP 도구 권한

MCP 도구도 **동일한 규칙 시스템** 적용.

```json
{
  "permissions": {
    "deny": [
      "mcp__myserver"
    ],
    "allow": [
      "mcp__myserver__read_database"
    ]
  }
}
```

**서버 전체 차단** 가능:
- `mcp__servername` (툴 이름 생략) → 해당 서버 모든 도구 차단
- 모델이 **보기 전에** 도구 목록에서 필터링됨

**활용**: 위험한 쓰기 작업 차단, 읽기 도구만 허용.

---

## 실전: 읽기 전용 탐색 자동화

**요구**: 신규 입사자가 낯선 저장소를 탐색할 때 쓸 설정.

```json
{
  "permissions": {
    "defaultMode": "default",
    "allow": [
      "Read(*)",
      "Grep(*)",
      "Glob(*)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(cat *)",
      "Bash(ls *)"
    ],
    "deny": [
      "Edit(*)",
      "Write(*)",
      "Bash(rm *)"
    ]
  }
}
```

---

## 실전: 사내 CI 설정

**요구**: PR 리뷰 자동화에서 테스트만 실행.

```json
{
  "permissions": {
    "defaultMode": "default",
    "allow": [
      "Read(*)", "Grep(*)", "Glob(*)",
      "Bash(npm test *)",
      "Bash(npm run lint *)",
      "Bash(git diff *)"
    ],
    "deny": [
      "Bash(git push *)",
      "Bash(git commit *)",
      "Write(*)"
    ]
  }
}
```

→ `bypassPermissions`를 **쓰지 않고도** 자동화 달성.

---

## 보안 권장 사항

**사내 기본 가이드:**

- ✅ 대화형은 **`default` 모드로 시작**
- ✅ 낯선 코드 탐색은 **`plan` 모드**
- ✅ 편집 반복 작업은 **`acceptEdits`** + 세분화 allow
- ✅ 광범위한 모드 에스컬레이션 대신 **세분화 allow 선호**
- ✅ 친숙하지 않은 저장소 클론 시 **`.claude/settings.json` 검토** — 규칙이 미리 설정되어 있을 수 있음
- ❌ `bypassPermissions`는 **격리 환경에서만**
- ❌ 의심스러운 `allow` 규칙은 **pull 전에 감사**

---

## 평가 순서 요약

```
사용자 요청
     ↓
Claude가 tool_use 블록 생성
     ↓
[규칙 매칭: allow/deny/ask?]
     ├── 매칭 → 해당 동작
     └── 매칭 없음 → [권한 모드 기본값]
                            ├── default    → 대부분 ask
                            ├── acceptEdits→ 편집 allow
                            ├── plan       → 쓰기 deny
                            └── bypass*    → 전부 allow
     ↓
[도구 실행 또는 차단/확인]
```

---

## 다음 챕터 예고

**Ch.07 도구 목록** — 파일, 셸, 검색, 웹, 에이전트, MCP, 노트북 도구 전체 레퍼런스

---

## Q&A

1. 우리 팀 공통 `allow` 규칙 후보는?
2. `bypassPermissions`가 꼭 필요한 사내 워크플로우는 있는가?
3. `.claude/settings.json`을 **PR 리뷰 대상**에 포함할까?
