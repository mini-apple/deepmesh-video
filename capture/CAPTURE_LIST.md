# CAPTURE_LIST

②·④에 삽입할 실제 기사·보고서 캡처. 2026-09-19 Claude Code가 `_capture.py`로 직접 캡처했다(헤드리스 브라우저, 쿠키 배너는 동의 없이 숨김).
영상에서는 코드 렌더링 화면 안에 캡처를 넣고, 핵심 문장에 형광펜 강조를 얹는다. 핵심 문장 위치는 `_capture_meta.json`에 있다.

## 캡처 결과

| 파일 | 출처 · 날짜 | 핵심 문장 (원문) | 쓰는 곳 |
|---|---|---|---|
| `C1_anthropic_headline_view.png` / `_crop.png` | Anthropic 발표 "Disrupting the first reported AI-orchestrated cyber espionage campaign" · 2025-11-13 · https://www.anthropic.com/news/disrupting-AI-espionage | 제목 + 날짜 | ② "2025년 11월 앤트로픽 보고서에 따르면" |
| `C2_anthropic_8090_crop.png` / `_page.png` | 같은 발표의 보고서 PDF 3쪽 · https://assets.anthropic.com/m/ec212e6566a0d47/original/Disrupting-the-first-reported-AI-orchestrated-cyber-espionage-campaign.pdf | "…reconnaissance, vulnerability discovery, exploitation, **lateral movement**, credential harvesting… **80-90% of tactical operations independently**…" | ② "80에서 90퍼센트를 AI가 스스로… 옆 시스템으로 번지는 것까지요" (한 문단에 두 근거가 다 있음) |
| `C3_lateral_movement_view.png` / `_crop.png` | Lowenstein Sandler Client Alert · 2025-11-18 | "reconnaissance, exploitation, credential harvesting, lateral movement, and data exfiltration" | 예비 (C2로 충분하면 안 씀) |
| `C4_glasswing_10000_view.png` / `_crop.png` | Anthropic "Project Glasswing: Initial Update" · 2026-05-22 · https://www.anthropic.com/research/glasswing-initial-update | "**After one month**, most partners have each found hundreds of critical- or high-severity vulnerabilities… Collectively, they've found **more than ten thousand**." | ② "2026년에는 약 50개 기관이 AI로 한 달 남짓 만에 심각한 취약점을 만 개 넘게" |
| `C5_gcloud_threat_crop.png` / `_page.png` | Google Cloud "Cloud Threat Horizons Report H1 2026" 7쪽 차트 (2025년 하반기 데이터) | H2 2025 Distribution of Initial Access Vectors: 소프트웨어 취약점 44.5% / 약하거나 없는 인증 27.2% / 설정 오류 21.0% | ④ 04-2 통계 |
| `C5b_gcloud_text_crop.png` / `_page.png` | 같은 보고서 6쪽 본문 | "third-party software-based entry (44.5%)… weak or absent credential entry fell from 47.1% in H1 to 27.2% in H2" | 예비 |

- "약 50개 기관"의 근거: C4 원문 "approximately 50 partners" (같은 글).
- C4는 처음에 "Expanding Project Glasswing"(2026-06-02) 글을 찍었으나 "한 달" 근거가 없어, 원문이 연결한 Initial Update 글로 바꿨다. 이전 캡처는 `_old/`에 있다.

## 표기 규칙

- 캡처마다 화면 하단에 출처와 날짜를 작게 표기한다. 예: `출처: Anthropic, 2025.11.13`
- 본문을 길게 노출하지 않는다. 핵심 문장 한두 줄만 확대하고 나머지는 흐리게 처리한다.
- C5는 2025년 하반기 데이터임을 함께 표기한다.
