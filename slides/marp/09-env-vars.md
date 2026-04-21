---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.09 환경 변수'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 24px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 18px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.09 환경 변수 레퍼런스

**인증 · 경로 · 모델 · 동작 · 리소스 · 관찰 가능성**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **인증** 관련 env 변수 전체 (OAuth/API/Bedrock/Vertex)
- **설정 경로** 재정의 (`CLAUDE_CONFIG_DIR`)
- **모델 선택** 변수 3종
- **동작 토글** 10+종
- **리소스 제한** 튜닝
- **원격 측정 · 관찰 가능성** 설정
- **Node.js 런타임** 주의 사항
- 클라우드 제공업체 **리전 재정의**

---

## 인증 관련 (1/2)

| 변수 | 설명 |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic 직접 인증 API 키. 설정 시 OAuth 대신 사용 |
| `ANTHROPIC_AUTH_TOKEN` | 대안 인증 토큰 |
| `ANTHROPIC_BASE_URL` | API 기본 URL 재정의 (프록시, 스테이징, 호환 서드파티) |
| `CLAUDE_CODE_API_BASE_URL` | Claude Code 전용 URL 재정의 (`ANTHROPIC_BASE_URL`보다 우선) |
| `ANTHROPIC_BEDROCK_BASE_URL` | Bedrock 기본 URL |
| `ANTHROPIC_VERTEX_PROJECT_ID` | Vertex AI GCP 프로젝트 ID |

---

## 인증 관련 (2/2)

| 변수 | 설명 |
|---|---|
| `CLAUDE_CODE_USE_BEDROCK` | `1`/`true` → Bedrock을 공급자로 사용 |
| `CLAUDE_CODE_USE_FOUNDRY` | `1`/`true` → Anthropic Foundry 사용 |
| `CLAUDE_CODE_OAUTH_TOKEN` | OAuth 액세스 토큰 직접 사용 (자동화 유용) |

**인증 우선순위 (다음 중 먼저 찾은 것):**

1. `ANTHROPIC_AUTH_TOKEN`
2. `CLAUDE_CODE_OAUTH_TOKEN`
3. 파일 디스크립터 OAuth 토큰 (managed 배포)
4. `apiKeyHelper`
5. 저장된 OAuth 토큰 (Keychain/자격 파일)
6. `ANTHROPIC_API_KEY`

---

## 설정 경로

| 변수 | 기본값 | 설명 |
|---|---|---|
| `CLAUDE_CONFIG_DIR` | `~/.claude` | 설정/트랜스크립트 디렉토리 재정의 |
| `CLAUDE_CODE_MANAGED_SETTINGS_PATH` | - | Managed 설정 파일 경로 재정의 |

**사내 활용:**

```bash
export CLAUDE_CONFIG_DIR="/opt/claude-config"
```

여러 사용자가 **공유 디렉토리**를 쓰거나, 엔터프라이즈 정책을 위해 고정 경로가 필요할 때.

---

## 모델 선택

| 변수 | 설명 |
|---|---|
| `ANTHROPIC_MODEL` | 기본 모델. `model` 설정과 `--model` 플래그에 의해 재정의 |
| `CLAUDE_CODE_SUBAGENT_MODEL` | 서브에이전트용 모델 (설정 안 하면 부모와 동일) |
| `CLAUDE_CODE_AUTO_MODE_MODEL` | 자동 모드용 모델 (기본 메인 모델) |

**활용 예시:**
- **Opus**로 메인 세션, **Haiku**로 서브에이전트 병렬화 → 비용 절감
- **Sonnet**을 자동 모드 기본으로

---

## 동작 토글 (1/2)

| 변수 | 설명 |
|---|---|
| `CLAUDE_CODE_REMOTE` | `1` → 원격/컨테이너 모드 (타임아웃·프롬프트 조정) |
| `CLAUDE_CODE_SIMPLE` | `1` → bare 모드 (훅·LSP·스킬 등 모두 건너뜀) |
| `DISABLE_AUTO_COMPACT` | `1` → 자동 컴팩션 비활성 |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | `1` → 백그라운드 작업 비활성 |
| `CLAUDE_CODE_DISABLE_THINKING` | `1` → 확장 thinking 비활성 |

---

## 동작 토글 (2/2)

