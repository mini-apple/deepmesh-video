// ⑥ 시나리오 1 k1 설명 — TTS_06_시연 28.10~40.90s (06-2 박스만). 비유 없이 실제 용어로.
// 문장 경계 (silencedetect 실측, 원본 파일 시각 → 이 단위 시각 = 원본 − 28.10)
// S1 그럼 첫 번째 공격을 진행해보겠습니다 28.31-30.23 → 0.21-2.13
// S2 오스 파드 하나가 이미 탈취됐다고 가정합니다 30.66-33.05 → 2.56-4.95
// S3a 공격자는 파드에…쿠버네티스 API 서버에 접속해, 33.65-38.96 → 5.55-10.86
//     (쉼 없음: 음절 비례 추정 — '서비스 계정 토큰' 시작 ≈7.54, 'API 서버' 시작 ≈8.74)
// S3b 클러스터 정보를 캐려 합니다 39.33-40.66 → 11.23-12.56
// 다음 박스(06-3)는 원본 41.72 부터 → 단위 끝 40.90 과 겹치지 않음
const ASSETS = [
  ['pod', '../../assets/kubernetes community main icons-svg/resources/unlabeled/pod.svg'],
  ['sa', '../../assets/kubernetes community main icons-svg/resources/unlabeled/sa.svg'],
  ['secret', '../../assets/kubernetes community main icons-svg/resources/unlabeled/secret.svg'],
  ['api', '../../assets/kubernetes community main icons-svg/control_plane_components/labeled/api.svg'],
  ['cp', '../../assets/kubernetes community main icons-svg/infrastructure_components/unlabeled/control-plane.svg'],
];
const SUBS = [
  [0.21, 2.13, '그럼 첫 번째 공격을 진행해보겠습니다.', 'norm'],
  [2.56, 4.95, 'auth pod 하나가 이미 탈취됐다고 가정합니다.', 'norm'],
  [5.55, 7.54, '공격자는 pod에 기본으로 들어 있는', 'norm'],
  [7.54, 10.86, '서비스 계정 토큰으로 쿠버네티스 API 서버에 접속해,', 'norm'],
  [11.23, 12.56, '클러스터 정보를 캐려 합니다.', 'norm'],
];

// ── 배치 (월드 좌표) ──
const AUTH = { x: 170, y: 240, w: 480, h: 380 };
const HK = [320, 470];                  // 해커 (auth pod 안)
const TOK = [545, 470];                 // 서비스 계정 토큰 (auth pod 안)
const MASTER = { x: 1150, y: 200, w: 640, h: 360 };
const APIC = [1330, 395];               // API 서버 아이콘 중심
const INFO = { x: 1150, y: 610, w: 640, h: 235 };
const SMALL = [['frontend', 170], ['post', 425], ['comment', 680]];
const REQ = [AUTH.x + AUTH.w, 430, APIC[0] - 72, 405];   // 요청 경로

function chip(s, t){
  const a = eo(P(t, 0.15, 0.7)), dx = -40*(1 - a);
  withAlpha(a, () => {
    font(26); const m = ctx.measureText(s).width;
    rr(48 + dx, 48, m + 40, 50, 25); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.pnu; ctx.stroke();
    ctx.fillStyle = C.pnu; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, 68 + dx, 74);
  });
}
function box(x, y, w, h, k, fill='#fff', r=18){
  ctx.save();
  if (k > 0){ ctx.shadowColor = C.red; ctx.shadowBlur = 30*k; }
  rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.shadowBlur = 0;
  if (k > 0){ ctx.fillStyle = `rgba(220,38,38,${0.10*k})`; ctx.fill(); }
  ctx.lineWidth = k > 0.5 ? 4 : 3; ctx.strokeStyle = k > 0.5 ? C.red : C.edge; ctx.stroke();
  ctx.restore();
}
function code(s, x, y, sz, col, align='center', a=1){
  withAlpha(a, () => { ctx.font = `700 ${sz}px Consolas, monospace`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); });
}
function ring(x, y, r, col, a){
  withAlpha(a, () => { ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.stroke(); });
}

