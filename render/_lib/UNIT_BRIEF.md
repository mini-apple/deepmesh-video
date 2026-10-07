# 렌더 단위 제작 지침 (모든 에이전트 공통)

## 프로젝트
부산대 정보컴퓨터공학부 졸업과제 영상. 과제명 "KD-CNN 기반 경량 서비스메시를 활용한 클라우드 네이티브 침입탐지시스템 설계 및 구현". 팀 이름 DeepMesh(신의철, 정의진, 이시하), 지도교수 최윤호. 시청자는 **일반인**이다. 1920×1080, 30fps, 라이트 배경.
화면은 HTML canvas 코드 렌더링: `render/<unit>/scene.js` 의 `draw(t)` → Playwright 캡처 → ffmpeg (`render/_lib/render.py`).

## 반드시 지킬 규칙
- 모든 화면 텍스트는 한국어(기술 용어는 원어 가능). 모든 보고도 한국어.
- **DeepMesh는 팀 이름이다.** 시스템을 가리키는 말로 쓰지 않는다. 구성요소는 "사이드카 프록시", 구조 전체는 "서비스메시".
- 기술 사실·숫자는 `manifests/REPORT_FACTS.md` 에 있는 것만 쓴다. 숫자를 지어내지 않는다. 애매하면 숫자를 빼고 그림으로만 표현한다.
- 쿠버네티스 용어 설명(③)과 측면이동 정의(④)는 교수님 지시라 빠지면 안 되고 또렷해야 한다.
- **정형화된 슬라이드 형식 금지**: `slideFrame`, `slideTitle(s)`, `sectionTag`, `cornerTag` 쓰지 않는다. "PART", 번호 제목, "개념도", "측정값 아님", "연출 이미지", "가상 상황" 같은 보조 표기 금지.
- 매 프레임 `guard(1)` (위 파랑·초록 띠 + 오른쪽 아래 부산대 로고), 마지막에 `drawSubs(t, SUBS)`.
- 자막: `SUBS = [[시작, 끝, '문장', 'norm'|'srt'|'hype']]`. 기본은 'norm'(어두운 반투명 박스 + 흰 글씨, 화면 아래 y≈960~1020). 화면의 큰 글씨가 같은 문장을 그대로 보여줄 때만 'srt'(화면엔 안 그림, 나중 SRT용). 'hype' 는 훅의 애덤(링 아나운서) 대사 같은 강조 전용.
  - 자막 문장은 `script/APPROVED_NARRATION_KR.md` 의 문장(녹음 원문은 `script/TTS_INPUT_KR.md`, 띄어쓰기만 다름)을 한 줄 약 30자 이내 덩어리로 나눈다. 한 덩어리가 한 줄에 들어가게. 영어 표기는 Anthropic 처럼 원어.
  - 타이밍은 실측: ffmpeg `silencedetect` 로 문장·구 경계를 잰다. 쉼 없이 이어지는 구간을 나눌 땐 글자 수 비례로 추정.
    ffmpeg: `C:\Users\UICHEOL\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe` (PATH에 없음)
    예: `ffmpeg -i edit/tts/TTS_03_기초개념.WAV -af silencedetect=noise=-35dB:d=0.25 -f null -`
  - 측정한 경계를 scene.js 머리 주석에 적는다 (02_why/scene.js 처럼).
- 화면 요소는 y≈900 위에 둔다(자막 자리). 오른쪽 아래 로고(약 x 1680~1900, y 1010~1070)와 겹치지 않게.
- 색: 대시보드와 같게 forward=초록 `C.green`, drop=빨강 `C.red`, relay=주황 `C.orange`. 강조 파랑 `C.pnu`, 초록 `C.pnuGreen`, 숫자 강조 `C.gold`.
- **자연스러운 영상**처럼: 카메라 줌·팬(`camAt`/`withCam`), 요소가 미끄러져 들어오고 나가는 전환, 팝(`punch`), 흐르는 점선 트래픽(`flowLine`). 나레이션 박자에 맞춰 움직인다. 멈춘 슬라이드처럼 보이면 안 된다. 텍스트는 핵심 단어만 크게, 문장은 자막이 맡는다.

## 쓸 수 있는 도구 (`render/_lib/common.js`, 수정 금지 — 필요한 함수는 scene.js 안에 정의)
색 `C`, `clamp lerp eo eio P win`, `font rr withAlpha text pill background`, `capCard(k, src, x, y, w, alpha, hl, caption)` (캡처 카드 + 형광펜), `person hacker userIcon packet`, `img imgFit loadAssets(ASSETS)`, `along glitch guard drawSubs`,
공장 비유: `zone(x,y,w,h,label,alpha,k)` 공정 구역(=Pod, k=침해 빨강), `worker(x,y,s,alpha,tag)` 작업자(=컨테이너), `inspector(x,y,s,alpha)` 출구 검사원(=사이드카 프록시, 초록 조끼+방패), `controlRoom(x,y,w,h,alpha,k,label)` 생산관리실(=마스터 노드), `docSheet` 작업 요청서(=트래픽), `partBox` 부품(=응답), `idBadge` 사원증(=서비스 계정 토큰), `verdictMark('forward'|'drop'|'relay', x,y,s,a)`, `flowLine(x1,y1,x2,y2,t,col,a)`, `camAt(t, [[t,fx,fy,z],...])`, `withCam(c, dx, dy, fn)` (초점이 화면 (960,470)), `punch(s,x,y,sz,col,a,age)`, `termCard(비유, 용어, x, y, a, iconKey)`.
참고 구현: `render/02_why/scene.js` (카메라·캡처·자막), `render/01_hook/scene.js` (클러스터 도식, 쿠버네티스 아이콘).
쿠버네티스 공식 아이콘: `assets/kubernetes community main icons-svg/` (resources/, infrastructure_components/, control_plane_components/ 의 labeled·unlabeled). ASSETS 경로는 scene.js 기준 `../../assets/...`. 자료 목록 `assets/ASSETS.md`.

## 작업 순서와 산출물
1. 대본·사실 확인 → 타이밍 측정 → `render/<unit>/unit.json` (`{"audio": "edit/tts/…WAV", "start": 0.0, "duration": 음성길이+0.3, "out": "<unit>_v1.mp4"}`) 과 scene.js 작성.
2. `python render/_lib/render.py render/<unit> --stills 1.0 5.0 …` 로 정지 화면을 충분히(장면마다 1장 이상) 뽑아 **Read 로 직접 보고** 겹침·잘림·빈 화면·자막 충돌을 고친다. 두세 번 반복.
3. 전체 렌더: `python render/_lib/render.py render/<unit>` (길면 백그라운드로 실행하고 완료 확인). 끝나면 still_*.png 는 지운다.
4. 대표 정지 화면 9~12장을 한 장으로 타일링해 `render/<unit>/_review.png` (각 960×540, 3열) 로 저장.
5. 보고: 만든 파일, 장면 구성(시간대별 한 줄), 사실 확인이 애매했던 점. 다른 단위 폴더와 common.js 는 건드리지 않는다.
