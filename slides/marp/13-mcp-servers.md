---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.13 MCP 서버'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.13 MCP 서버

**Model Context Protocol로 외부 도구 연결**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **MCP 개요**와 Claude Code 활용 의미
- **서버 추가 방법** 3가지 (CLI · `--mcp-config` · 설정 파일)
- 설정 파일 **형식** (stdio / HTTP / SSE)
- **범위 3종**과 우선순위
- **서버 관리 커맨드** (`/mcp`)
- **MCP 도구 호출 승인**
- **실전 예시** (filesystem · postgres)
- **문제 해결** 가이드

---

## MCP란

> **Model Context Protocol** — Claude Code가 외부 데이터 소스·서비스에 연결하는 오픈 표준.

**활용:**
- 데이터베이스 쿼리
- Jira 티켓 읽기
- Slack 워크스페이스 상호작용
- 사내 API 호출
- 브라우저 자동화

**효과**: Claude가 **새로운 도구에 접근** → 역량 확장.

---

## 서버 추가 방법 1: CLI

```bash
# 기본 추가
claude mcp add <이름> -- <커맨드> [인수...]

# filesystem MCP 서버 예시
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /tmp

# 범위 지정
claude mcp add --scope project filesystem -- \
  npx -y @modelcontextprotocol/server-filesystem /tmp
claude mcp add --scope user my-db -- \
  npx -y @my-org/mcp-server-postgres
```

→ 가장 빠르게 추가. 범위는 `project` / `user` / `local`.

---

## 서버 추가 방법 2: `--mcp-config`

```bash
claude --mcp-config ./my-mcp-config.json
```

**활용:**
- **CI 환경**에서 설정 파일 직접 전달
- 저장소에 커밋하지 않을 **독립형 설정**
- 여러 설정 파일 혼합 (`--mcp-config a.json --mcp-config b.json`)

---

## 설정 파일 형식: stdio (로컬)

**가장 일반적. 로컬 프로세스 기반.**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**커맨드, args, env** 모두 지정 가능.
`$VAR` 및 `${VAR}` 구문 지원 (미참조 변수 → 경고).

---

## 설정 파일 형식: HTTP

**원격 HTTP 서버 연결.**

```json
{
  "mcpServers": {
    "my-api": {
      "type": "http",
      "url": "https://mcp.example.com/v1",
      "headers": {
        "Authorization": "Bearer $MY_API_TOKEN"
      }
    }
  }
}
```

**활용**: 사내 인증이 필요한 MCP 게이트웨이, SaaS 기반 도구.

---

## 설정 파일 형식: SSE

**Server-Sent Events 기반 스트리밍.**

```json
{
  "mcpServers": {
    "events-server": {
      "type": "sse",
      "url": "https://mcp.example.com/sse"
    }
  }
}
```

**활용**: 실시간 이벤트 스트림 (모니터링, 알림).

---

## 설정 범위

| 범위 | 위치 | 용도 |
|---|---|---|
| `project` | `.mcp.json` (CWD) | **팀 공유** 서버 설정 |
| `user` | `~/.claude.json` | 개인 전역 |
| `local` | `.claude/settings.local.json` | 개인 프로젝트별, **VCS 미커밋** |

**같은 서버 이름**이 여러 범위에 있으면 우선순위:

```
local > project > user
```

---

## 서버 관리: `/mcp`

**활성화/비활성화:**

```
/mcp enable <server-name>
/mcp disable <server-name>
/mcp enable all
/mcp disable all
```

**재연결:**

```
/mcp reconnect <server-name>
```

**상태 확인:** `/mcp` 만 실행 → 패널 오픈.

---

## 서버 상태 의미

`/mcp` 패널에 표시:

| 상태 | 설명 |
|---|---|
| `connected` | 서버 실행 + 준비 완료 |
| `pending` | 서버 시작 중 |
| `failed` | 연결 실패 (오류 메시지 확인) |
| `needs-auth` | OAuth 인증 필요 |
| `disabled` | 설정됐지만 꺼짐 |

---

## MCP 도구 호출 승인

Claude가 MCP 도구 호출 직전 **권한 프롬프트 표시**:

