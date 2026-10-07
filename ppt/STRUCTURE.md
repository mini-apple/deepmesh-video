# DeepMesh 5분 발표 PPT — 최종 구성

- **파일**: `DeepMesh_발표.pptx` (12장) / 재생성: `python ppt/build_ppt.py`
- **템플릿**: `deepmesh 발표 템플릿.pptx`의 슬라이드를 복제 (표지·파트 구분·본문 크롬·표·Q&A)
- **이미지**: 영상에 실제로 쓰인 에셋만 사용 (`ppt/assets/`)
  - 쿠버네티스 아이콘: pod · api · sa · control-plane · k8s 로고 (SVG → PNG 변환)
  - capture 원본: C1(Anthropic 헤드라인) · C4(Glasswing) · C5(Google Cloud 차트) · k1-off-report · r1_html_compare
  - 로고·마스코트는 템플릿에 포함된 것 그대로
- 다이어그램·표는 PowerPoint 네이티브 도형으로 작성, 각 슬라이드에 발표자 노트(원고·시간) 포함

| # | 슬라이드 | 시간 | 내용 |
|---|---|---|---|
| 1 | 표지 | 10s | 과제명 · 팀 · 지도교수 |
| 2 | Part 1 · 배경 및 문제 | – | 구분 |
| 3 | BACKGROUND | 35s | AI 해킹 자동화: 80~90% (Anthropic 2025.11), 취약점 1만+ (Glasswing 2026.05) |
| 4 | PROBLEM | 40s | 초기 침투 44.5/27.2/21.0% + 클러스터 측면이동 다이어그램 |
| 5 | Part 2 · 시스템 설계 | – | 구분 |
| 6 | ARCHITECTURE | 45s | VM4 클러스터 · Control Plane · 4서비스×replica2 · 사이드카 |
| 7 | DETECTION | 45s | 가로채기→20×5 이미지→KD-CNN→OCSVM→FORWARD/DROP/RELAY, 비지도·지식증류 |
| 8 | Part 3 · 시연 및 결과 | – | 구분 |
| 9 | DEMO | 45s | k1(API 정찰→DROP) · r1(XSS 변조→RELAY) OFF/ON 비교 |
| 10 | RESULT | 35s | 지표 4개 + 서비스별 표 |
| 11 | CONCLUSION | 25s | 기여 3 · 한계 · 향후 과제 |
| 12 | Q&A | – | |

총 약 4분 50초.
