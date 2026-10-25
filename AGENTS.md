# Ashen Covenant 가이드 작업 규칙

- 이 저장소는 Nimbus + Astro 기반 정적 문서 사이트다. 게임 실행 파일과 세이브·인증정보를 포함하지 않는다.
- Node 24와 고정된 lockfile을 사용한다.
- 게임 문서는 `content-source/`를 수정한다. 자동 생성된 `src/content/docs/` 문서는 직접 수정하지 않는다. 단, 사이트 고유 `updates/`는 직접 관리한다.
- 기존 문서의 수치와 미검증 표시를 임의로 바꾸지 않는다. 개발 문서도 요청 범위에 포함되어 있으므로 `reference/` 분류에 유지한다.
- 공개 변경은 Asia/Seoul 날짜의 `src/content/docs/updates/YYYY-MM-DD.mdx`에 기록한다.
- 배포 전 `npm run check`를 통과시키고, 저장소 하위 경로·한국어 검색·모바일 목차를 확인한다.
