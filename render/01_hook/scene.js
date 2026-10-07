// ① 훅 — TTS_01 0.0~18.55s (+꼬리). 파드 하나가 뚫리고 옆으로 번지다 정지 → 타이틀.
const ASSETS = [
  ['pod', '../../assets/kubernetes community main icons-svg/resources/unlabeled/pod.svg'],
  ['api', '../../assets/kubernetes community main icons-svg/control_plane_components/labeled/api.svg'],
  ['mascot', '../../assets/_extracted/deepmesh 발표 템플릿/image1.png'],
];

// 문장 경계 (silencedetect 실측)
// 여러분… 0.00-0.74 | 저희 털렸어요 0.95-2.39 | 서버가 털렸어요 2.67-4.27 | 게시판 하나 뚫렸는데 4.68-6.00
// 해커가 전체로 퍼지고 있어요 6.22-8.16 | 살려주세요 8.40-9.92 | 해설 질문 10.72-13.56 | 인사 14.22-18.34
const FREEZE = 9.45;
const SUBS = [
  [0.00, 0.80, '여러분…', 'hype'],
  [0.95, 2.45, '저희 털렸어요', 'hype'],
  [2.67, 4.30, '서버가 털렸어요!', 'hype'],
  [4.68, 6.05, '게시판 하나 뚫렸는데…', 'hype'],
  [6.22, 8.20, '해커가 전체로 퍼지고 있어요', 'hype'],
  [8.40, 9.95, '살려주세요!', 'hype'],
  [10.72, 13.56, '이런 일이 실제로 일어난다면, 어떻게 막을 수 있을까요?', 'norm'],
  [14.22, 18.40, '안녕하세요, 부산대학교 정보컴퓨터공학부 졸업과제 DeepMesh 팀입니다.', 'srt'],   // 표지에 같은 내용이 있어 화면 자막은 생략
];

const COLS = { fe:330, auth:740, post:1180, comm:1590 };
const ROW = [590, 810];
const PW = 270, PH = 160;
const LABEL = { fe:'화면 (frontend)', auth:'로그인 (auth)', post:'게시글 (post)', comm:'댓글 (comment)' };
const INF = { post0:1.0, comm0:6.8, auth0:7.1, api:7.6, post1:8.05, comm1:8.1, auth1:8.15, fe0:8.6, fe1:8.65 };
const MB = { x:690, y:105, w:540, h:175 };            // 마스터 노드
const APIP = [830, 198];

// 번짐 경로: [시작, 끝, x1,y1, x2,y2, (곡선 제어점)]
const SPREAD = [
  [6.3, 6.8, COLS.post+PW/2, ROW[0], COLS.comm-PW/2, ROW[0]],
  [6.6, 7.1, COLS.post-PW/2, ROW[0], COLS.auth+PW/2, ROW[0]],
  [7.0, 7.6, COLS.post+PW/2-6, ROW[0]-PH/2, APIP[0]+80, MB.y+MB.h, 1400, 330],
  [7.6, 8.05, COLS.post, ROW[0]+PH/2, COLS.post, ROW[1]-PH/2],
  [7.65, 8.1, COLS.comm, ROW[0]+PH/2, COLS.comm, ROW[1]-PH/2],
  [7.7, 8.15, COLS.auth, ROW[0]+PH/2, COLS.auth, ROW[1]-PH/2],
];
// 평소 트래픽 (호출하는 쪽 → 받는 쪽)
const TRAFFIC = [
  [COLS.post-PW/2, ROW[0], COLS.auth+PW/2, ROW[0]],
  [COLS.comm-PW/2, ROW[0], COLS.post+PW/2, ROW[0]],
  [COLS.post-PW/2, ROW[1], COLS.auth+PW/2, ROW[1]],
  [COLS.comm-PW/2, ROW[1], COLS.post+PW/2, ROW[1]],
  [130, 670, COLS.fe-PW/2, ROW[0]],
  [130, 730, COLS.fe-PW/2, ROW[1]],
];

function infK(key, tc){ const t0 = INF[key]; return t0 === undefined ? 0 : eo(P(tc, t0, t0 + 0.4)); }

function pod(svc, i, tc){
  const x = COLS[svc], y = ROW[i], k = infK(svc + i, tc);
  ctx.save();
  if (k > 0){ ctx.shadowColor = C.red; ctx.shadowBlur = 30*k + 10*k*Math.sin(tc*8); }
  rr(x-PW/2, y-PH/2, PW, PH, 16); ctx.fillStyle = C.panel2; ctx.fill(); ctx.shadowBlur = 0;
  if (k > 0){ ctx.fillStyle = `rgba(220,38,38,${0.12*k})`; ctx.fill(); }
  ctx.lineWidth = 3; ctx.strokeStyle = k > 0.5 ? C.red : C.edge; ctx.stroke();
  ctx.restore();
  img('pod', x-PW/2+24, y-36, 72, 70);
  text('파드', x-PW/2+114, y, 30, k > 0.5 ? C.red : C.sub);
}

