// ⑧ 마무리 — TTS_08 0.0~23.57s + 크레딧 꼬리 5.0s (duration 28.6)
// ①의 클러스터 도식을 같은 모양으로 다시 쓴다 (01_hook/scene.js 의 COLS·ROW·PW·PH·MB·APIP, pod·traffic·spread·cluster, 해커 복사).
// ① 정지 프레임(t=9.45) → 되감기 → 사이드카 프록시가 붙은 클러스터에서 같은 공격이 post 출구에서 drop → post 격리 → 크레딧.
const ASSETS = [
  ['pod', '../../assets/kubernetes community main icons-svg/resources/unlabeled/pod.svg'],
  ['api', '../../assets/kubernetes community main icons-svg/control_plane_components/labeled/api.svg'],
  ['mascot', '../../assets/_extracted/deepmesh 발표 템플릿/image1.png'],
];

// 문장 경계 (silencedetect noise=-35dB d=0.2 실측)
// 08-1 영상 맨 앞 0.25-0.85 | 서버가 털렸다던 그 상황입니다 1.17-2.71 | 같은 공격이…사이드카 프록시에서 멈춥니다 3.32-5.85
// 08-2 여러분… 6.32-6.84 | 이번엔, 막았어요 7.05-8.55
// 08-3 뚫리지 않는 벽은 없습니다 9.10-10.52 | 그래서 저희는…번지지 못하게 11.20-14.27 | 뚫린 다음을 지킵니다 14.64-15.83
//      저희가 만든 건 그런 서비스메시입니다 16.59-18.94 | 지금까지…DeepMesh 팀이었습니다 19.74-22.21 | 감사합니다 22.83-23.57
const SUBS = [
  [0.25, 2.75, '영상 맨 앞, 서버가 털렸다던 그 상황입니다.', 'norm'],
  [3.32, 5.90, '같은 공격이 이번에는 사이드카 프록시에서 멈춥니다.', 'norm'],
  [6.32, 6.90, '여러분…', 'hype'],
  [7.05, 8.60, '이번엔, 막았어요.', 'hype'],
  [9.10, 10.55, '뚫리지 않는 벽은 없습니다.', 'norm'],
  [11.20, 14.30, '그래서 저희는 침해된 pod 하나가 옆으로 번지지 못하게,', 'norm'],
  [14.64, 15.85, '뚫린 다음을 지킵니다.', 'srt'],                       // 화면 큰 글씨와 같음
  [16.59, 18.95, '저희가 만든 건 그런 서비스메시입니다.', 'norm'],
  [19.74, 22.25, '지금까지 부산대학교 DeepMesh 팀이었습니다.', 'srt'],   // 크레딧 화면
  [22.83, 23.57, '감사합니다.', 'srt'],                                 // 크레딧 화면
];
const HYPE_Y = 830;   // 확대된 post 파드를 가리지 않도록 아래쪽(2행 파드 위)에 띄운다

// ── ①과 같은 도식 (01_hook/scene.js 복사) ──
const FREEZE = 9.45;
const COLS = { fe:330, auth:740, post:1180, comm:1590 };
const ROW = [590, 810];
const PW = 270, PH = 160;
const LABEL = { fe:'화면 (frontend)', auth:'로그인 (auth)', post:'게시글 (post)', comm:'댓글 (comment)' };
const INF = { post0:1.0, comm0:6.8, auth0:7.1, api:7.6, post1:8.05, comm1:8.1, auth1:8.15, fe0:8.6, fe1:8.65 };
const MB = { x:690, y:105, w:540, h:175 };            // 마스터 노드
const APIP = [830, 198];
const SPREAD = [
  [6.3, 6.8, COLS.post+PW/2, ROW[0], COLS.comm-PW/2, ROW[0]],
  [6.6, 7.1, COLS.post-PW/2, ROW[0], COLS.auth+PW/2, ROW[0]],
  [7.0, 7.6, COLS.post+PW/2-6, ROW[0]-PH/2, APIP[0]+80, MB.y+MB.h, 1400, 330],
  [7.6, 8.05, COLS.post, ROW[0]+PH/2, COLS.post, ROW[1]-PH/2],
  [7.65, 8.1, COLS.comm, ROW[0]+PH/2, COLS.comm, ROW[1]-PH/2],
  [7.7, 8.15, COLS.auth, ROW[0]+PH/2, COLS.auth, ROW[1]-PH/2],
];
const TRAFFIC = [
  [COLS.post-PW/2, ROW[0], COLS.auth+PW/2, ROW[0]],
  [COLS.comm-PW/2, ROW[0], COLS.post+PW/2, ROW[0]],
  [COLS.post-PW/2, ROW[1], COLS.auth+PW/2, ROW[1]],
  [COLS.comm-PW/2, ROW[1], COLS.post+PW/2, ROW[1]],
  [130, 670, COLS.fe-PW/2, ROW[0]],
  [130, 730, COLS.fe-PW/2, ROW[1]],
];

