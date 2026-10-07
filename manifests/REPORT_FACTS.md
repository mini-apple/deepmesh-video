# REPORT_FACTS — 최종보고서 검증 팩트 시트 (영상 렌더링용)

1차 출처: `C:\Users\UICHEOL\Desktop\Capstone\3_최종보고서\제출파일\2026전기_최종보고서_42_DeepMesh_...pdf` (79쪽 전부 확인, 2026-09-19)
2차 출처: 포스터 PDF, `DeepMesh_대시보드_API_명세.md`
쪽 번호는 **인쇄 쪽 번호** (PDF 쪽 = 인쇄 쪽 + 4). 인용은 원문 그대로.

> 영상에 들어가는 기술 사실은 이 파일에 있는 것만 쓴다 (사양서 D-R 절).

---

## 1. Traffic Converter (패킷 → 이미지)

### 최종 채택 = semantic 20차원
- p.27 "본 연구는 각 패킷을 원시 바이트 대신 파싱된 20차원의 의미 기반 벡터로 인코딩한다."
- p.61 raw-byte(5×1479)는 대조 실험용 ("Converter만 raw-byte(5×1479)로 교체한 학생 모델과의 대조 실험")
- p.72 "의미 기반 semantic 표현이 raw-byte 표현보다 공격을 잘 감지한다는 것을 정량적으로 입증"

| 항목 | raw-byte (대조군) | **semantic (최종 배포)** |
|---|---|---|
| 패킷 1개 | 헤더 19B + 페이로드 1460B = 1479차원 | **20차원 의미 벡터** |
| 윈도우 | 5 패킷 | **5 패킷** |
| 크기 | 5×1479 = 7,395픽셀 | **20×5 = 100픽셀** (약 74배 작음, p.61) |
| 방향 | 행=패킷 | **세로 = feature(20), 가로 = packet(5)**. 입력 `(batch,1,20,5)` (p.35), 그림 "20×5×1" |

- 값 범위 [0,1] 클립 (p.37) → 흑백 이미지로 표현 가능. p.63은 "(5x20)"로 표기가 어긋남.

### 20개 feature (그림 19, p.28) — 서비스별 3종

| f | http_features (post, comment) | fe_features (frontend) | flow_features (auth / K8s API) |
|---|---|---|---|
| f0 | GET | 요청 | dst 443/6443 |
| f1 | POST | 응답 | dst 3306 |
| f2 | PUT | GET | dst 8080 |
| f3 | DELETE | 쓰기 계열 | dst ≥ 32768 |
| f4 | 기타 메서드 | scan signature | dst 22/9000 |
| f5 | (판독 불확실) | /api/ /internal/ | TLS record |
| f6 | /internal/ | 경로 깊이 | SYN |
| f7 | /api/ | 경로 길이 | FIN/RST |
| f8 | 쿼리스트링 | numeric segment | payload 존재 |
| f9 | 경로 깊이 | 2xx | < 100B |
| f10 | 경로 길이 | 3xx | < 500B |
| f11 | numeric segment | 4xx | < 1000B |
| f12 | 마지막 numeric ID | 5xx | ≥ 1000B |
| f13 | numeric 비율 | text/html | 크기 정규화 |
| f14 | scan signature | JS/CSS | reserved |
| f15 | 쓰기 메서드 | Content-Length | reserved |
| f16 | Authorization | HMAC byte 0 | reserved |
| f17 | injection signature | HMAC byte 1 | dst 53 (DNS) |
| f18 | Δt | Δt | Δt |
| f19 | 5-packet volume | 5-packet volume | 5-packet volume |

- http: "응답은 이미지화하지 않는다"(p.28). fe: 요청+응답 모두, 응답 본문 HMAC 지문 2바이트. flow: "페이로드를 파싱하지 않고 목적지 포트, TCP 플래그, 페이로드 크기 구간, TLS 레코드 여부 등 메타 정보"(p.29).
- 라우팅(p.29~30): 목적지 443/6443/22/9000 → flow. 그 외 post/comment → http(파싱 불가면 이미지화 안 함). frontend → fe. auth → 항상 flow.

