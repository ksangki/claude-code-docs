---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.02 빠른 시작'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 26px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.02 빠른 시작

**5분 안에 첫 번째 코딩 작업 완료**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **사전 요구사항**과 버전 확인 방법
- 5단계 **온보딩 절차** (설치 → 인증 → 세션 → /init)
- **비대화형 모드**(`-p`)로 스크립트에 Claude 사용
- **핵심 슬래시 커맨드 7종** 숙지

---

## 사전 요구사항

**필수:**
- **Node.js 18 이상**
- **npm** (Node.js에 포함)

확인 커맨드:

```bash
node --version    # v18.x.x 이상이어야 함
npm --version
```

Node.js가 18 미만이면 Claude Code는 **시작 시 오류와 함께 종료**.

설치/업그레이드 → [nodejs.org](https://nodejs.org)

---

## 1단계: Claude Code 설치

npm 전역 설치:

```bash
npm install -g @anthropic-ai/claude-code
```

설치 확인:

```bash
claude --version
```

> **사내 Tip**: 권한 오류가 나면 `sudo` 쓰지 말고 npm prefix를 홈 디렉토리로 변경 (Ch.03 참조).

---

## 2단계: 인증

아무 디렉토리에서 `claude` 실행:

```bash
claude
```

**최초 실행 시:**
- 브라우저가 열리고 OAuth 로그인 유도
- 완료 시 자격 증명이 **안전 저장**
- 이후 세션에서 **재사용**

**대안 (API 키 직접 설정):**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

> `ANTHROPIC_API_KEY`가 설정되어 있으면 **API 키가 우선**.

---

## 3단계 · 4단계: 프로젝트 이동 → 세션 시작

```bash
cd my-project
claude
```

**자연어로 작업 입력:**

```
> 이 코드베이스의 구조를 설명해줘
> 회원가입 폼에 입력 검증 추가해줘
> UserService 클래스에 대한 테스트 작성해줘
> 에러를 잡고 무시하는 곳을 모두 찾아줘
```

Claude는 변경 전에 **계획을 표시** → 각 단계 승인/거부/수정 가능.

---

## 5단계: `/init`으로 CLAUDE.md 생성

세션 안에서:

```
/init
```

**자동 수행:**
- 매니페스트 파일, 기존 문서, 코드 구조 분석
- 빌드 커맨드, 아키텍처 힌트 추출
- `CLAUDE.md` 초안 생성

> **중요**: 생성된 파일을 **반드시 검토 후 커밋**.
> `CLAUDE.md`는 매 세션 시작마다 로드됨 → 비표준 빌드, 테스트 특이사항, 팀 컨벤션 기록 최적 위치.

---

## 비대화형 모드: `-p` 플래그

**단일 작업 → 결과 출력 → 종료**. 대화형 REPL에 진입하지 않음.

```bash
claude -p "이 코드베이스를 설명해줘"
claude -p "src/ 안의 모든 TODO 주석과 파일을 나열해줘"
claude -p "src/ 안의 미사용 export를 확인해줘"
```

**활용처:**
- **스크립트**에 임베드 (CI/CD, pre-commit)
- **일회성 쿼리** (긴 세션 불필요)
- **자동화 파이프라인**

**주의**: `--print` 모드는 작업 공간 신뢰 다이얼로그를 **건너뜀**.

---

## 핵심 슬래시 커맨드 7종

| 커맨드 | 설명 |
|---|---|
| `/help` | 사용 가능한 커맨드 · 키보드 단축키 표시 |
| `/init` | `CLAUDE.md` 생성 또는 업데이트 |
| `/memory` | 메모리 파일 보기 및 편집 |
| `/permissions` | 권한 모드 보기/변경 |
| `/mcp` | MCP 서버 관리 |
| `/clear` | 대화 컨텍스트 지우기 |
| `/exit` | 세션 종료 |

전체 목록은 Ch.18 참조.

---

## 실습: 5분 온보딩 실행

다 같이 해봅시다.

1. `node --version` → 18 이상 확인
2. `npm install -g @anthropic-ai/claude-code`
3. `claude --version`
4. 테스트 프로젝트로 `cd`
5. `claude` → OAuth 또는 API 키
6. `> 이 저장소를 요약해줘` 입력
7. `/init` → `CLAUDE.md` 초안 확인
8. `/exit` → `git diff CLAUDE.md` 로 검토

---

## 자주 하는 실수

| 실수 | 대안 |
|---|---|
| Windows CMD/PowerShell에서 직접 실행 | **WSL 안에서만** 실행 |
| `sudo npm install -g` | npm prefix를 홈 디렉토리로 설정 |
| 생성된 `CLAUDE.md`를 **검토 없이** 커밋 | 반드시 `git diff` 후 편집 |
| 저장소 전체에 `bypassPermissions` | `default` 모드 유지 + 세분화 allow |
| CLAUDE.md에 API 키 기록 | `CLAUDE.local.md` (gitignore) + env 변수 |

---

## 다음 챕터 예고

**Ch.03 설치 상세** — macOS/Linux/WSL 별 트러블슈팅, Node 버전 관리자, 제거/재설치 절차

---

## Q&A

- OAuth vs API 키 중 어떤 것을 사내 표준으로 할 것인가?
- `/init` 결과를 리뷰하는 **팀 체크리스트**가 필요한가?
- `-p` 비대화형을 사내 CI에 연결할 후보 워크플로우는?
