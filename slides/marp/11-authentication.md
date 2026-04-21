---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.11 인증'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.11 인증

**OAuth · API Key · Bedrock · Vertex 설정과 운영**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- **claude.ai OAuth** 기본 흐름
- **API 키** 두 가지 설정 방식 (env · `apiKeyHelper`)
- **AWS Bedrock** 통합
- **GCP Vertex AI** 통합
- **계정 전환** (`/login`, `/logout`)
- **토큰 만료와 자동 갱신**
- **인증 소스 우선순위**

---

## 인증 방식 개요

| 방식 | 사용 대상 | 자동 갱신 |
|---|---|---|
| **Claude.ai OAuth** | 개인 개발자 · 대화형 | ✅ |
| **API 키** | CI · 자동화 · 서버 | ❌ (수동) |
| **AWS Bedrock** | AWS 기반 엔터프라이즈 | ✅ (AWS 자격 체인) |
| **GCP Vertex AI** | GCP 기반 엔터프라이즈 | ✅ (GCP 자격 체인) |

---

## Claude.ai OAuth (기본)

**API 키 없이** `claude` 실행 시 자동 개시.

**흐름:**
1. 터미널에서 `claude`
2. URL 표시 → 브라우저로 열기
3. claude.ai 계정 로그인 + 권한 부여
4. Claude Code가 자동으로 토큰 수신
5. **안전 저장**:
   - macOS → **Keychain**
   - 다른 플랫폼 → 자격 증명 파일

**토큰 갱신**: 만료 전 **자동**. 명시적 로그아웃 전까지 재인증 불필요.

---

## API 키: 환경 변수

**가장 간단한 자동화 방식:**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

- 변수 설정 시 **직접 사용** (OAuth 요청 안 함)
- CI, Docker, 서버에 적합

> ⚠️ `ANTHROPIC_API_KEY`가 설정되면 **OAuth 흐름 비활성화**.

**사내 운영**: Secret Manager(AWS Secrets Manager, GCP Secret Manager 등)에서 주입.

---

## API 키: `apiKeyHelper`

**자격 증명을 동적으로 가져오는** 스크립트 지정.

```json
{
  "apiKeyHelper": "cat ~/.anthropic/api-key"
}
```

**동작:**
- Claude Code가 이 커맨드 실행
- stdout에 **API 키만 출력**, 코드 0 종료
- 결과는 **5분 캐시** (`CLAUDE_CODE_API_KEY_HELPER_TTL_MS`로 조정)

**활용**:
- 사내 시크릿 볼트에서 동적 조회
- IAM 역할 assume → 임시 토큰 발급

---

## AWS Bedrock 설정

```bash
# 1. Bedrock 모드 활성화
export CLAUDE_CODE_USE_BEDROCK=1

# 2. AWS 자격 증명 (표준 AWS 체인)
#   - ~/.aws/credentials
#   - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_SESSION_TOKEN
#   - IAM 역할 (EC2, ECS, EKS)
#   - aws sso login

# 3. 리전 (선택)
export AWS_REGION=us-east-1
```

**사내 운영**: EC2 인스턴스 프로파일 또는 워크로드 아이덴티티 권장.

---

## AWS 자격 증명 자동 갱신

**단기 SSO 토큰 만료 대응:**

```json
{
  "awsAuthRefresh": "aws sso login --profile my-profile"
}
```

**커맨드에서 자격 내보내기:**

```json
{
  "awsCredentialExport": "aws sts assume-role --role-arn arn:aws:iam::123456789012:role/MyRole --role-session-name claude-code --query Credentials --output json"
}
```

→ 장시간 작업 세션 중에도 **중단 없이 갱신**.

---

## GCP Vertex AI 설정

```bash
# 1. Vertex 모드 활성화
export CLAUDE_CODE_USE_VERTEX=1

# 2. GCP 자격 증명
#   - gcloud auth application-default login
#   - GOOGLE_APPLICATION_CREDENTIALS (서비스 계정 키)
#   - 워크로드 아이덴티티 (GKE)

# 3. 프로젝트 · 리전 (선택)
export ANTHROPIC_VERTEX_PROJECT_ID=my-gcp-project
export CLOUD_ML_REGION=us-central1
```