### ⚠ 마스킹: 보고서에 서술 없음
- IP/포트를 가린다는 서술이 전혀 없다. 오히려 **목적지 포트·경로 접두(/api/, /internal/)가 feature로 들어간다.**
- "ID나 payload 같은 가변 요소를 제거"는 **Request Verifier 시그니처** 이야기다(p.16, p.41). 이미지와 무관.

### 세션·윈도우
- "어느 주소에서 어느 주소로 가는 통신인지를 기준으로 패킷들을 하나의 세션으로 묶는다"(p.13)
- "5개 패킷을 세션 단위로 시간 순서에 따라 쌓아"(p.27), 슬라이딩 윈도우(가장 오래된 벡터 제거 후 새 벡터 추가, p.30)
- 수집 지점: Pod 내부 loopback (p.26)

## 2. 모델

입력 20×5×1 → 출력 (B,128) 임베딩. (그림 22~27, p.35~36)

| 모델 | 구조 요약 | 파라미터 |
|---|---|---|
| Teacher | Conv3×3→32 → Conv3×3→64 → AvgPool 4×4 → FC 1024→256 → 256→128 | **314.69K** |
| 1x8 | Conv→8 → AvgPool 1×1 → FC 8→128 | 1.23K |
| 1x16 | Conv→16 → AvgPool 2×2 → FC 64→64→128 | 12.64K |
| 2x8 | Conv→4 → Conv→8 → AvgPool 2×2 → FC 32→32→128 | 5.69K |
| 2x16 | Conv→8 → Conv→16 → AvgPool 2×2 → FC 64→64→128 | 13.87K |
| 2x32 | Conv→16 → Conv→32 → AvgPool 4×4 → FC 512→128→128 | 87.26K |

- **배포 모델: auth 1x16, post 1x8, comment 2x8, frontend 2x8** (p.57~60, p.72)
- Teacher: NT-Xent 대조학습(같은 이미지 + 노이즈 두 view), **배포되지 않음**(p.34, p.37). 보고서 표현은 "크고 표현력이 높은".
- KD: Teacher·Student 임베딩 간 **MSE** 최소화(p.37)
- "CNN 학습에는 정상 트래픽만 사용한다"(p.31). OCSVM(RBF)이 정상 임베딩 경계를 학습(p.37).
- 단, **임계값 재보정에는 공격 이미지를 사용**(CNN 고정, gamma/nu/threshold 조정, p.38). 실패 시 ROLLBACK(잠정 임계값).

## 3. 결과 (CPU, batch 1, 스레드 1, Windows 11 오프라인 평가, p.49)

**배포 모델**

| 서비스 | 모델 | 파라미터 | 재보정 | Precision | **Recall** | **FPR** | ROC-AUC |
|---|---|---|---|---|---|---|---|
| auth | 1x16 | 12.64K | OK | 91.63 | **86.67** | **0.32** | 0.9119 |
| post | 1x8 | 1.23K | OK | 100.00 | **96.29** | **0.00** | 0.9985 |
| comment | 2x8 | 5.69K | OK | 96.61 | **95.54** | **1.30** | 0.9815 |
| frontend | 2x8 | 5.69K | **ROLLBACK** | 99.69 | **100.00** | **0.93** | 1.0000 |

- frontend는 "검증된 운영 임계값이 아니라 학습 시점의 잠정값"(p.60).
- Teacher는 4개 서비스 모두 ROLLBACK, post FPR 11.05%.
- 시나리오별(배포 모델): auth k1 97.71%·k2 96.81%·cred_enum 42.97% / post k1·k2·l3·enum_seq 100%, l2 0% / comment k1·k2 100%, l3 80%, enum_seq 88.54%, l2 0% / frontend r1 100%(120,408장 중 2장 놓침), k1·k2·scan_seq 100%.

