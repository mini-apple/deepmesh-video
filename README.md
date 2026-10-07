# DeepMesh 졸업과제 설명·시연 영상

부산대학교 정보컴퓨터공학부 2026 졸업과제 **DeepMesh**
(KD-CNN 기반 경량 서비스메시를 활용한 클라우드 네이티브 침입탐지시스템 설계 및 구현)의
설명·시연 영상과 5분 발표 자료를 만드는 프로젝트입니다.

- 최종 영상: `edit/DeepMesh_full_preview.mp4` — 1920×1080, 30fps, 약 9분 23초
- ⑥ 시연 구간을 제외한 모든 장면을 HTML Canvas 코드로 그리고 Playwright로 프레임을 찍어 ffmpeg로 인코딩합니다.

## 구성

| 경로 | 내용 |
|---|---|
| `render/<구간>/scene.js` | 구간별 장면 코드 (`draw(t)`), 자막 `SUBS` |
| `render/<구간>/unit.json` | 음성 파일·시작·길이·출력 파일명 |
| `render/<구간>/*_vN.mp4` | 구간별 렌더 결과 (가장 높은 N이 최신) |
| `render/_lib/` | 공통 그리기(`common.js`), 렌더러(`render.py`), 시연 조립(`build_demo.py`), 전체 조립(`assemble.py`) |
| `edit/tts/` | 구간별 나레이션 음성(TTS)과 자막 SRT |
| `script/` | 대본 (`TTS_INPUT_KR.md`가 최종 기준) |
| `manifests/` | 보고서 팩트 시트, 타이밍, 렌더 맵 |
| `assets/`, `capture/` | 쿠버네티스 아이콘, 로고, 사례 자료·시연 캡처 |
| `ppt/` | 5분 발표 덱 빌드 스크립트 (`build_ppt.py`) |

## 렌더링

```bash
python render/_lib/render.py render/03_basics   # 구간 하나 렌더
python render/_lib/build_demo.py                 # ⑥ 시연 구간(06a/06b/06c) 조립
python render/_lib/assemble.py                   # 전체 영상 조립 -> edit/DeepMesh_full_preview.mp4
```

필요한 것: Python 3.9+, `playwright`(Chromium), `Pillow`, ffmpeg.
ffmpeg 경로와 일부 작업 폴더 경로가 스크립트에 로컬 절대경로로 들어 있으니, 다른 PC에서는 먼저 맞춰 주어야 합니다.

## 저장소 메모

- mp4·wav 등 대용량 미디어는 **Git LFS**로 관리합니다. 클론 전에 `git lfs install`을 해 두세요.
- 팀 문서(최종보고서, 포스터, 발표 템플릿)는 이 저장소에 포함하지 않았습니다.
- `capture/`의 기사·보고서 캡처와 원본 PDF는 각 출처(Anthropic, Google Cloud 등)의 자료로, 영상 인용 근거로만 보관합니다.

## 팀

신의철 · 정의진 · 이시하 / 지도교수 최윤호
