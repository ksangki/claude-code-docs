# Claude Code 사내 교육 슬라이드

Claude Code 공식 한글 문서(`../00_목차.md`, Ch.01~20)를 **실무자용 상세 강의 슬라이드**로 재구성한 자료입니다.

두 가지 포맷을 **동일한 콘텐츠**로 병렬 제공하여 팀이 비교 후 선호하는 방식을 채택할 수 있도록 구성했습니다.

```
slides/
├── marp/          # Marp Markdown — Ch.01 ~ Ch.20 각 1개 파일
└── apps-script/   # Google Apps Script — Ch.01 ~ Ch.20 각 1개 파일 + 공통 라이브러리
```

---

## 포맷별 특징

| 항목 | **Marp Markdown** | **Google Apps Script** |
|---|---|---|
| 작성 | `.md` 파일, 버전 관리 쉬움 | `.gs` 파일, JS 코드로 레이아웃 정의 |
| 출력 | PPTX / PDF / HTML | Google Slides (직접 생성) |
| Google Slides 업로드 | **수동** — export 후 Drive에 import | **자동** — 스크립트 실행 시 Drive에 즉시 생성 |
| 레이아웃 커스터마이징 | CSS 기반, 표현력 풍부 | Slides API 기반, 프로그래밍 방식 |
| 러닝 커브 | 낮음 (Markdown) | 중간 (Apps Script + Slides API) |
| 협업 편집 | git diff 리뷰 | Google Drive 공유 편집 |
| CI 자동화 | Marp CLI로 쉬움 | 트리거/웹훅 필요 |
| 시맨틱 검색 | grep으로 가능 | Drive 검색 |

**권장 사용 기준:**
- **교육 문서를 버전 관리**하고 다수 개발자가 리뷰하며 개선할 계획이면 → **Marp**
- **Google Workspace** 중심 조직이고 최종 결과물이 Google Slides여야 하면 → **Apps Script**
- 둘 다 시도해보고 팀 컨벤션 결정 → 이 저장소의 두 포맷 병렬 운영

---

## 1. Marp 사용법

### 사전 준비

```bash
# 옵션 A: Marp CLI (추천)
npm install -g @marp-team/marp-cli

# 옵션 B: VS Code 확장
# Marketplace에서 "Marp for VS Code" 설치
```

### 미리보기

```bash
# 브라우저에서 라이브 미리보기
marp --preview slides/marp/01-introduction.md

# VS Code: .md 파일 열고 우측 상단 "Open Preview" 버튼
```

### 내보내기

```bash
# PPTX (Google Slides에 import 가능)
marp slides/marp/01-introduction.md -o dist/01-introduction.pptx

# PDF
marp slides/marp/01-introduction.md --pdf -o dist/01-introduction.pdf

# HTML
marp slides/marp/01-introduction.md --html -o dist/01-introduction.html

# 전체 일괄 변환
mkdir -p dist
for f in slides/marp/*.md; do
  marp "$f" -o "dist/$(basename "${f%.md}").pptx"
done
```

### Google Slides로 업로드

