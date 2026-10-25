# 재의 성약 · Ashen Covenant 가이드

[가이드 열기](https://bear2u.github.io/Ashen-Covenant-guide/)

기존 Ashen Covenant 문서 19개를 Nimbus + Astro로 제공하는 한국어 정적 문서 사이트입니다. 시작하기, 성장·전투, 아이템, 세계, 빌드, 저장, 개발 참고와 업데이트를 제공합니다. 한국어 검색, 모바일 목차, 테마 전환, 문서별 목차 및 Markdown 보기를 지원합니다.

## 개발

Node.js 24 이상을 사용합니다.

```sh
npm ci
npm run dev
npm run check
npm run preview
```

기본 주소 경로는 `/Ashen-Covenant-guide/`입니다. 검색은 빌드 후 preview 또는 배포 사이트에서 확인합니다.

## 문서 관리

- `content-source/`: 기존 게임 문서의 원문 스냅샷입니다. 독립적으로 복제한 저장소에서는 여기서 문서를 수정합니다.
- `scripts/doc-pages.json`: 원문 파일과 사이트 경로·제목·설명·순서의 대응표입니다.
- `npm run build`: 스냅샷을 `src/content/docs/`의 카테고리 페이지로 변환하고 `.md` 문서 간 링크를 자동으로 변환합니다.
- `npm run sync:game`: 이 작업 공간에서 `../../AshenCovenant/docs`를 다시 가져옵니다. 현재 스냅샷을 교체하므로 양쪽 문서를 동시에 수정했다면 먼저 차이를 확인하세요.
- `src/content/docs/updates/`: 사이트 고유 업데이트 내역입니다. 자동 동기화로 덮어쓰지 않습니다.
- `public/images/cathedral.jpg`: 게임에 적용한 Runway 성당 아트입니다.

현재 사이트는 게임 소스 전체, 세이브, 생성 도구 인증정보를 포함하지 않습니다. 개발 참고 문서에 나오는 소스 경로는 게임 프로젝트 기준입니다.

## 배포

`main`에 push하면 `.github/workflows/pages.yml`이 타입 검사, 빌드, 문서 검사, 내부 링크 검사 후 GitHub Pages에 배포합니다. 저장소 Pages의 Source는 **GitHub Actions**입니다.

- 사이트: `https://bear2u.github.io/Ashen-Covenant-guide/`
- 설정: `astro.config.ts`, `scripts/deployment.ts`
- 배포 대상은 `dist/`만입니다. 게임 실행 파일은 포함하지 않습니다.

## 기반과 라이선스

[uw2-hd-guide](https://github.com/bear2u/uw2-hd-guide)의 Nimbus 컴포넌트와 한국어 문서 구성을 기반으로 재의 성약에 맞게 구성했습니다. Nimbus MIT 고지는 `licenses/Nimbus-MIT.txt`, 한국어 글꼴 OFL 고지는 `public/fonts/NotoSansKR-OFL.txt`에 보존했습니다.

설정 참고: [Nimbus configuration](https://nimbus-docs.com/reference/configuration/), [Astro GitHub Pages](https://docs.astro.build/en/guides/deploy/github/).
