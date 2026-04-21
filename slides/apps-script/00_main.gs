/**
 * 00_main.gs — 전체 20개 챕터 일괄 생성 / 개별 실행 엔트리
 *
 * 실행 방법:
 *   • buildAllChapters()  — 20개 챕터 모두 생성 (각각 별도 프레젠테이션)
 *   • buildChapter01()    — 특정 챕터만 생성
 *
 * 주의:
 *   - 전체 실행 시 Google Drive에 20개의 새 파일이 생성됩니다.
 *   - 최초 실행 시 권한 승인 필요 (SlidesApp, DriveApp).
 *   - 동시 실행 제한(6분 실행 시간)을 피하기 위해 개별 실행 권장.
 */

function buildAllChapters() {
  var results = [];
  var builders = [
    buildChapter01, buildChapter02, buildChapter03, buildChapter04, buildChapter05,
    buildChapter06, buildChapter07, buildChapter08, buildChapter09, buildChapter10,
    buildChapter11, buildChapter12, buildChapter13, buildChapter14, buildChapter15,
    buildChapter16, buildChapter17, buildChapter18, buildChapter19, buildChapter20
  ];

  for (var i = 0; i < builders.length; i++) {
    try {
      var url = builders[i]();
      results.push('Ch.' + (i + 1) + ': ' + url);
    } catch (e) {
      results.push('Ch.' + (i + 1) + ' FAILED: ' + e.message);
    }
  }

  Logger.log(results.join('\n'));
  return results;
}

/**
 * 선택한 챕터만 생성 (Apps Script 에디터에서 함수 선택 → 실행)
 */
function buildSelected() {
  // 원하는 챕터 번호로 수정하세요.
  return buildChapter01();
}