**Detector latency (ms/img, t0→t3 = 텐서 변환+CNN+OCSVM, 표 24)**

| 서비스 | teacher | 1x8 | 1x16 | 2x8 | 2x16 | 2x32 |
|---|---|---|---|---|---|---|
| auth | 0.685 | 0.4895 | **0.3831** | 0.4972 | 0.4408 | 0.5055 |
| post | 0.671 | **0.3615** | 0.3642 | 0.6112 | 0.4419 | 0.5233 |
| comment | 0.677 | 0.5062 | 0.5148 | **1.1294** | 0.9066 | 0.6108 |
| frontend | 0.713 | 0.7461 | 0.5468 | **0.8049** | 0.6235 | 0.8531 |

- "0.36~1.13ms" = 배포 모델 최소(post 1x8)~최대(comment 2x8). **모델 추론만 잰 값**이며 PCAP 읽기·특징 추출·Relay/Verifier 왕복은 측정 밖.
- "314.69K → 1.2K~12.6K" = Teacher → 배포 학생 최소/최대 (포스터와 동일).
- comment 2x8은 teacher보다 66.9% 느림 (p.55). **"89% 감소", GPU 추론 수치, mean/p95 표, Relay 추가 지연은 보고서에 없음.**

## 4. 사이드카 파이프라인

- 구성: Traffic Handler(가로채기·세션화·최종 처리) / Traffic Converter / Anomaly Detector (p.13)
- iptables(InitContainer): ingress 8080→9011(RELAY 전용), egress 모든 TCP→9011 (p.25)
- **검사 대상은 outbound(요청·응답)만**, inbound 요청은 검사 없이 전달 (p.11, p.17)

**요청 → DROP (p.16~17)**: 가로채기 → 이미지화 → 판정 → 정상이면 FORWARD → 이상이면 가변 요소를 뺀 **시그니처**를 Request Verifier에 전송 → **같은 서비스 다른 replica의 관측 이력** 확인 → 있으면 cleared로 FORWARD, 없으면 DROP("연결을 열기 전에 처리를 종료").

**응답 → RELAY (p.17~18)**: inbound 요청은 그대로 전달, 그 **응답**을 판정 → 이상이면 Pod Info Provider가 **미리 push한 주소록**으로 형제 replica에 같은 요청(이때 Control Plane 통신 없음) → 본문 비교 → 같으면 원래 응답 FORWARD, 다르면 참조 응답으로 교체(RELAY). **GET/HEAD/OPTIONS만**, 재요청엔 재탐지 방지 헤더. 응답을 이미지화하는 서비스는 frontend뿐 → 사실상 frontend 전용.

## 5. Control Plane (p.21, p.40~42)

- 마스터노드의 **Python 프로그램**(Pod 아님), 사이드카와 HTTP 통신.
- Pod Info Provider: K8s API 주기 조회 → {서비스명: Pod IP 목록} → 각 사이드카에 형제 목록 push.
- Request Verifier: 시그니처(`HTTP: <METHOD>|<HOST>|<정규화 경로>|q:<쿼리 키>|b:<본문 스키마>`, `비HTTP: TCP|<목적지 IP:포트>`)로 관측 이력 조회, 일정 시간 후 만료. allow True/False 응답, 실제 차단은 Handler가 결정.

## 6. 테스트 환경 (p.21, p.31)

- Dell T7610 위 Vagrant+KVM **VM 4대**: 마스터 1(4vCPU/8GB) + 워커 3(12vCPU/24GB), K8s v1.33.13.
- "Pod는 반드시 자신의 복제 Pod인 Replica Pod를 가진다"(p.12). auth/comment/frontend/post 각 Pod 2개(그림 29). MySQL StatefulSet 레플리카 수는 보고서에 없음.
- 정상 트래픽: Locust, 서비스별 15분 × 3라운드 (동시 사용자 auth 40, post 30, comment 30, frontend 40).
- 공격 트래픽: 침해 Pod 안에서 스크립트 실행 후 outbound 캡처.

