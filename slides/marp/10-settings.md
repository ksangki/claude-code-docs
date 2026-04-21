---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.10 설정 파일'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.10 설정 파일 (settings.json)

**사용자 · 프로젝트 · Managed 레벨 설정 완전 가이드**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **4개 범위**의 설정 파일 위치
- **우선순위 병합** 규칙
- `/config` **UI** 사용
- 핵심 **필드 레퍼런스** 15종
- **Managed 설정** (엔터프라이즈) 배포 방법
- **Managed 전용 잠금** 설정
- **JSON 스키마** 연결로 자동완성

---

## 설정 파일 위치 (4개 범위)

| 범위 | 경로 | 적용 범위 |
|---|---|---|
| **전역 (사용자)** | `~/.claude/settings.json` | 모든 프로젝트의 나 |
| **프로젝트 (공유)** | `.claude/settings.json` | 저장소 참여자 전체, **커밋됨** |
| **로컬 (개인 프로젝트)** | `.claude/settings.local.json` | 특정 프로젝트, **gitignore** |
| **Managed (엔터프라이즈)** | 플랫폼별 시스템 경로 | MDM/레지스트리/plist로 배포 |

---

## 우선순위 병합

```
플러그인 기본값
    ↓
사용자 설정
    ↓
프로젝트 설정
    ↓
로컬 설정
    ↓
Managed (정책) 설정   ← 최우선, 재정의 불가
```

→ **Managed가 가장 강력**, 이후 CWD에 가까운 쪽이 우선.

---

## 설정 UI: `/config`

세션 내에서:

```
/config
```

- 각 범위의 현재 **활성 설정** 확인
- **파일 직접 편집**도 가능 (Claude Code가 변경 감지 → 자동 리로드)
- 별칭: `/settings`

---

## 필드: `model`

| 속성 | 값 |
|---|---|
| 타입 | `string` |
| 범위 | 모든 범위 |

```json
{ "model": "claude-opus-4-5" }
```

공급자가 지원하는 **모든 모델 ID 허용**.
우선순위: `--model` 플래그 > `ANTHROPIC_MODEL` env > 설정 `model`.

---

## 필드: `permissions`

Claude가 사용할 수 있는 **도구와 모드 제어**.

| 필드 | 타입 | 설명 |
|---|---|---|
| `allow` | `string[]` | 확인 없이 수행 가능한 작업 |
| `deny` | `string[]` | 항상 차단되는 작업 |
| `ask` | `string[]` | 항상 확인 요청 |
| `defaultMode` | `string` | `default`/`acceptEdits`/`plan`/`bypassPermissions` |
| `disableBypassPermissionsMode` | `"disable"` | bypass 모드 진입 방지 |
| `additionalDirectories` | `string[]` | 추가 접근 디렉토리 |

상세 규칙 구문 → Ch.06 참조.

---

## 필드: `hooks`

도구 실행 **전후**에 커스텀 커맨드 실행.

