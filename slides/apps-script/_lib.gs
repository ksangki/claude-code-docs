/**
 * _lib.gs — Claude Code 사내 교육 슬라이드 공통 라이브러리
 *
 * Google Apps Script 프로젝트(script.google.com)의 다른 .gs 파일들이
 * 공통으로 사용하는 슬라이드 빌더 헬퍼 함수들.
 *
 * 사용법:
 *   1. script.google.com 에서 새 프로젝트 생성
 *   2. 이 파일과 chapter .gs 파일들을 각각 추가
 *   3. 원하는 빌드 함수 실행 → 새 Google Slides 프레젠테이션 생성
 */

// Claude Code 색상 팔레트 (Marp 슬라이드와 동일한 컬러 시스템)
var THEME = {
  ACCENT: '#CC785C',     // 오렌지 (제목, 포인트)
  DARK: '#1F2937',       // 다크 그레이 (본문)
  LIGHT_GRAY: '#F3F4F6', // 코드 블록 배경
  WARNING: '#B45309',    // 경고
  TITLE_BG: '#FFFFFF',
  CODE_BG: '#F3F4F6'
};

/**
 * 새 프레젠테이션 생성 후 기본 슬라이드 삭제
 * @param {string} title 프레젠테이션 제목
 * @returns {Presentation} 생성된 프레젠테이션
 */
function createPresentation(title) {
  var presentation = SlidesApp.create(title);
  var defaultSlide = presentation.getSlides()[0];
  defaultSlide.remove();
  return presentation;
}

/**
 * 표지 슬라이드 (타이틀 + 서브타이틀 + 메타)
 */
function addTitleSlide(presentation, title, subtitle, meta) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var titleBox = slide.insertTextBox(title, 40, 150, 880, 100);
  styleText(titleBox, { size: 48, bold: true, color: THEME.ACCENT });

  var subtitleBox = slide.insertTextBox(subtitle, 40, 260, 880, 60);
  styleText(subtitleBox, { size: 24, color: THEME.DARK });

  if (meta) {
    var metaBox = slide.insertTextBox(meta, 40, 430, 880, 40);
    styleText(metaBox, { size: 16, color: '#6B7280' });
  }

  return slide;
}

/**
 * 섹션 제목 + 불릿 리스트 슬라이드
 */
function addBulletSlide(presentation, heading, bullets) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  addHeading(slide, heading);

  var text = bullets.map(function(b) { return '•  ' + b; }).join('\n\n');
  var body = slide.insertTextBox(text, 40, 120, 880, 380);
  styleText(body, { size: 20, color: THEME.DARK });

  addFooter(slide);
  return slide;
}

/**
 * 제목 + 자유 본문(마크다운-like) 슬라이드
 */
function addTextSlide(presentation, heading, body) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addHeading(slide, heading);
  var tb = slide.insertTextBox(body, 40, 120, 880, 380);
  styleText(tb, { size: 20, color: THEME.DARK });
  addFooter(slide);
  return slide;
}

/**
 * 제목 + 표 슬라이드
 * @param {string[][]} rows 첫 행이 헤더
 */
function addTableSlide(presentation, heading, rows) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addHeading(slide, heading);

  var numRows = rows.length;
  var numCols = rows[0].length;
  var table = slide.insertTable(numRows, numCols, 40, 120, 880, 40 + numRows * 50);

  for (var r = 0; r < numRows; r++) {
    for (var c = 0; c < numCols; c++) {
      var cell = table.getCell(r, c);
      cell.getText().setText(rows[r][c]);
      var textStyle = cell.getText().getTextStyle();
      textStyle.setFontSize(r === 0 ? 16 : 14);
      if (r === 0) {
        textStyle.setBold(true);
        textStyle.setForegroundColor('#FFFFFF');
        cell.getFill().setSolidFill(THEME.ACCENT);
      } else {
        textStyle.setForegroundColor(THEME.DARK);
      }
    }
  }

  addFooter(slide);
  return slide;
}