function scene(t){
  const inA = eo(P(t, 0.0, 0.8));
  withAlpha(inA, () => {
    // 클러스터 경계
    ctx.save(); ctx.setLineDash([14, 10]); ctx.lineWidth = 2.5; ctx.strokeStyle = C.dim;
    rr(80, 140, 1760, 730, 26); ctx.stroke(); ctx.restore();
    text('쿠버네티스 클러스터', 1812, 172, 26, C.sub, 'right');

    // 평소 트래픽 (fe·post·comment 모두 auth 로 연결)
    const tr = 1 - 0.6*eo(P(t, 2.9, 3.6));
    for (const [, x] of SMALL) flowLine(x + 115, 715, AUTH.x + AUTH.w/2, AUTH.y + AUTH.h, t, C.green, tr*(1 - 0.85*win(t, 2.4, 3.1, 8.9, 9.7)));
    // 다른 pod 들
    const sa = 1 - 0.85*win(t, 2.4, 3.1, 8.9, 9.7);      // 확대 중엔 아래 pod 를 흐리게 (자막 자리)
    for (const [nm, x] of SMALL) withAlpha(sa, () => {
      box(x, 715, 230, 110, 0, '#fff', 14);
      imgFit('pod', x + 42, 770, 50);
      text(nm, x + 78, 770, 26, C.sub, 'left');
    });

    // auth pod
    const k = eo(P(t, 2.9, 3.4));
    box(AUTH.x, AUTH.y, AUTH.w, AUTH.h, k + 0.15*k*Math.sin(t*7));
    imgFit('pod', AUTH.x + 50, AUTH.y + 50, 62);
    text('auth pod', AUTH.x + 94, AUTH.y + 50, 36, k > 0.5 ? C.red : C.text, 'left');
    pill('탈취됨', AUTH.x + AUTH.w - 80, AUTH.y + 50, 26, C.red, eo(P(t, 3.2, 3.6)), 0.6);
    hacker(HK[0], HK[1], 1.05, eo(P(t, 3.0, 3.5)));

    // 서비스 계정 토큰: 처음부터 pod 안에 들어 있다(흐리게) → 5.6s 부터 또렷하게
    const tk = eo(P(t, 5.6, 6.2));
    const leave = eio(P(t, 8.75, 9.25));                 // 요청에 실려 나간다
    const [tx, ty] = along(TOK[0], TOK[1], REQ[0], REQ[1], leave);
    if (leave < 1){
      const pulse = win(t, 5.6, 6.0, 7.2, 7.8);
      ring(tx, ty, 62 + 10*Math.sin(t*6), C.gold, pulse*0.9);
      imgFit('sa', tx, ty, 92 - 30*leave, 0.35 + 0.65*tk);
    }
    const lab = win(t, 7.5, 7.9, 8.7, 9.1);
    if (lab > 0) punch('서비스 계정 토큰', TOK[0] - 40, TOK[1] + 88, 34, C.pnu, lab, t - 7.5);
    else text('서비스 계정 토큰', TOK[0], TOK[1] + 80, 22, C.sub, 'center', tk*(1 - P(t, 8.7, 8.9)), 400);

    // 마스터 노드 + API 서버
    const hit = eo(P(t, 10.5, 10.9));
    box(MASTER.x, MASTER.y, MASTER.w, MASTER.h, 0, C.panel);
    imgFit('cp', MASTER.x + 48, MASTER.y + 46, 52);
    text('마스터 노드', MASTER.x + 84, MASTER.y + 46, 28, C.sub, 'left');
    const al = win(t, 10.5, 10.8, 11.6, 12.4);
    ring(APIC[0], APIC[1] + 4, 84 + 30*P(t, 10.5, 11.6), C.red, al*0.8);
    imgFit('api', APIC[0], APIC[1], 130);
    const apiHl = eo(P(t, 8.8, 9.3));
    if (apiHl > 0) pill('쿠버네티스 API 서버', 1560, APIC[1], 30, hit > 0.5 ? C.red : C.pnu, 1, apiHl*0.6);
    else text('쿠버네티스 API 서버', 1560, APIC[1], 30, C.text, 'center');
  });

  // 요청: auth pod → API 서버 (토큰을 실어서)
  const rq = eo(P(t, 8.8, 9.2));
  if (rq > 0){
    flowLine(REQ[0], REQ[1], REQ[2], REQ[3], t, C.red, rq, 5);
    const u = eio(P(t, 9.1, 10.7));
    if (u > 0 && u < 1){
      const [px, py] = along(REQ[0], REQ[1], REQ[2], REQ[3], u);
      packet(px, py, 1, C.red, 84, 50);
      imgFit('sa', px + 34, py - 34, 48);
    }
    const cc = eo(P(t, 9.3, 9.8));
    withAlpha(cc, () => {
      const mx = (REQ[0] + REQ[2])/2, my = (REQ[1] + REQ[3])/2 - 110;
      ctx.font = '700 30px Consolas, monospace'; const m = ctx.measureText('GET /api/v1/pods').width;
      rr(mx - m/2 - 20, my - 28, m + 40, 56, 10); ctx.fillStyle = '#1b1f2a'; ctx.fill();
      code('GET /api/v1/pods', mx, my + 1, 30, '#FCA5A5', 'center');
      text('+ 서비스 계정 토큰', mx, my + 54, 24, C.red, 'center', 1, 700);
    });
  }

  // 클러스터 정보 (캐려는 대상)
  const ia = eo(P(t, 11.0, 11.5));
  if (ia > 0) withAlpha(ia, () => {
    const dy = 30*(1 - ia);
    ctx.translate(0, dy);
    box(INFO.x, INFO.y, INFO.w, INFO.h, 0, '#fff');
    text('클러스터 정보', INFO.x + 28, INFO.y + 38, 28, C.text, 'left');
    const rows = [['pod', '파드 목록', 'pods', 11.3], ['secret', '시크릿', 'secrets', 11.6]];
    rows.forEach(([ic, nm, en, t0], i) => {
      const ra = eo(P(t, t0, t0 + 0.35)), y = INFO.y + 100 + i*72;
      withAlpha(ra, () => {
        ctx.translate(24*(1 - ra), 0);
        imgFit(ic, INFO.x + 56, y, 50);
        text(nm, INFO.x + 98, y, 28, C.text, 'left');
        code(en, INFO.x + 262, y, 24, C.sub, 'left');
        for (let j = 0; j < 3; j++){ rr(INFO.x + 380 + j*62, y - 12, 50, 24, 6); ctx.fillStyle = C.grid; ctx.fill(); }
        text('?', INFO.x + 590, y, 40, C.red, 'center', 0.6 + 0.4*Math.sin(t*6 + i));
      });
    });
    // API 서버 → 정보 (공격자가 노리는 방향)
    flowLine(APIC[0], APIC[1] + 80, APIC[0], INFO.y - 6, t, C.red, eo(P(t, 11.3, 11.7)), 4);
  });
}

function draw(t){
  background(true);
  const c = camAt(t, [[0, 960, 500, 0.9], [2.2, 960, 490, 0.97], [3.3, 410, 450, 1.5], [5.4, 430, 455, 1.55],
                      [6.4, 470, 470, 1.7], [8.5, 480, 470, 1.72], [9.7, 960, 470, 0.98], [10.8, 990, 480, 1.0], [12.8, 1030, 500, 1.06]]);
  withCam(c, 0, 0, () => scene(t));
  chip('시나리오 1', t);
  guard(1);
  drawSubs(t, SUBS);
}