## 7. 공격 시나리오 (표 2, p.18)

| 시나리오 | 침해 서비스 | 내용 | MITRE | 방향 | 대응 |
|---|---|---|---|---|---|
| **k1** | 전 서비스 | K8s API 정찰(:443) | T1613, T1528, T1589 | 요청 | DROP |
| k2 | 전 서비스 | K8s 리소스 조작 | T1609, T1610 | 요청 | DROP |
| l2 | post, comment | 위조 토큰 검증 반복 | T1550, T1078 | 요청 | DROP |
| l3 | post, comment | 존재 확인 후 삭제 반복 | T1087, T1485 | 요청 | DROP |
| enum_seq | post, comment | 순차 ID 열거 | T1119 | 요청 | DROP |
| scan_seq | frontend | 민감 경로 15개 탐색 | T1595 | 요청 | DROP |
| **r1** | frontend | 정적 응답 XSS 주입 | T1565 | 응답 | RELAY |
| cred_enum | auth | 로그인 무차별 대입 | T1087, T1110 | 요청 | DROP |

- k1: SA 토큰으로 /api/v1/pods, secrets 등 조회. 무방어 결과 /version 200, pods·secrets 등 403 (p.65~66).
- r1: p.19 "mitmproxy가 응답 가로채 주입" vs p.66 "index.html 변조(저장형 XSS)" — 보고서 내부 불일치. 영상은 시연과 같은 index.html 변조로 설명. 페이로드는 쿠키·XSRF 토큰 유출 스크립트. f16/f17(HMAC 지문) 변화로 탐지(p.60).

## 8. 한계 (영상에서는 다루지 않기로 함, 질의응답 대비)

- l2·cred_enum 미탐 (표현 정보 한계). frontend 전 모델 재보정 실패.
- 형제 Pod 정상 전제 — ReplicaSet 전체·마스터 침해 시 무력화. RELAY는 replica 1개와 diff라 어느 쪽이 오염됐는지 판별 불가(3개 이상 다수결 제안).
- RELAY는 안전 메서드만, 백엔드 응답 미이미지화. 런타임 재학습 없음.

---

## 녹음된 대본과 어긋나는 점 (2026-09-19 대조)

> 1·3·4·5번은 2026-09-19 대본 수정 완료, 재녹음 대기. 2번은 화면에서 20×5로 정확히 그린다. 6번은 ⑦ 숫자 카드 주석으로 처리.

| # | 녹음된 문장 | 보고서 사실 | 심각도 |
|---|---|---|---|
| 1 | ⑤ 05-1 "이때 어디로 보내는지 표시는 가리고, 무엇이 어떻게 생겼는지만 봅니다." | 마스킹 없음. 목적지 포트·경로가 feature로 **포함** | **높음 — 사실과 반대** |
| 2 | ⑤ 05-1 "다섯 개를 한 줄씩 쌓아" | 패킷 1개 = 20가지 특징 한 줄, 5줄 → 20×5 이미지 | 문장은 유지 가능, 화면만 정확히 |
| 3 | ⑤ 05-3a "크고 정확한 선생님 검사기" | Teacher는 전 서비스 ROLLBACK, post FPR 11.05%. 보고서 표현 "크고 표현력이 높은" | 중간 |
| 4 | ⑦ 07-2 "31만 개가 넘던 파라미터를 1만 개 남짓까지" | 1.23K~12.64K | 중간 |
| 5 | ⑦ 07-2 "판정 레이턴시를 약 1밀리초 내에서 달성" | 0.36~1.13ms(최대가 1ms 초과), **모델 추론만**, 오프라인 CPU | 중간 |
| 6 | ⑦ 07-1 "재현율 86.7~100, 오탐률 1.3% 이하" | 배포 모델 기준 맞음. frontend는 잠정 임계값 | 낮음 — 화면 주석으로 |
