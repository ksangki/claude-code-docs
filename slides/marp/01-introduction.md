---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.01 소개'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 26px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.01 Claude Code 소개

**터미널에서 실행되는 AI 코딩 에이전트**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

이 세션이 끝나면 이것을 이해하게 됩니다.

- Claude Code가 **무엇**이며, 기존 코드 어시스턴트와 어떻게 **다른지**
- 6가지 **핵심 역량** (파일 편집 · 셸 실행 · 검색 · 웹 · 서브에이전트 · MCP)
- **권한 모드 4종** (`default` / `acceptEdits` / `plan` / `bypassPermissions`)
- `CLAUDE.md` **메모리 시스템**의 3계층 범위
- **인증 방식 2종** (OAuth vs API Key)

---

## Claude Code란 무엇인가

> Claude를 기반으로 만들어진 **터미널 기반 AI 에이전트**

| 특징 | 의미 |
|---|---|
| **파일시스템 직접 접근** | Read / Edit / Write를 IDE 바깥에서 수행 |
| **셸 직접 접근** | 테스트, 빌드, git 작업을 실제로 실행 |
| **자연어 작업 기술** | "이 버그 고쳐줘" → 끝까지 구현 |
| **Copy/Paste 불필요** | 컨텍스트 전환 없이 완결 |

**핵심 차이**: 제안이 아닌 **실행**까지 담당하는 에이전트.

---

## 6가지 핵심 역량 (1/2)

**1. 파일 읽기 및 편집**
- 소스 파일 읽기 → 정밀 편집
- 변경 전 **diff 표시** → 사용자가 통제권 유지

**2. 셸 커맨드 실행**
- 테스트, 빌드, git 등 모든 셸 작업 가능
- **설정 가능한 권한 제어**로 안전성 보장

**3. 코드베이스 검색**
- Glob(파일명 패턴) + Grep(정규식 내용 검색)
- 대규모 모노레포도 수동 탐색 없이 질의

---

## 6가지 핵심 역량 (2/2)

**4. 웹에서 정보 가져오기**
- `WebFetch` / `WebSearch` — 문서, API 스펙, 검색 결과
- 터미널을 벗어나지 않음

**5. 서브에이전트 생성**
- 복잡한 작업을 **병렬 워크스트림**으로 분할
- 여러 에이전트 스폰 → 동시 처리 → 결과 취합

**6. MCP 서버 연결**
- DB, 사내 API, 도구를 **Model Context Protocol**로 연결
- 역량을 조직 인프라에 맞춰 확장

---

## 권한 시스템: 모든 도구 호출은 검사를 거친다

**자율성 레벨을 사용자가 정한다.**

| 모드 | 동작 |
|---|---|
| `default` | 셸/편집 전에 **확인 요청** — 일상 권장 |
| `acceptEdits` | 편집 자동 승인 · 셸은 여전히 확인 |
| `plan` | **계획 먼저**, 승인 후 실행 — 큰 변경 전 |
| `bypassPermissions` | 모든 작업 즉시 실행 — **샌드박스 전용** |

```bash
claude --permission-mode acceptEdits
```

세션 중에는 `/permissions`로 변경.

---

## ⚠️ bypassPermissions 경고

**대화형에서 절대 사용 금지.**

- 모든 확인 프롬프트가 **비활성화**됨
- 격리된 환경에서만 허용:
  - Docker 컨테이너
  - CI 샌드박스
  - 작업 범위 외부 시스템에 영향 **불가**한 환경

**가이드라인**: 사내 자동화 파이프라인에서도 **allow 규칙 세분화**를 먼저 고려.

---

## CLAUDE.md 메모리 시스템

**매 세션 시작 시 자동 로드되는 프로젝트 지식**

목적: 빌드 커맨드, 컨벤션, 아키텍처 노트를 **한 번만** 작성.
이후 Claude가 매 세션 처음부터 재발견하지 않음.

**3가지 범위:**

| 범위 | 파일 | 공유 여부 |
|---|---|---|
| **프로젝트** | 저장소 루트 `CLAUDE.md` | 팀 공유 · 커밋 |
| **개인** | `CLAUDE.local.md` | 개인 · gitignore |
| **서브디렉토리** | `<sub>/CLAUDE.md` | 해당 디렉토리 작업 시 자동 로드 |

---

## CLAUDE.md 작성 철학

> **테스트**: "이 줄을 제거하면 Claude가 실수를 할까?"
> 그렇지 않다면 **삭제**하세요.

**들어가야 할 것**
- 정확한 빌드/테스트/lint 커맨드 (툴 이름이 아닌 호출식)
- 프로젝트 고유 컨벤션 (네이밍, 파일 구조)
- 숨은 함정 (모노레포 경계, DB 제약)

**빼야 할 것**
- Claude가 이미 아는 것 (표준 TS 구문)
- 자명한 알림 ("깔끔한 코드를 작성하세요")
- **민감 정보** (API 키, 비밀번호)

생성 방법: 세션 내에서 `/init` 실행.

---

## 인증: 두 가지 방식

**1. OAuth (권장)** — 대화형 사용
- `claude` 첫 실행 시 브라우저 프롬프트
- claude.ai 계정으로 로그인
- 토큰 갱신 **자동 처리**

**2. API 키** — CI/비대화형

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

- `ANTHROPIC_API_KEY`가 설정되면 OAuth 대신 **우선 적용**
- CI 파이프라인, Docker, 자동화에 유용

---

## 실무자 체크리스트

- [ ] Node.js 18+ 설치 확인 (`node --version`)
- [ ] `npm install -g @anthropic-ai/claude-code`
- [ ] 첫 프로젝트에서 `claude` 실행 → OAuth
- [ ] `/init` 으로 `CLAUDE.md` 초안 생성 후 **검토**
- [ ] `default` 모드로 시작 → 익숙해지면 `acceptEdits`
- [ ] 위험 저장소는 `plan` 모드로 탐색
- [ ] 민감정보는 `CLAUDE.md`에 **절대 기재 금지**

---

## 다음 챕터 예고

**Ch.02 빠른 시작** — 5분 안에 첫 작업 완료하기

- 설치 → 인증 → 첫 프롬프트까지
- 비대화형 `-p` 플래그 사용법
- 필수 슬래시 커맨드 7종

---

## Q&A

**토론 주제**

1. 우리 팀이 현재 Copilot/Cursor로 해결하지 못하는 작업은?
2. 어떤 저장소부터 `CLAUDE.md`를 작성할까?
3. `bypassPermissions` 없이 자동화를 설계하려면?