/**
 * 제목 + 2열 비교 슬라이드
 */
function addTwoColumnSlide(presentation, heading, leftTitle, leftItems, rightTitle, rightItems) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addHeading(slide, heading);

  var leftHeader = slide.insertTextBox(leftTitle, 40, 120, 430, 40);
  styleText(leftHeader, { size: 22, bold: true, color: THEME.ACCENT });
  var leftBody = slide.insertTextBox(
    leftItems.map(function(b) { return '•  ' + b; }).join('\n\n'),
    40, 165, 430, 350
  );
  styleText(leftBody, { size: 18, color: THEME.DARK });

  var rightHeader = slide.insertTextBox(rightTitle, 490, 120, 430, 40);
  styleText(rightHeader, { size: 22, bold: true, color: THEME.ACCENT });
  var rightBody = slide.insertTextBox(
    rightItems.map(function(b) { return '•  ' + b; }).join('\n\n'),
    490, 165, 430, 350
  );
  styleText(rightBody, { size: 18, color: THEME.DARK });

  addFooter(slide);
  return slide;
}

/**
 * 제목 + 코드 블록 슬라이드
 */
function addCodeSlide(presentation, heading, description, code, language) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addHeading(slide, heading);

  if (description) {
    var desc = slide.insertTextBox(description, 40, 120, 880, 50);
    styleText(desc, { size: 18, color: THEME.DARK });
  }

  var codeTop = description ? 180 : 120;
  var codeBox = slide.insertTextBox(code, 40, codeTop, 880, 490 - codeTop);
  styleText(codeBox, { size: 14, color: THEME.DARK, mono: true });
  codeBox.getFill().setSolidFill(THEME.CODE_BG);

  addFooter(slide);
  return slide;
}

/**
 * 섹션 구분(챕터 넘기기) 슬라이드
 */
function addSectionDivider(presentation, number, title, description) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide.getBackground().setSolidFill(THEME.DARK);

  var numBox = slide.insertTextBox(number, 40, 150, 880, 80);
  styleText(numBox, { size: 72, bold: true, color: THEME.ACCENT });

  var titleBox = slide.insertTextBox(title, 40, 240, 880, 80);
  styleText(titleBox, { size: 44, bold: true, color: '#FFFFFF' });

  if (description) {
    var descBox = slide.insertTextBox(description, 40, 340, 880, 60);
    styleText(descBox, { size: 20, color: '#D1D5DB' });
  }

  return slide;
}

/**
 * 마무리/Q&A 슬라이드
 */
function addClosingSlide(presentation, heading, questions) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  addHeading(slide, heading);

  var text = questions.map(function(q, i) { return (i + 1) + '. ' + q; }).join('\n\n');
  var body = slide.insertTextBox(text, 40, 140, 880, 360);
  styleText(body, { size: 22, color: THEME.DARK });

  addFooter(slide);
  return slide;
}

// ---------- 내부 헬퍼 ----------

function addHeading(slide, heading) {
  var h = slide.insertTextBox(heading, 40, 40, 880, 60);
  styleText(h, { size: 32, bold: true, color: THEME.ACCENT });

  // 하단 라인
  var line = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, 100, 880, 3);
  line.getFill().setSolidFill(THEME.ACCENT);
  line.getBorder().setTransparent();
}

function addFooter(slide) {
  var footer = slide.insertTextBox('Claude Code 사내 교육 · © 2026', 40, 510, 880, 20);
  styleText(footer, { size: 10, color: '#9CA3AF' });
}

function styleText(textBox, opts) {
  var range = textBox.getText().getTextStyle();
  if (opts.size) range.setFontSize(opts.size);
  if (opts.bold) range.setBold(true);
  if (opts.color) range.setForegroundColor(opts.color);
  if (opts.mono) range.setFontFamily('Roboto Mono');
}

/**
 * 생성된 프레젠테이션의 공유 URL 로그 + 반환
 */
function logUrl(presentation) {
  var url = presentation.getUrl();
  Logger.log('Created: ' + url);
  return url;
}