1. PPTX로 export
2. [drive.google.com](https://drive.google.com)에 업로드
3. 우클릭 → **Google 슬라이드로 열기** 선택
4. 변환된 Google Slides 파일 공유

### Marp 파일 구조

각 파일 최상단의 YAML 프론트매터로 테마·레이아웃을 정의합니다.

```yaml
---
marp: true
theme: default
paginate: true
size: 16:9
header: 'Claude Code 사내 교육 · Ch.XX'
footer: '© 2026 · Claude Code Docs'
style: |
  section { font-size: 26px; }
  section h1 { color: #CC785C; }
  ...
---
```

슬라이드 구분: `---` (수평선).

---

## 2. Google Apps Script 사용법

### 사전 준비

1. [script.google.com](https://script.google.com) 접속
2. **새 프로젝트** 생성
3. 프로젝트명 변경 (예: "Claude Code 사내 교육 슬라이드 빌더")

### 파일 업로드

Apps Script 에디터 좌측 패널에서 **파일 추가** → 아래 파일들을 순서대로 붙여넣기:

```
_lib.gs                    # 공통 라이브러리 (가장 먼저)
00_main.gs                 # 마스터 러너
01_introduction.gs         # Ch.01
02_quickstart.gs           # Ch.02
...
20_sdk.gs                  # Ch.20
```

> **Tip**: Apps Script 에디터에서는 `.gs` 확장자를 붙이지 않아도 됩니다. 파일 이름만 `_lib`, `00_main` 등으로 입력하면 자동으로 `.gs`가 붙습니다.

### 권한 승인

최초 실행 시 Google 계정 권한 요청 → 승인:

- **Google Slides API** (프레젠테이션 생성·편집)
- **Google Drive API** (파일 목록·공유 URL)

### 실행

**개별 챕터 생성:**
1. 에디터 상단의 함수 드롭다운에서 `buildChapter01` 선택
2. **실행** 버튼 클릭
3. 실행 로그에서 생성된 프레젠테이션 URL 확인
4. Google Drive에서 확인

**전체 20개 일괄 생성:**
```javascript
// 00_main.gs 에서
buildAllChapters()
```

⚠️ **실행 시간 주의**: Apps Script는 단일 실행 최대 **6분** 제한.
20개 전체를 한 번에 돌리면 타임아웃 가능 → **개별 실행 권장**.

### 공통 라이브러리: `_lib.gs`

슬라이드 빌더 헬퍼 함수들:

| 함수 | 용도 |
|---|---|
| `createPresentation(title)` | 새 프레젠테이션 + 기본 슬라이드 제거 |
| `addTitleSlide(p, title, subtitle, meta)` | 표지 |
| `addBulletSlide(p, heading, bullets)` | 불릿 리스트 |
| `addTextSlide(p, heading, body)` | 자유 본문 |
| `addTableSlide(p, heading, rows)` | 표 (첫 행은 헤더) |
| `addTwoColumnSlide(p, heading, lTitle, lItems, rTitle, rItems)` | 2열 비교 |
| `addCodeSlide(p, heading, desc, code, lang)` | 코드 블록 |
| `addSectionDivider(p, number, title, desc)` | 섹션 구분 (다크 배경) |
| `addClosingSlide(p, heading, questions)` | Q&A 마무리 |

**색상 팔레트** (`THEME` 상수):
- `ACCENT` #CC785C (Claude 오렌지)
- `DARK` #1F2937
- `LIGHT_GRAY` #F3F4F6 (코드 배경)

### 커스터마이징

슬라이드 디자인을 변경하고 싶다면 `_lib.gs`의 `THEME` 상수와 각 헬퍼의 좌표/크기/폰트를 수정하세요.

예시: 회사 브랜드 컬러 적용

```javascript
var THEME = {
  ACCENT: '#FF6B35',       // 사내 프라이머리 컬러로
  DARK: '#0F172A',
  LIGHT_GRAY: '#F1F5F9',
  WARNING: '#F59E0B',
  TITLE_BG: '#FFFFFF',
  CODE_BG: '#F1F5F9'
};
```

---

## 콘텐츠 개요 (양 포맷 공통)

| 챕터 | 제목 | Marp | Apps Script |
|---|---|---|---|
| 01 | 소개 | `marp/01-introduction.md` | `apps-script/01_introduction.gs` |
| 02 | 빠른 시작 | `02-quickstart.md` | `02_quickstart.gs` |
| 03 | 설치 | `03-installation.md` | `03_installation.gs` |
| 04 | 작동 원리 | `04-how-it-works.md` | `04_how_it_works.gs` |
| 05 | 메모리와 컨텍스트 | `05-memory-context.md` | `05_memory_context.gs` |
| 06 | 권한 시스템 | `06-permissions.md` | `06_permissions.gs` |
| 07 | 도구 목록 | `07-tools.md` | `07_tools.gs` |
| 08 | CLAUDE.md 설정 | `08-claude-md-config.md` | `08_claude_md_config.gs` |
| 09 | 환경 변수 | `09-env-vars.md` | `09_env_vars.gs` |
| 10 | 설정 파일 | `10-settings.md` | `10_settings.gs` |
| 11 | 인증 | `11-authentication.md` | `11_authentication.gs` |
| 12 | 훅 | `12-hooks.md` | `12_hooks.gs` |
| 13 | MCP 서버 | `13-mcp-servers.md` | `13_mcp_servers.gs` |
| 14 | 멀티에이전트 | `14-multi-agent.md` | `14_multi_agent.gs` |
| 15 | 스킬 | `15-skills.md` | `15_skills.gs` |
| 16 | 커맨드 개요 | `16-commands-overview.md` | `16_commands_overview.gs` |
| 17 | CLI 플래그 | `17-cli-flags.md` | `17_cli_flags.gs` |
| 18 | 슬래시 커맨드 | `18-slash-commands.md` | `18_slash_commands.gs` |
| 19 | 훅 레퍼런스 | `19-hooks-reference.md` | `19_hooks_reference.gs` |
| 20 | SDK 개요 | `20-sdk.md` | `20_sdk.gs` |

각 챕터 슬라이드의 일반적 구성:
1. 표지 (제목 + 서브타이틀 + 메타)
2. 학습 목표
3. 핵심 개념 여러 장
4. 표/비교/코드 예시
5. 실전 예시와 사내 활용 패턴
6. 자주 하는 실수 / 안티패턴
7. 다음 챕터 예고
8. Q&A / 토론 주제

---

## 사내 교육 운영 제안

**1회차 (핵심 기반 · 2시간)**: Ch.01, 02, 04, 06 → 개념 + 실습 온보딩
**2회차 (설정과 메모리 · 1.5시간)**: Ch.05, 08, 10
**3회차 (자동화 · 2시간)**: Ch.12, 15, 19
**4회차 (고급 통합 · 1.5시간)**: Ch.13, 14, 20
**레퍼런스 자료로 제공**: Ch.03, 07, 09, 11, 16, 17, 18

**교육 후 과제:**
- 각 팀이 `CLAUDE.md` 초안 작성 → PR 리뷰
- 팀별 `.claude/settings.json` 권한 규칙 정리
- 반복 작업 하나를 스킬로 전환

---

## 기여 방법

1. 원문 문서(`../01_소개.md` 등)가 변경되면 해당 챕터의 **두 포맷을 함께** 업데이트
2. 커밋 메시지는 `slides(chXX): <내용>` 규칙 권장
3. Marp 변경 시 로컬에서 `marp --preview`로 확인
4. Apps Script 변경 시 해당 `build*` 함수 실행 → 결과 확인

---

## 라이선스 · 출처

원문: [Claude Code 공식 문서 한국어 번역](../00_목차.md)
교육용 재구성물. 사내 교육 목적 사용.
