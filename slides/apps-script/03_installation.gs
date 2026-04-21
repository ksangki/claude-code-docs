/**
 * Ch.03 설치 상세 가이드 — Google Slides 빌더
 */

function buildChapter03() {
  var p = createPresentation('Claude Code 사내 교육 · Ch.03 설치');

  addTitleSlide(p, 'Ch.03 설치 상세 가이드',
    'macOS · Linux · Windows(WSL) 플랫폼별 설치와 문제 해결',
    '실무자 과정 · 사내 교육 자료');

  addBulletSlide(p, '학습 목표', [
    '세 가지 OS 환경에서 권장 설치 절차 파악',
    '권한 문제(npm prefix, sudo)를 회피하는 올바른 방법',
    'nvm / fnm Node 버전 관리자 도입',
    '업데이트 / 제거 절차',
    '흔한 트러블슈팅 6가지와 해결'
  ]);

  addCodeSlide(p, '공통 요구사항',
    'Node.js 18+, npm. Claude Code는 시작 시 Node.js 버전을 직접 확인.',
    '# 버전 확인\n' +
    'node --version    # 18 이상\n' +
    'npm --version\n\n' +
    '# 설치 (모든 플랫폼 공통)\n' +
    'npm install -g @anthropic-ai/claude-code\n' +
    'claude --version'
  );

  addCodeSlide(p, 'macOS: npm 권한 수정 (옵션 A)',
    '전역 설치 시 권한 오류가 발생하면 npm prefix를 홈 디렉토리로 변경.',
    'mkdir -p ~/.npm-global\n' +
    'npm config set prefix ~/.npm-global\n\n' +
    '# 셸 프로파일에 추가 (~/.zshrc 또는 ~/.bash_profile)\n' +
    'export PATH=~/.npm-global/bin:$PATH\n\n' +
    '# 적용 후 설치\n' +
    'source ~/.zshrc\n' +
    'npm install -g @anthropic-ai/claude-code'
  );

  addCodeSlide(p, 'macOS: Node 버전 관리자 (옵션 B)',
    'nvm / fnm을 쓰면 전역 권한 문제를 완전히 회피. 사내 권장.',
    '# nvm 예시\n' +
    'nvm install --lts\n' +
    'nvm use --lts\n' +
    'npm install -g @anthropic-ai/claude-code\n\n' +
    '# 여러 프로젝트가 다른 Node 버전을 요구할 때 필수'
  );

  addCodeSlide(p, 'Linux: nvm 권장',
    'sudo npm install -g 는 권장하지 않음 — 이후 권한 꼬임 원인.',
    '# nvm 설치\n' +
    'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash\n\n' +
    '# 셸 다시 로드 후\n' +
    'nvm install --lts\n' +
    'nvm use --lts\n\n' +
    '# Claude Code 설치\n' +
    'npm install -g @anthropic-ai/claude-code'
  );

  addCodeSlide(p, 'Windows (WSL) 필수',
    'WSL 안에서만 실행. CMD/PowerShell 직접 실행은 지원 안 됨.',
    '# 1. PowerShell (관리자) → WSL 설치\n' +
    'wsl --install\n\n' +
    '# 2. Ubuntu 실행 또는 wsl 명령\n' +
    '# 3. WSL 안에서 Node.js 설치 (nvm 사용)\n' +
    'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash\n' +
    'source ~/.bashrc\n' +
    'nvm install --lts && nvm use --lts\n\n' +
    '# 4. Claude Code 설치\n' +
    'npm install -g @anthropic-ai/claude-code'
  );

  addTextSlide(p, 'Windows 성능 Tip',
    '프로젝트 파일은 WSL 파일시스템(~/projects/) 내부에 둘 것.\n\n' +
    '/mnt/c/… 경유 Windows 파일 접근은 현저히 느림.\n\n' +
    '권장 배치:\n' +
    '• WSL 홈 안에 git clone\n' +
    '• VS Code "Remote - WSL" 확장 사용\n' +
    '• 빌드 결과물도 WSL 안에 유지'
  );

  addCodeSlide(p, '업데이트와 제거',
    '두 가지 업데이트 방법, 제거 시 설정 디렉토리는 수동.',
    '# 업데이트\n' +
    'npm update -g @anthropic-ai/claude-code\n' +
    '# 또는\n' +
    'claude update\n\n' +
    '# 제거\n' +
    'npm uninstall -g @anthropic-ai/claude-code\n\n' +
    '# 설정 디렉토리 수동 삭제 (주의: 세션 트랜스크립트 포함)\n' +
    'rm -rf ~/.claude'
  );

  addTableSlide(p, '트러블슈팅 개요', [
    ['증상', '원인 / 해결'],
    ['claude 커맨드 못 찾음', 'npm bin이 PATH에 없음 → export PATH'],
    ['Node 18 미만 오류', 'nvm/fnm으로 업그레이드'],
    ['권한 거부 (EACCES)', 'sudo 대신 npm prefix 변경'],
    ['OAuth 실패', 'ANTHROPIC_API_KEY 사용'],
    ['Docker/CI 환경', 'API 키 + -p + --dangerously-skip-permissions'],
    ['WSL 외부 실행', 'WSL 안에서만']
  ]);

  addCodeSlide(p, 'Docker / CI 환경',
    '비대화형 인증과 권한 프롬프트 건너뛰기. 샌드박스 필수.',
    'export ANTHROPIC_API_KEY=sk-ant-...\n\n' +
    '# 일회성 실행\n' +
    'claude -p "테스트 스위트를 실행하고 실패를 보고해줘"\n\n' +
    '# 권한 프롬프트 없이 (격리 환경 전용)\n' +
    'claude --dangerously-skip-permissions -p "..."\n\n' +
    '# 이 플래그는 인터넷 접근 없음 + 비-root 샌드박스에서만'
  );

  addTableSlide(p, '사내 권장 설치 패턴', [
    ['환경', '권장 조합'],
    ['개발자 macOS/Linux', 'nvm + LTS Node + OAuth'],
    ['개발자 Windows', 'WSL2 + Ubuntu + nvm + OAuth'],
    ['CI / 배포 파이프라인', '공식 Node 18+ 이미지 + API Key'],
    ['격리된 자동화', '샌드박스 + --dangerously-skip-permissions'],
    ['엔터프라이즈 다수 사용자', '배포 이미지 사전 설치 + Managed settings']
  ]);

  addClosingSlide(p, 'Q&A / 실습', [
    '지금 바로 본인 머신에서 claude --version 실행',
    '회사 CI에 이미 Node 18+가 있는지 확인',
    '사내 배포 이미지에 Claude Code를 포함시킬 경우 고려할 보안 이슈는?'
  ]);

  return logUrl(p);
}