| 변수 | 설명 |
|---|---|
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | `1` → 자동 메모리 비활성 |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS` | `1` → `CLAUDE.md` 로딩 완전 비활성 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | `1` → 분석·원격 측정 비필수 트래픽 억제 |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | `1` → Bash 후 프로젝트 루트로 복귀 |

**사내 활용:**
- 보안상 민감한 환경 → `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`
- CI 결정론 필요 → `CLAUDE_CODE_SIMPLE=1`

---

## 리소스 제한

| 변수 | 설명 |
|---|---|
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | API 응답당 최대 출력 토큰 |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | 최대 컨텍스트 윈도우 |
| `BASH_MAX_OUTPUT_LENGTH` | Bash 출력 최대 문자 수 |
| `API_TIMEOUT_MS` | API 타임아웃 (기본 300,000ms, 원격 모드 120,000ms) |

**예시:**

```bash
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096
export BASH_MAX_OUTPUT_LENGTH=50000
export API_TIMEOUT_MS=60000
```

---

## 원격 측정 · 관찰 가능성

| 변수 | 설명 |
|---|---|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | `1` → OpenTelemetry 내보내기 활성화 |
| `CLAUDE_CODE_JSONL_TRANSCRIPT` | 세션 JSONL 트랜스크립트 저장 경로 |

**예시:**

```bash
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export CLAUDE_CODE_JSONL_TRANSCRIPT="/tmp/session.jsonl"
```

추가 OTEL 설정 (엔드포인트 등) 별도 필요.

**사내 활용**: 감사 로그, 사용량 분석, 성능 추적.

---

## Node.js 런타임

| 변수 | 설명 |
|---|---|
| `NODE_OPTIONS` | 표준 Node.js 옵션. `--max-old-space-size` 등 감지 |

⚠️ **주의**: 코드 실행 플래그를 포함하는 값으로 **설정하지 말 것**.

```bash
# OK
export NODE_OPTIONS="--max-old-space-size=4096"

# 위험 — 금지
export NODE_OPTIONS="--require suspicious-module"
```

---

## 클라우드 리전 재정의

**Vertex AI 모델별 리전:**

| 모델 프리픽스 | 환경 변수 |
|---|---|
| `claude-haiku-4-5` | `VERTEX_REGION_CLAUDE_HAIKU_4_5` |
| `claude-3-5-sonnet` | `VERTEX_REGION_CLAUDE_3_5_SONNET` |
| `claude-sonnet-4-6` | `VERTEX_REGION_CLAUDE_4_6_SONNET` |
| `claude-opus-4` | `VERTEX_REGION_CLAUDE_4_0_OPUS` |

기본 Vertex 리전 → `CLOUD_ML_REGION` (기본 `us-east5`).

---

## AWS 자격 증명

표준 AWS 자격 증명 환경 변수 지원.

| 변수 | 설명 |
|---|---|
| `AWS_REGION` | Bedrock API 리전. `AWS_DEFAULT_REGION` 폴백, 최종 `us-east-1` |
| `AWS_DEFAULT_REGION` | `AWS_REGION` 미설정 시 폴백 |

**자격 증명 소스:**
- `~/.aws/credentials`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`
- IAM 역할 (EC2, ECS, EKS)
- AWS SSO (`aws sso login`)

---

## 호스트 플랫폼 재정의

| 변수 | 설명 |
|---|---|
| `CLAUDE_CODE_HOST_PLATFORM` | 분석용 보고 플랫폼 (`win32`, `darwin`, `linux`) |

```bash
export CLAUDE_CODE_HOST_PLATFORM=darwin
```

**사용 예**: 컨테이너에서 실제 호스트 OS를 반영하고 싶을 때.

---

## 모든 세션에 환경 변수 설정

**셸 프로파일 대신** 설정 파일(`env` 필드) 사용 가능:

```json
{
  "env": {
    "DISABLE_AUTO_COMPACT": "1",
    "BASH_MAX_OUTPUT_LENGTH": "30000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

**장점:**
- 프로젝트별 별도 env 프로파일 유지
- 저장소에 커밋되어 **팀 공유**
- `/.claude/settings.json`에 두면 팀 전체 기본값

---

## 실전 조합 예시

**CI/자동화 파이프라인:**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export CLAUDE_CODE_REMOTE=1
export API_TIMEOUT_MS=120000
export CLAUDE_CODE_SIMPLE=1
```

**사내 보안 환경:**

```bash
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
export CLAUDE_CODE_JSONL_TRANSCRIPT=/var/log/claude/session.jsonl
export CLAUDE_CODE_ENABLE_TELEMETRY=1
```

**로컬 개발 + 비용 제어:**

```bash
export CLAUDE_CODE_SUBAGENT_MODEL=claude-haiku-4-5
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096
```

---

## 다음 챕터 예고

**Ch.10 설정 파일** — `settings.json`의 모든 필드 레퍼런스, 엔터프라이즈 Managed 설정

---

## Q&A

- 사내 CI 이미지에 어떤 env 변수를 **사전 주입**할까?
- **비필수 트래픽 비활성화**가 필요한 프로젝트가 있는가?
- 비용 최적화 → 메인/서브에이전트 모델을 **분리** 운영?