지원 이벤트:
`PreToolUse`, `PostToolUse`, `Notification`, `UserPromptSubmit`, `SessionStart`, `SessionEnd`, `Stop`, `SubagentStop`, `PreCompact`, `PostCompact` …

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $CLAUDE_FILE_PATHS"
          }
        ]
      }
    ]
  }
}
```

상세 → Ch.12, Ch.19.

---

## 필드: `cleanupPeriodDays`

| 속성 | 값 |
|---|---|
| 타입 | `integer` |
| 기본값 | `30` |
| 범위 | 모든 범위 |

트랜스크립트 **보관 일수**.
`0` → **세션 영속성 완전 비활성화**.

```json
{ "cleanupPeriodDays": 7 }
```

사내 보안 정책상 민감 내용이 긴 기간 유지되면 안 될 때 **단축**.

---

## 필드: `env`

모든 세션에 주입할 **환경 변수**.

```json
{
  "env": {
    "NODE_ENV": "development",
    "MY_API_URL": "https://api.example.com",
    "DISABLE_AUTO_COMPACT": "1"
  }
}
```

값은 문자열로 변환.

**활용**: 팀 공통 env를 **저장소에 커밋** → 모든 개발자 동일 동작.

---

## 필드: `availableModels` (Managed 전용)

| 속성 | 값 |
|---|---|
| 타입 | `string[]` |
| 범위 | **Managed만** |

사용자가 선택 가능한 모델의 **엔터프라이즈 허용 목록**.

허용 형식:
- **패밀리 별칭** — `"opus"` → 모든 Opus 버전
- **버전 프리픽스** — `"claude-sonnet-4"`
- **전체 ID** — `"claude-opus-4-5"`

→ 비용 정책이나 보안 정책을 강제.

---

## 필드: `worktree`

`--worktree` 플래그 동작 설정.

| 필드 | 타입 | 설명 |
|---|---|---|
| `symlinkDirectories` | `string[]` | 메인 저장소에서 심링크할 디렉토리 (예: `node_modules`) |
| `sparsePaths` | `string[]` | 대규모 모노레포 빠른 worktree용 sparse 체크아웃 경로 |

```json
{
  "worktree": {
    "symlinkDirectories": ["node_modules", ".next/cache"],
    "sparsePaths": ["packages/api", "packages/shared"]
  }
}
```

---

## 필드: `attribution`

Claude가 커밋과 PR 설명에 추가하는 텍스트 **커스터마이징**.

```json
{
  "attribution": {
    "commit": "Co-Authored-By: Claude <noreply@anthropic.com>",
    "pr": ""
  }
}
```

**활용**:
- 사내 정책상 어트리뷰션 문구가 정해진 경우
- 빈 문자열 → 어트리뷰션 제거

---

## 기타 필드

| 필드 | 설명 |
|---|---|
| `language` | 응답/음성 받아쓰기 언어 (`"korean"`) |
| `alwaysThinkingEnabled` | 확장 thinking 기본 활성 (default `true`) |
| `effortLevel` | `low`/`medium`/`high` — thinking 예산 |
| `autoMemoryEnabled` | 자동 메모리 on/off (사용자·로컬 범위) |
| `respectGitignore` | 파일 피커가 `.gitignore` 존중 (default `true`) |
| `defaultShell` | `bash` 또는 `powershell` — `!` 커맨드용 |
| `apiKeyHelper` | API 키 동적 검색 스크립트 경로 |

---

## 예시: 사내 표준 프로젝트 설정

```json
{
  "$schema": "https://schemas.anthropic.com/claude-code/settings.json",
  "permissions": {
    "defaultMode": "default",
    "allow": [
      "Read(*)", "Grep(*)", "Glob(*)",
      "Bash(git status)", "Bash(git diff *)", "Bash(git log *)",
      "Bash(npm test *)", "Bash(npm run lint *)"
    ],
    "deny": [
      "Bash(rm -rf *)", "Bash(sudo *)",
      "Bash(git push --force *)"
    ]
  },
  "env": {
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "cleanupPeriodDays": 14,
  "language": "korean"
}
```

---

## Managed 설정 (엔터프라이즈)

관리자가 **플랫폼 네이티브 메커니즘**을 통해 전사 배포.

| 플랫폼 | 메커니즘 |
|---|---|
| **macOS** | `/Library/Preferences/` plist 또는 MDM `com.anthropic.claudecode` |
| **Windows** | `HKLM\Software\Anthropic\Claude Code` 레지스트리 |
| **파일 기반** | 플랫폼별 managed 경로의 설정 파일 |
| **드롭인** | `managed-settings.d/` (알파벳 정렬로 병합) |

---

## Managed 전용 잠금 설정

**강제 정책용:**

| 설정 | 효과 |
|---|---|
| `allowManagedHooksOnly` | `true` → Managed 훅만 실행 |
| `allowManagedPermissionRulesOnly` | `true` → Managed 권한 규칙만 존중 |
| `allowManagedMcpServersOnly` | `true` → 허용 MCP 서버는 Managed에서만 |
| `strictPluginOnlyCustomization` | 특정 커스터마이징을 **플러그인 전용**으로 잠금 |

**용도**: 조직 전체 **보안·컴플라이언스 정책** 강제.

---

## JSON 스키마 연결

에디터 자동완성과 유효성 검사:

```json
{
  "$schema": "https://schemas.anthropic.com/claude-code/settings.json"
}
```

**효과:**
- VS Code / IntelliJ 자동완성
- 오타·잘못된 값 실시간 경고
- 설정 파일 작성 속도 향상

→ **모든 사내 저장소 settings.json에 추가 권장**.

---

## 일반적 실수와 대안

| 실수 | 대안 |
|---|---|
| 모든 설정을 `~/.claude/settings.json`에 | 팀 공유 설정은 프로젝트 레벨에 |
| 시크릿을 `env` 필드에 | `apiKeyHelper` + 외부 저장소 |
| `bypassPermissions` 기본 | 세분화 `allow` 규칙 작성 |
| Managed 설정 버전 관리 없음 | **Git + CI 배포 파이프라인** |
| `$schema` 누락 | 모든 파일에 추가 |

---

## 다음 챕터 예고

**Ch.11 인증** — OAuth · API Key · Bedrock · Vertex 각각의 설정·운영 방법

---

## Q&A / 실습

1. 우리 팀 프로젝트의 `.claude/settings.json` 초안 작성
2. **Managed 설정**으로 강제해야 할 사내 정책은?
3. 비용 제어를 위해 `availableModels`를 어디까지 제한할까?
