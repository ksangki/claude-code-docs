---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.03 설치'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 25px; }
  section h1 { color: #CC785C; }
  section h2 { color: #1F2937; border-bottom: 2px solid #CC785C; padding-bottom: 6px; }
  table { font-size: 20px; }
  code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
---

# Ch.03 설치 상세 가이드

**macOS · Linux · Windows(WSL) 플랫폼별 설치와 문제 해결**

실무자 과정 · 사내 교육 자료

---

## 학습 목표

- 세 가지 OS 환경에서 **권장 설치 절차** 파악
- **권한 문제**(npm prefix, sudo)를 회피하는 올바른 방법
- `nvm` / `fnm` **Node 버전 관리자** 도입
- **업데이트 / 제거** 절차
- 흔한 트러블슈팅 6가지와 해결

---

## 공통 요구사항

| 항목 | 최소 버전 | 확인 커맨드 |
|---|---|---|
| Node.js | **18 이상** | `node --version` |
| npm | Node에 포함 | `npm --version` |

**Claude Code는 시작 시 Node.js 버전을 직접 확인**하고, 18 미만이면 오류와 함께 종료.

설치 커맨드 (모든 플랫폼):

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

---

## macOS 설치 (1/2)

**기본 시도:**

```bash
npm install -g @anthropic-ai/claude-code
```

권한 오류 시 두 가지 옵션 중 선택.

**옵션 A: npm 권한 수정 (권장)**

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
```

셸 프로파일(`~/.zshrc` 또는 `~/.bash_profile`)에 추가:

```bash
export PATH=~/.npm-global/bin:$PATH
```

```bash
source ~/.zshrc
npm install -g @anthropic-ai/claude-code
```

---

## macOS 설치 (2/2)

**옵션 B: Node 버전 관리자 사용**

`nvm` 또는 `fnm`을 쓰면 홈 디렉토리에 Node가 설치되어 **전역 권한 문제 회피**.

```bash
# nvm 예시
nvm install --lts
nvm use --lts
npm install -g @anthropic-ai/claude-code
```

> **사내 권장**: 여러 프로젝트가 다른 Node 버전을 요구하는 경우 `nvm` 기본.

---

## Linux 설치

`sudo npm install -g`는 **권장하지 않음** — 이후 권한 꼬임의 원인.

**권장: nvm 사용**

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# 셸 다시 로드 후 Node.js 설치
nvm install --lts
nvm use --lts

# Claude Code 설치
npm install -g @anthropic-ai/claude-code
```

**대안: npm prefix 수정** — macOS 옵션 A와 동일.

---

## Windows (WSL) 설치 (1/2)

**반드시 WSL 안에서만 실행.** CMD/PowerShell은 **지원 안 됨**.

**1단계: WSL 설치** (관리자 PowerShell)

```powershell
wsl --install
```

재시작 후 Ubuntu + WSL 2가 설치됨.

**2단계: WSL 터미널 열기**

시작 메뉴 → Ubuntu, 또는 PowerShell에서 `wsl`.

---

## Windows (WSL) 설치 (2/2)

**3단계: WSL 안에 Node.js 설치**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

**4단계: Claude Code 설치**

```bash
npm install -g @anthropic-ai/claude-code
```

> **성능 Tip**: 프로젝트 파일은 WSL 파일시스템(`~/projects/`) 내부에 둘 것.
> `/mnt/c/…` 경유 Windows 파일 접근은 **현저히 느림**.

---

## 업데이트

두 가지 방법:

```bash
# npm으로
npm update -g @anthropic-ai/claude-code

# Claude Code 내장 커맨드로
claude update
```

버전 확인:

```bash
claude --version
```

> **사내 운영**: 매주 업데이트 확인을 SessionStart 훅으로 자동화 가능 (Ch.12 참조).

---

## 제거

**Claude Code 바이너리 제거:**

```bash
npm uninstall -g @anthropic-ai/claude-code
```

**설정 디렉토리는 자동 삭제되지 않음.** 필요 시 수동 제거:

```bash
rm -rf ~/.claude
```

⚠️ `~/.claude`에는 세션 트랜스크립트, 메모리 파일, OAuth 토큰이 포함됨.
**삭제 전에 백업 권장**.

---

## 트러블슈팅: `claude` 커맨드를 찾을 수 없음

원인: **npm 전역 bin이 PATH에 없음**.

```bash
npm config get prefix
# 예: /home/you/.npm-global
```

셸 프로파일에 다음 추가:

```bash
export PATH=/home/you/.npm-global/bin:$PATH
```

셸 재로드 후 다시 시도:

```bash
source ~/.zshrc
claude --version
```

---

## 트러블슈팅: Node.js 18 미만 오류

```
Error: Claude Code requires Node.js version 18 or higher.
```

해결:

```bash
# nvm
nvm install --lts
nvm use --lts

# fnm
fnm install --lts
fnm use --lts
```

> **체크리스트**: CI 이미지 베이스도 Node 18+인지 확인.

---

## 트러블슈팅: 권한 거부

**`sudo` 사용 금지** — root 소유 파일이 남아 추가 문제 유발.

올바른 해결:

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
npm install -g @anthropic-ai/claude-code
```

---

## 트러블슈팅: 인증 실패

브라우저 OAuth 흐름이 실패하거나 브라우저 사용 불가 환경:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
claude
```

**영구 설정**은 셸 프로파일에 추가.
API 키는 [Anthropic Console](https://console.anthropic.com)에서 발급.

---

## Docker / CI 환경

비대화형 환경 인증:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

비대화형 실행:

```bash
claude -p "테스트 스위트를 실행하고 실패를 보고해줘"
```

**샌드박스 컨테이너에서 권한 프롬프트 없이** 작동시키려면:

```bash
claude --dangerously-skip-permissions -p "..."
```

⚠️ 이 플래그는 **인터넷 접근 없음 + 비-root** 샌드박스에서만 작동.

---

## 사내 권장 설치 패턴

| 환경 | 권장 조합 |
|---|---|
| 개발자 macOS/Linux | **nvm + LTS Node** + Claude Code OAuth |
| 개발자 Windows | **WSL2 + Ubuntu + nvm** + OAuth |
| CI / 배포 파이프라인 | 공식 Node 18+ 이미지 + **API Key 환경변수** |
| 격리된 자동화 | 샌드박스 + `--dangerously-skip-permissions` |
| 엔터프라이즈 다수 사용자 | 배포 이미지에 미리 설치 + Managed settings |

---

## 다음 챕터 예고

**Ch.04 작동 원리** — 에이전틱 루프의 내부 동작, 컨텍스트 조립, 도구 실행 모델

---

## Q&A / 실습

1. 지금 바로 본인 머신에서 `claude --version` 실행
2. 회사 CI에 이미 Node 18+가 있는지 확인
3. 사내 배포 이미지에 Claude Code를 포함시킬 경우 **고려할 보안 이슈**는?