- **한 번 허용** — 이 호출만 승인
- **항상 허용** — 이 세션 동안 모든 호출 승인
- **거부** — 차단 → Claude가 다른 접근 시도

**자동 모드에서 사전 승인:**

```json
{
  "permissions": {
    "allow": [
      "mcp__filesystem__read_file",
      "mcp__filesystem__write_file"
    ]
  }
}
```

---

## 실전: filesystem 서버

```bash
# 1. 서버 추가
claude mcp add --scope project filesystem -- \
  npx -y @modelcontextprotocol/server-filesystem /home/user/projects

# 2. 연결 확인
#    /mcp 실행 → filesystem이 connected로 표시되는지 확인

# 3. 사용
#    Claude가 이제 mcp__filesystem__read_file 등으로
#    /home/user/projects의 파일을 읽고 쓸 수 있음
```

**효과**: 프로젝트 루트 밖 디렉토리에도 안전하게 접근 가능.

---

## 실전: 데이터베이스 서버

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "$DATABASE_URL"
      }
    }
  }
}
```

**실행 전**:

```bash
export DATABASE_URL="postgresql://user:pass@host:5432/db"
claude
```

→ Claude가 `mcp__postgres__*` 도구로 DB 쿼리 가능.

---

## 공식 MCP 레지스트리

**[modelcontextprotocol.io](https://modelcontextprotocol.io)**

- Anthropic + 커뮤니티 관리
- 데이터베이스 / 생산성 도구 / 클라우드 제공업체 / 이슈 트래커
- 예: PostgreSQL, GitHub, Jira, Brave Search, Puppeteer, …

**사내 활용**: 사내 도구를 **직접 MCP 서버로 구현** → 모든 개발자가 공유.

---

## 문제 해결: 'failed' 상태

1. 커맨드가 실행 가능한지 확인
   ```bash
   which npx
   ```
2. **커맨드를 직접 실행**해 오류 없이 시작되는지 확인
3. 필요한 **환경 변수** 설정 여부 확인
4. 상세 로그:
   ```bash
   claude --debug
   ```

---

## 문제 해결: 도구가 안 보임

**원인**: 연결됐지만 **미인증** 상태일 가능성.

**해결:**
1. `/mcp` 실행
2. **`needs-auth` 상태** 서버 확인
3. OAuth 흐름 따르기
4. 재연결:
   ```
   /mcp reconnect <server-name>
   ```

---

## 문제 해결: Windows에서 npx 실패

**원인**: Windows는 npx 실행 경로 처리가 다름.

**해결:**

```json
{
  "mcpServers": {
    "my-server": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@my-org/mcp-server"]
    }
  }
}
```

→ WSL을 쓸 수 있다면 **WSL 권장**.

---

## 사내 MCP 설계 가이드

**언제 MCP 서버를 만들까:**

- 사내 API 호출이 반복적 → MCP 도구로 노출
- 여러 개발자가 같은 DB에 접근 → postgres MCP
- 외부 도구(Jira 등)를 Claude에 통합
- 보안상 직접 자격 증명을 Claude에 주기 싫음 → MCP가 **자격 증명 중개**

**피해야 할 것**: 단순한 셸 커맨드를 MCP로 감싸는 것 (Bash 도구로 충분).

---

## 보안 체크리스트

- [ ] MCP 서버 **코드 감사** 완료
- [ ] 시크릿은 **env + `allowedEnvVars`**
- [ ] 프로덕션 DB는 **읽기 전용** 권한만
- [ ] 범위 **확인** (`project` vs `user` vs `local`)
- [ ] 낯선 저장소 클론 시 `.mcp.json` **검토**
- [ ] `allowManagedMcpServersOnly`로 **화이트리스트 강제** (엔터프라이즈)

---

## 다음 챕터 예고

**Ch.14 멀티에이전트** — 서브에이전트 스폰, 병렬 워크플로우, worktree 격리

---

## Q&A / 실습

1. 사내에 **MCP 서버로 만들 후보** 도구는?
2. 기존 SaaS 중 MCP 서버가 **이미 있는지** 조사
3. `.mcp.json`을 PR 리뷰 대상에 **포함시킬지** 결정