function traffic(tc, alpha){
  withAlpha(alpha, () => {
    ctx.lineWidth = 3; ctx.setLineDash([12, 12]); ctx.lineDashOffset = -tc*45; ctx.strokeStyle = C.green;
    for (const [x1,y1,x2,y2] of TRAFFIC){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
    ctx.setLineDash([]);
  });
}

function spread(tc){
  for (const s of SPREAD){
    const [t0,t1,x1,y1,x2,y2,cx,cy] = s, u = eio(P(tc,t0,t1));
    if (u <= 0) continue;
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.shadowColor = C.red; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.moveTo(x1,y1);
    let hx, hy;
    if (cx !== undefined){
      const N = 30; for (let i=1;i<=N*u;i++){ const v = i/N; const px = (1-v)*(1-v)*x1 + 2*(1-v)*v*cx + v*v*x2, py = (1-v)*(1-v)*y1 + 2*(1-v)*v*cy + v*v*y2; ctx.lineTo(px,py); hx=px; hy=py; }
    } else { [hx, hy] = along(x1,y1,x2,y2,u); ctx.lineTo(hx,hy); }
    ctx.stroke();
    if (u < 1 && hx !== undefined){ ctx.beginPath(); ctx.arc(hx,hy,11,0,Math.PI*2); ctx.fillStyle = C.red; ctx.fill(); }
    ctx.restore();
  }
}

function cluster(tc, alpha){
  withAlpha(alpha, () => {
    // 흔들림 (서버가 털렸어요!)
    const sh = win(tc, 2.7, 2.8, 3.1, 3.4) * 7;
    ctx.translate(Math.sin(tc*70)*sh, Math.cos(tc*55)*sh*0.5);

    // 마스터 노드
    const ka = infK('api', tc);
    ctx.save(); if (ka > 0){ ctx.shadowColor = C.red; ctx.shadowBlur = 30*ka; }
    rr(MB.x, MB.y, MB.w, MB.h, 18); ctx.fillStyle = C.panel; ctx.fill(); ctx.shadowBlur = 0;
    if (ka > 0){ ctx.fillStyle = `rgba(220,38,38,${0.12*ka})`; ctx.fill(); }
    ctx.lineWidth = 3; ctx.strokeStyle = ka > 0.5 ? C.red : C.edge; ctx.stroke(); ctx.restore();
    text('마스터 노드', MB.x+24, MB.y+34, 26, C.sub);
    imgFit('api', APIP[0], APIP[1]+6, 84);
    text('API 서버', APIP[0]+64, APIP[1]+8, 34, ka > 0.5 ? C.red : C.text);

    traffic(tc, 1 - 0.7*eo(P(tc, 6.2, 8.4)));
    userIcon(92, 725, 0.9, 1);
    text('사용자', 92, 805, 24, C.sub, 'center');

    for (const svc of ['fe','auth','post','comm']){
      const hl = svc === 'post' ? eo(P(tc, 4.68, 5.1)) : 0;
      if (hl > 0) pill(LABEL[svc], COLS[svc], 455, 30, C.red, 1, hl);
      else text(LABEL[svc], COLS[svc], 455, 30, C.text, 'center');
      pod(svc, 0, tc); pod(svc, 1, tc);
    }
    spread(tc);

    // 해커 (post 파드 안)
    hacker(COLS.post + 82, ROW[0] + 22, 0.7, eo(P(tc, 2.7, 3.1)));

    // 전체 경보 (살려주세요!)
    const al = eo(P(tc, 8.4, 8.8));
    if (al > 0){
      const g = ctx.createRadialGradient(W/2, H/2, 300, W/2, H/2, 1100);
      g.addColorStop(0, 'rgba(220,38,38,0)'); g.addColorStop(1, `rgba(220,38,38,${0.30*al*(0.8+0.2*Math.sin(tc*14))})`);
      ctx.fillStyle = g; ctx.fillRect(-20, -20, W+40, H+40);
    }
  });
}

function draw(t){
  const tc = Math.min(t, FREEZE);
  background(true);
  const sceneA = 1 - eo(P(t, 13.6, 14.2));
  cluster(tc, sceneA);
  if (t >= FREEZE && t < FREEZE + 0.5) glitch(1 - P(t, FREEZE, FREEZE + 0.5), Math.floor(t*30) + 0.137);

  // 질문 (이런 일이 실제로 일어난다면…)
  const dim = eo(P(t, 10.7, 11.4)) * sceneA;
  if (dim > 0){ ctx.fillStyle = `rgba(255,255,255,${0.6*dim})`; ctx.fillRect(0,0,W,H); }
  guard(t < 13.9 ? 1 : 0, t < 13.9);

  // 타이틀 카드 — 발표 표지와 같은 단정한 흰 화면 (14.2s~)
  const ca = eo(P(t, 13.9, 14.3));
  if (ca > 0){ ctx.fillStyle = `rgba(255,255,255,${ca})`; ctx.fillRect(0,0,W,H); }
  const L = 110, R = 1440;
  text('2026년 전기 정보컴퓨터공학부 졸업과제', L+6, 322, 30, C.text, 'left', eo(P(t, 14.25, 14.6)));
  const b1 = eio(P(t, 14.3, 14.9)), b2 = eio(P(t, 14.55, 15.15));
  if (b1 > 0){ ctx.fillStyle = C.pnu; ctx.fillRect(L, 366, (R-L)*b1, 13); }
  text('KD-CNN 기반 경량 서비스메시를 활용한', L+16, 452, 60, C.text, 'left', eo(P(t, 14.5, 14.9)));
  text('클라우드 네이티브 침입탐지시스템 설계 및 구현', L+16, 548, 60, C.text, 'left', eo(P(t, 14.65, 15.05)));
  if (b2 > 0){ ctx.fillStyle = C.pnuGreen; ctx.fillRect(L, 614, (R-L)*b2, 13); }
  text('#쿠버네티스   #서비스메시   #측면이동차단   #지식증류', L+6, 672, 30, C.text, 'left', eo(P(t, 15.0, 15.4)), 400);
  text('부산대학교 정보컴퓨터공학부', L+16, 886, 32, C.text, 'left', eo(P(t, 15.1, 15.5)));
  text('DeepMesh  신의철, 정의진, 이시하  |  지도교수 최윤호', L+16, 932, 30, C.text, 'left', eo(P(t, 15.1, 15.5)), 400);
  imgFit('mascot', 1690, 862, 330, eo(P(t, 14.9, 15.4)));
  drawSubs(t, SUBS);
}