**자동 갱신:**

```json
{
  "gcpAuthRefresh": "gcloud auth application-default login"
}
```

---

## 계정 전환

**다른 계정으로 로그인:**

```
/login
```

- 새 OAuth 흐름 시작
- 저장된 토큰이 **새 계정 토큰으로 교체**

**로그아웃:**

```
/logout
```

- 저장된 자격 증명 제거
- 다음 실행 시 **재인증 요청**

**활용**: 개인/팀 계정 전환, 공용 머신 사용 후 정리.

---

## 토큰 만료와 갱신 메커니즘

**Claude Code가 조용히 처리:**

- 각 API 요청 **전에** 액세스 토큰 만료 확인
- 만료 시 저장된 갱신 토큰으로 **잠금 획득 → 갱신**
- 여러 동시 Claude Code 인스턴스는 **잠금 파일로 중복 갱신 방지**
- API에서 `401` 응답 → **즉시 강제 갱신**

→ 사용자는 갱신을 **의식할 필요 없음**.

---

## 인증 우선순위

여러 소스가 설정된 경우 **이 순서로 해석**:

1. `ANTHROPIC_AUTH_TOKEN` env
2. `CLAUDE_CODE_OAUTH_TOKEN` env
3. **파일 디스크립터**의 OAuth 토큰 (관리형 배포용)
4. 설정의 `apiKeyHelper`
5. **저장된 claude.ai OAuth 토큰** (Keychain/자격 파일)
6. `ANTHROPIC_API_KEY` env

> **CI/비대화형**: `ANTHROPIC_API_KEY` 또는 `CLAUDE_CODE_OAUTH_TOKEN` 사용.
> 대화형 흐름보다 **먼저 확인**됨.

---

## 사내 인증 패턴 권장

| 시나리오 | 권장 |
|---|---|
| 개발자 로컬 | **OAuth** (자동 갱신) |
| CI/CD (GitHub Actions 등) | **API Key** via Secret |
| 사내 서버 (AWS) | **Bedrock + IAM 역할** |
| 사내 서버 (GCP) | **Vertex + 워크로드 아이덴티티** |
| 단기 자동화 (임시 토큰) | `apiKeyHelper` + STS assume |
| 공용 / 키오스크 머신 | 세션 끝마다 `/logout` |

---

## 일반적 실수

| 실수 | 대안 |
|---|---|
| API 키를 코드/CLAUDE.md에 하드코딩 | env 또는 `apiKeyHelper` |
| CI에서 OAuth 사용 시도 | API Key 또는 `CLAUDE_CODE_OAUTH_TOKEN` |
| 여러 env 변수 동시 설정 (충돌) | 우선순위 확인 후 하나만 |
| AWS/GCP 자격 자동 갱신 없음 | `awsAuthRefresh`/`gcpAuthRefresh` 설정 |
| 공용 머신에서 로그아웃 생략 | 세션 종료 시 `/logout` 강제 |

---

## 보안 체크리스트

- [ ] API 키는 **절대** 저장소·CLAUDE.md에 기록하지 않음
- [ ] CI에서는 **Secret Manager** 또는 환경 변수 주입
- [ ] IAM 역할 사용 시 **최소 권한 원칙** (Bedrock 호출만 허용)
- [ ] 공용 머신은 **세션 후 `/logout`**
- [ ] 사내 정책: **Managed 설정**에서 인증 방식 강제
- [ ] **감사 로그** → `CLAUDE_CODE_JSONL_TRANSCRIPT` + 중앙 수집
- [ ] **토큰 갱신 실패** 모니터링 알림

---

## 다음 챕터 예고

**Ch.12 훅** — 도구 이벤트 자동화, 종료 코드 시맨틱, 실전 예시

---

## Q&A / 실습

1. 우리 조직은 **OAuth vs API Key** 중 무엇을 표준으로?
2. Bedrock/Vertex 사용 시 **리전 정책**은?
3. `apiKeyHelper`로 사내 볼트에 연결한다면 스크립트 설계는?