function infK(key, tc){ const t0 = INF[key]; return t0 === undefined ? 0 : eo(P(tc, t0, t0 + 0.4)); }

// ① pod() 와 같은 그림. k(침해 정도)와 tg(점멸 시계)를 직접 받는다
function pod(svc, i, k, tg, bw=3){
  const x = COLS[svc], y = ROW[i];
  ctx.save();
  if (k > 0){ ctx.shadowColor = C.red; ctx.shadowBlur = 30*k + 10*k*Math.sin(tg*8); }
  rr(x-PW/2, y-PH/2, PW, PH, 16); ctx.fillStyle = C.panel2; ctx.fill(); ctx.shadowBlur = 0;
  if (k > 0){ ctx.fillStyle = `rgba(220,38,38,${0.12*k})`; ctx.fill(); }
  ctx.lineWidth = bw; ctx.strokeStyle = k > 0.5 ? C.red : C.edge; ctx.stroke();
  ctx.restore();
  img('pod', x-PW/2+24, y-36, 72, 70);
  text('파드', x-PW/2+114, y, 30, k > 0.5 ? C.red : C.sub);
}

// ① traffic() 와 같은 초록 점선. la(i) = 선마다 투명도
function traffic(tc, alpha, la=null){
  withAlpha(alpha, () => {
    ctx.lineWidth = 3; ctx.setLineDash([12, 12]); ctx.lineDashOffset = -tc*45; ctx.strokeStyle = C.green;
    TRAFFIC.forEach(([x1,y1,x2,y2], i) => {
      const a = la ? la(i) : 1; if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.restore();
    });
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

function master(ka){
  ctx.save(); if (ka > 0){ ctx.shadowColor = C.red; ctx.shadowBlur = 30*ka; }
  rr(MB.x, MB.y, MB.w, MB.h, 18); ctx.fillStyle = C.panel; ctx.fill(); ctx.shadowBlur = 0;
  if (ka > 0){ ctx.fillStyle = `rgba(220,38,38,${0.12*ka})`; ctx.fill(); }
  ctx.lineWidth = 3; ctx.strokeStyle = ka > 0.5 ? C.red : C.edge; ctx.stroke(); ctx.restore();
  text('마스터 노드', MB.x+24, MB.y+34, 26, C.sub);
  imgFit('api', APIP[0], APIP[1]+6, 84);
  text('API 서버', APIP[0]+64, APIP[1]+8, 34, ka > 0.5 ? C.red : C.text);
}
function userAt(){ userIcon(92, 725, 0.9, 1); text('사용자', 92, 805, 24, C.sub, 'center'); }
function label(svc, hl){
  if (hl > 0) pill(LABEL[svc], COLS[svc], 455, 30, C.red, 1, hl);
  else text(LABEL[svc], COLS[svc], 455, 30, C.text, 'center');
}
function alarm(al, tc){
  if (al <= 0) return;
  const g = ctx.createRadialGradient(W/2, H/2, 300, W/2, H/2, 1100);
  g.addColorStop(0, 'rgba(220,38,38,0)'); g.addColorStop(1, `rgba(220,38,38,${0.30*al*(0.8+0.2*Math.sin(tc*14))})`);
  ctx.fillStyle = g; ctx.fillRect(-20, -20, W+40, H+40);
}

// ① cluster() 그대로 (tc = ①의 시계). 되감기에서 tc 를 거꾸로 돌린다
function hookCluster(tc){
  ctx.save();
  const sh = win(tc, 2.7, 2.8, 3.1, 3.4) * 7;
  ctx.translate(Math.sin(tc*70)*sh, Math.cos(tc*55)*sh*0.5);
  master(infK('api', tc));
  traffic(tc, 1 - 0.7*eo(P(tc, 6.2, 8.4)));
  userAt();
  for (const svc of ['fe','auth','post','comm']){
    label(svc, svc === 'post' ? eo(P(tc, 4.68, 5.1)) : 0);
    pod(svc, 0, infK(svc + '0', tc), tc); pod(svc, 1, infK(svc + '1', tc), tc);
  }
  spread(tc);
  hacker(COLS.post + 82, ROW[0] + 22, 0.7, eo(P(tc, 2.7, 3.1)));
  alarm(eo(P(tc, 8.4, 8.8)), tc);
  ctx.restore();
}

// ── 사이드카 프록시: 파드를 감싸는 초록 테두리 + 왼쪽 위 방패 배지 (common.js inspector 의 방패 모양) ──
function shield(x, y, s=1, alpha=1, glow=0){
  withAlpha(alpha, () => {
    ctx.translate(x, y); ctx.scale(s, s);
    if (glow > 0){ ctx.shadowColor = C.pnuGreen; ctx.shadowBlur = 26*glow; }
    ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(17,-13); ctx.lineTo(15,6); ctx.quadraticCurveTo(10,18,0,24); ctx.quadraticCurveTo(-10,18,-15,6); ctx.lineTo(-17,-13); ctx.closePath();
    ctx.fillStyle = C.pnuGreen; ctx.fill(); ctx.shadowBlur = 0; ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-7,1); ctx.lineTo(-1,7); ctx.lineTo(8,-5); ctx.stroke();
  });
}
const SIDE_ORDER = ['fe0','fe1','auth0','auth1','post0','post1','comm0','comm1'];
const SIDE0 = 3.55, WAVE0 = 7.15;
const RING = 9;
function sidecar(svc, i, t, flash){
  const key = svc + i, n = SIDE_ORDER.indexOf(key), t0 = SIDE0 + n*0.09;
  const a = eo(P(t, t0, t0 + 0.3)); if (a <= 0) return;
  const x = COLS[svc], y = ROW[i];
  const wave = win(t, WAVE0 + n*0.06, WAVE0 + n*0.06 + 0.15, WAVE0 + n*0.06 + 0.35, WAVE0 + n*0.06 + 0.9);
  const g = Math.max(wave, flash);
  withAlpha(a, () => {
    ctx.save();
    if (g > 0){ ctx.shadowColor = C.pnuGreen; ctx.shadowBlur = 24*g; }
    rr(x-PW/2-RING, y-PH/2-RING, PW+2*RING, PH+2*RING, 22);
    ctx.lineWidth = 3 + 3*g; ctx.strokeStyle = C.pnuGreen; ctx.globalAlpha *= 0.55 + 0.45*g; ctx.stroke();
    ctx.restore();
  });
  const age = t - t0, pop = 1 + 0.5*Math.exp(-Math.max(0, age)*9);
  shield(x-PW/2-RING+4, y-PH/2-RING+4, 1.15*pop*(1 + 0.25*g), a, g);
}

// ── 같은 공격, 이번엔 post 출구에서 멈춤 (전부 drop. relay 는 frontend 응답 전용이라 여기선 쓰지 않음) ──
const POSTINF = 4.45;
const AO = [COLS.post + 60, ROW[0] + 6];     // 해커 쪽에서 출발
// [출발, 도착, 출구 x,y, X표시 x,y] — comment 쪽 / API 서버 쪽 / auth 쪽
const ATK = [
  [4.95, 5.20, COLS.post+PW/2+RING, ROW[0], COLS.post+PW/2+46, ROW[0]],
  [5.05, 5.38, COLS.post+PW/2-18, ROW[0]-PH/2-RING, COLS.post+PW/2+14, ROW[0]-PH/2-44],
  [5.10, 5.58, COLS.post-PW/2-RING, ROW[0], COLS.post-PW/2-46, ROW[0]],
];
const RIPPLE = [11.75, 12.95];
function postFlash(t){
  let f = 0;
  for (const a of ATK) if (t >= a[1]) f = Math.max(f, Math.exp(-(t - a[1])*4));
  for (const r of RIPPLE) if (t >= r + 0.45) f = Math.max(f, Math.exp(-(t - r - 0.45)*4));
  return f;
}
function attacks(t){
  for (const [l, a, ex, ey] of ATK){
    const u = eio(P(t, l, a)); if (u <= 0) continue;
    const fade = 1 - eo(P(t, a + 0.35, a + 0.9)); if (fade <= 0) continue;
    const [hx, hy] = along(AO[0], AO[1], ex, ey, u);
    withAlpha(fade, () => {
      ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.shadowColor = C.red; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.moveTo(AO[0], AO[1]); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.beginPath(); ctx.arc(hx, hy, u < 1 ? 11 : 8, 0, Math.PI*2); ctx.fillStyle = C.red; ctx.fill();
    });
  }
}
// 번지려던 방향(①에서 번졌던 길)을 흐린 빨간 점선으로 잠깐 보여준다
const GHOST = [
  [COLS.comm-PW/2, ROW[0]],
  [APIP[0]+80, MB.y+MB.h, 1320, 300],
  [COLS.auth+PW/2, ROW[0]],
];
function ghosts(t){
  ATK.forEach(([l, a, , , xx, xy], i) => {
    const g = GHOST[i], al = 0.4*win(t, l, l + 0.25, a + 0.5, a + 1.2); if (al <= 0) return;
    withAlpha(al, () => {
      ctx.lineWidth = 4; ctx.setLineDash([10, 12]); ctx.lineDashOffset = -t*45; ctx.strokeStyle = C.red;
      ctx.beginPath(); ctx.moveTo(xx, xy);
      if (g.length > 2) ctx.quadraticCurveTo(g[2], g[3], g[0], g[1]); else ctx.lineTo(g[0], g[1]);
      ctx.stroke(); ctx.setLineDash([]);
    });
  });
}
function dropMarks(t){
  for (const [, a, , , xx, xy] of ATK){
    const age = t - a; if (age < 0) continue;
    verdictMark('drop', xx, xy, 0.82*(1 + 0.45*Math.exp(-age*10)), eo(P(t, a, a + 0.1)));
  }
}
// 격리 확인: post 안에서 빨간 물결이 퍼지다 초록 테두리에서 멈춘다
function ripples(t){
  for (const r of RIPPLE){
    const u = P(t, r, r + 0.45); if (u <= 0 || t > r + 0.8) continue;
    const f = lerp(0.35, 1, eo(u)), a = 1 - P(t, r + 0.45, r + 0.8);
    const x = COLS.post, y = ROW[0], w = (PW + 2*RING)*f, h = (PH + 2*RING)*f;
    withAlpha(a*0.9, () => { rr(x - w/2, y - h/2, w, h, 22*f); ctx.lineWidth = 5; ctx.strokeStyle = C.red; ctx.stroke(); });
  }
}

function defCluster(t){
  const flow = t - 2.7;                                  // 되감기 끝(tc 0.3)과 점선 위상을 잇는다
  const kPost = eo(P(t, POSTINF, POSTINF + 0.4));
  const iso = eo(P(t, 8.6, 9.4));                          // 격리 강조(테두리 두껍게)
  master(0);
  const cut = 1 - 0.8*eo(P(t, 5.3, 6.1));                  // 침해된 post 파드에 닿는 선은 흐리게
  traffic(flow, 1, i => (i === 0 || i === 1) ? cut : 1);
  userAt();
  for (const svc of ['fe','auth','post','comm']){
    label(svc, svc === 'post' ? kPost : 0);
    pod(svc, 0, svc === 'post' ? kPost : 0, flow, svc === 'post' ? 3 + 2*iso : 3);
    pod(svc, 1, 0, flow);
  }
  ghosts(t);
  attacks(t);
  hacker(COLS.post + 82, ROW[0] + 22, 0.7, eo(P(t, 4.6, 4.95)));
  ripples(t);
  const pf = postFlash(t);
  for (const svc of ['fe','auth','post','comm']){ sidecar(svc, 0, t, svc === 'post' ? pf : 0); sidecar(svc, 1, t, 0); }
  dropMarks(t);
}

// 오른쪽 위 설명 카드: 사이드카 프록시
function sideCard(t){
  const a = win(t, 4.1, 4.5, 13.9, 14.4); if (a <= 0) return;
  const x = 1290, y = 112, w = 520, h = 128, dx = 40*(1 - eo(P(t, 4.1, 4.6)));
  withAlpha(a, () => {
    ctx.translate(dx, 0);
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.14)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    rr(x, y, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.pnuGreen; ctx.stroke();
    shield(x + 68, y + h/2, 2.1, 1);
    text('사이드카 프록시', x + 130, y + 48, 40, C.pnuGreen);
    text('파드에서 나가는 트래픽을 검사', x + 132, y + 92, 24, C.sub, 'left', 1, 400);
  });
}

// 되감기 표시: 줄무늬 + ◀◀
function rewindFx(t){
  const a = win(t, 1.4, 1.6, 2.85, 3.1); if (a <= 0) return;
  withAlpha(a, () => {
    ctx.fillStyle = 'rgba(0,91,170,0.05)'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 7; i++){
      const y = ((t*1400 + i*173) % (H + 80)) - 40, h = 10 + (i % 3)*12;
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(0, y, W, h);
      ctx.fillStyle = 'rgba(17,24,39,0.10)'; ctx.fillRect(0, y + h, W, 3);
    }
    const bl = Math.sin(t*18) > -0.3 ? 1 : 0.35;
    ctx.globalAlpha *= bl; ctx.fillStyle = C.text;
    for (const ox of [0, 44]){ ctx.beginPath(); ctx.moveTo(110 + ox, 110); ctx.lineTo(150 + ox, 84); ctx.lineTo(150 + ox, 136); ctx.closePath(); ctx.fill(); }
  });
}

// ── 크레딧: ① 타이틀 카드와 같은 구성(연도·파랑 막대·과제명·초록 막대·해시태그·학부/팀·마스코트) + 자료 출처 자리 ──
const CR = 19.3;
const TAGS = '#쿠버네티스   #서비스메시   #측면이동차단   #지식증류';   // ① 타이틀 카드와 같게
const SOURCES = [
  'Anthropic, “Disrupting the first reported AI-orchestrated cyber espionage campaign” (2025.11.13)',
  'Anthropic, “Project Glasswing: Initial Update” (2026.05.22)',
  'Google Cloud, “Cloud Threat Horizons Report H1 2026”',
  'Kubernetes icons © The Kubernetes Authors, CC BY 4.0',
];
function credits(t){
  const ca = eo(P(t, CR, CR + 0.4));
  if (ca <= 0) return;
  ctx.fillStyle = `rgba(255,255,255,${ca})`; ctx.fillRect(0, 0, W, H);
  const T = CR + 0.3, L = 110, R = 1440;
  const f = (a, b) => eo(P(t, T + a, T + b));
  // 상단: 연도 · 제목 · 해시태그
  text('2026년 전기 정보컴퓨터공학부 졸업과제', L+6, 172, 28, C.text, 'left', f(0, 0.35));
  const b1 = eio(P(t, T + 0.05, T + 0.65)), b2 = eio(P(t, T + 0.3, T + 0.9));
  if (b1 > 0){ ctx.fillStyle = C.pnu; ctx.fillRect(L, 210, (R-L)*b1, 12); }
  text('KD-CNN 기반 경량 서비스메시를 활용한', L+16, 288, 54, C.text, 'left', f(0.25, 0.65));
  text('클라우드 네이티브 침입탐지시스템 설계 및 구현', L+16, 360, 54, C.text, 'left', f(0.4, 0.8));
  if (b2 > 0){ ctx.fillStyle = C.pnuGreen; ctx.fillRect(L, 416, (R-L)*b2, 12); }
  text(TAGS, L+6, 476, 28, C.text, 'left', f(0.75, 1.15), 400);
  // 중단: 학부 · 팀
  text('부산대학교 정보컴퓨터공학부', L+16, 606, 32, C.text, 'left', f(0.85, 1.25));
  text('DeepMesh  신의철, 정의진, 이시하  |  지도교수 최윤호', L+16, 652, 30, C.text, 'left', f(0.85, 1.25), 400);
  // 하단: 자료 출처 (검정 계열만)
  const sa = f(1.1, 1.6);
  text('자료 출처', L+16, 786, 24, '#111827', 'left', sa);
  SOURCES.forEach((s, k) => text(s, L+16, 826 + k*34, 22, '#374151', 'left', sa, 400));
  imgFit('mascot', 1690, 862, 330, f(0.65, 1.15));
}

function draw(t){
  background(true);
  // 되감기: 1.5~3.0초 동안 ①의 시계를 9.45 → 0.3 으로 거꾸로
  const tc = lerp(FREEZE, 0.3, eio(P(t, 1.5, 3.0)));
  const cam = camAt(t, [[0, 960, 470, 1], [4.35, 960, 470, 1], [5.0, 1140, 540, 1.28], [7.7, 1140, 540, 1.3], [9.0, 960, 470, 1], [14.3, 950, 470, 0.975], [19.3, 950, 470, 0.96]]);
  withCam(cam, 0, 0, () => { if (t < 3.0) hookCluster(tc); else defCluster(t); });

  // ① 정지 프레임의 약한 글리치 → 되감기 줄무늬
  if (t < 3.0){
    const blip = (Math.sin(t*23) > 0.82 ? 0.45 : 0) + 0.8*(1 - P(t, 0, 0.35));
    const g = t < 1.5 ? 0.14 + blip : 0.35*win(t, 1.5, 1.7, 2.7, 3.0);
    glitch(g, Math.floor(t*30) + 0.137);
  }
  rewindFx(t);
  sideCard(t);

  // 핵심 문장: 뚫린 다음을 지킵니다 / 서비스메시
  const dim = win(t, 14.3, 14.7, 19.2, 19.4);
  if (dim > 0){ ctx.fillStyle = `rgba(255,255,255,${0.9*dim})`; ctx.fillRect(0, 0, W, H); }
  if (t < CR + 0.5){
    punch('뚫린 다음을 지킵니다', 960, 400, 124, C.pnu, eo(P(t, 14.6, 14.8))*dim, t - 14.64);
    const ba = eio(P(t, 15.0, 15.6))*dim;
    if (ba > 0){
      ctx.font = '900 124px KRH'; const hw = ctx.measureText('뚫린 다음을 지킵니다').width/2;   // 밑줄 = 문장 실제 폭
      ctx.fillStyle = C.pnuGreen; ctx.fillRect(960 - hw*ba, 490, 2*hw*ba, 10);
    }
    punch('서비스메시', 960, 600, 88, C.pnuGreen, eo(P(t, 17.5, 17.7))*dim, t - 17.55);
  }
  credits(t);

  guard(1, t < CR + 0.2);
  drawSubs(t, SUBS, HYPE_Y);
  // 마지막 1초: 흰색으로
  const wf = eio(P(t, 27.6, 28.6));
  if (wf > 0){ ctx.fillStyle = `rgba(255,255,255,${wf})`; ctx.fillRect(0, 0, W, H); }
}
