# 저장과 데이터

코드: `src/rules/save.js`, `src/rules/inventory.js`(`freshProfile`)

## 저장 위치

| 키 | 내용 |
| --- | --- |
| `localStorage['ashen-covenant-save']` | 현재 저장 (JSON, `version: 3`) |
| `localStorage['ashen-covenant-save-v2-backup']` | 버전 2 저장을 옮길 때 남긴 원본 (처음 한 번만 기록) |

- 브라우저마다, 주소(origin)마다 따로 저장됩니다. `127.0.0.1:5173`과 `192.168.x.x:5173`은 서로 다른 저장입니다. 휴대폰과 PC도 따로입니다.
- 브라우저의 사이트 데이터를 지우면 저장도 사라집니다.

## 언제 저장되나

획득, 장착, 판매, 구매, 잠금, 소켓, 조합, 레벨업, 포인트 배분, 구역 정화, 보스 처치, 사망, 귀환, 거점 진입, 설정 변경마다 저장합니다. 따로 저장 버튼은 없습니다.

## 저장 형식 (버전 3)

```js
{
  version: 3,
  level: 1, xp: 0, gold: 60,
  attrs: { str: 0, dex: 0, vit: 0, ene: 0 },   // 투자한 포인트 (기본값 20/20/20/15는 제외)
  skills: { brand: 1, whirl: 1 },              // 하드 포인트
  slots: { rmb: 'whirl', q: 'brand', r: null }, // 기술 칸
  equipment: { weapon, helm, armor, gloves, boots, belt, ring1, ring2, amulet },
  bag: [],          // 최대 40
  stash: [],        // 최대 60
  materials: {},    // { 'gem-ruby-2': 3, 'rune-5': 1 } 종류당 1~99
  unlocked: 1,      // 해금된 최고 난도
  difficulty: 1,    // 마지막으로 고른 난도
  settings: { volume: 0.6, shake: true, quality: 'auto' },
  claimed: [],      // 한 번이라도 얻은 아이템 ID (복제 방지)
  rewards: [],      // 받은 일회성 보상 키 ('starter')
  tutorialDone: false,
  record: { kills, clears, deaths, bestTime, bossKills: { 1: 0, 2: 0, 3: 0 } },
}
```

### 아이템

```js
{
  id: 'it-…',            // 고유 ID
  baseId: 'knight-sword',
  quality: 'magic',      // low normal superior magic rare set unique crafted
  ilvl: 12,
  affixes: ['p3', 's40'],// 옵션 ID
  rolls: { ed: 34 },     // 굴린 수치
  extra: {},             // 우수·낡은의 고정 보정
  defRoll: null,         // 방어구의 기반 방어 굴림
  sockets: 2, socketed: ['rune-2', 'rune-1'],
  runeword: 'rw-ember-vow',
  uniqueId: null, setPieceId: null, rareName: null,
  variant: null,         // 반지·부적 아이콘 0~3
  locked: false,
}
```

## 검증

불러올 때와 저장할 때 모두 `validateProfile`로 검사합니다. 하나라도 어긋나면 저장을 거부하거나 불러오기를 막습니다.

- 버전이 3이 아님
- 레벨 1~40 범위 밖, 경험치·골드가 음수이거나 숫자가 아님
- 능력치 포인트를 레벨보다 많이 씀
- 기술: 하드 포인트 1~20 범위 밖, 해금 레벨 미달, 선행 기술 없음, 포인트 초과 사용, 시작 기술 누락
- 기술 칸에 배우지 않은 기술이나 패시브 기술
- 가방 40개·보관함 60개 초과
- 장비 칸 수가 9가 아님, 칸에 맞지 않는 종류
- 아이템: 없는 기반, 없는 등급, 아이템 레벨 1~60 밖, 그 종류에 붙을 수 없는 옵션, 모르는 수치 키, 방어 굴림 이상, 소켓 수가 기반 최대 초과, 넣은 것이 소켓 수보다 많음, 없는 재료·룬워드, 고유·세트의 기반이 다름
- 가방·보관함·장비 칸 전체에서 아이템 ID가 겹침
- 재료가 없는 ID이거나 1~99 밖
- 해금 난도와 선택 난도가 1~3 밖이거나 선택이 해금보다 높음
- 설정 값이 범위 밖

## 손상된 저장

- JSON이 깨졌거나 검증에 실패하면 **원본을 그대로 둔 채** 이어하기를 막고 "저장 데이터가 손상되었거나 호환되지 않습니다. 원본은 그대로 보존했습니다."를 보여 줍니다.
- 불러오기는 절대 저장소에 쓰지 않습니다.
- 새 게임을 누르면 확인을 한 번 더 받은 뒤 덮어씁니다. 원본을 살리고 싶다면 그 전에 개발자 도구에서 `localStorage.getItem('ashen-covenant-save')` 값을 복사해 두세요.

## 버전 2 저장 옮기기

성장 시스템 개편 전(버전 2) 저장으로 이어하기를 누르면 자동으로 버전 3으로 옮깁니다.

| 항목 | 처리 |
| --- | --- |
| 레벨, 골드, 해금 난도, 선택 난도, 설정, 기록, 받은 보상, 아이템 ID | 그대로 유지 |
| 경험치 | 0으로 (레벨은 유지) |
| 옛 패시브 | 모두 포인트로 돌려줌 (레벨에 맞는 능력치·기술 포인트) |
| 난도별 보스 처치 | 해금 상태로 추정 (고행 해금 = 순례 보스 처치) |
| 옛 장비 | 새 기반으로 대응 (예: `storm-sword` → 기사검, `ember-cleaver` → 처형인의 대검, `crimson-mail` → 사슬 갑주, 옛 반지·부적 → 반지·부적) |
| 옛 옵션 | 공격력 → 최대 피해, 방어 → 방어력, 공속·화염·번개 % → 새 % 옵션, 뇌격·파열 → 단일 기술 +1 |
| 옛 등급 | 일반·마법·희귀 그대로. 장신구가 일반이면 마법 |
| 아이템 레벨 | 옛 단계 1·2·3 → 5·18·30 |
| 능력치 | 착용 장비의 힘·민첩 요구치만큼 먼저 배분 |

옮긴 결과도 검증을 거치고, 통과해야만 저장합니다. 원본은 `ashen-covenant-save-v2-backup`에 남습니다.

## 저장 지우기 (개발용)

브라우저 개발자 도구 콘솔에서:

```js
localStorage.removeItem('ashen-covenant-save');
```
