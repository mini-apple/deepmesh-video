// ④ 문제: 측면이동 — TTS_04 0.0~61.07s
// 구·문장 경계 (silencedetect -30dB d=0.1 실측, 쉼 없는 곳은 글자 수 비례 추정 *)
// 질문자  근데 공장 정문에 경비가 있잖아요? 0.00-1.98 | 구역마다 검사원까지 꼭 둬야 해요? 2.29-4.52
// 해설    정문은 생각보다 쉽게 뚫립니다 5.12-7.13 | 구글 클라우드 보고서에 따르면 7.72-9.34
//         공격자가 처음 들어온 경로의 9.65-11.75 | 44.5퍼센트는 11.85-12.79 | 패치하지 않은 소프트웨어의 취약점 13.07-15.06
//         27.2퍼센트는 15.46-16.82 | 약하거나 없는 인증 정보 17.07-18.54 | 21퍼센트는 18.88-19.80 | 설정 실수였습니다 19.99-21.08
//         이런 틈 하나면 21.46-22.27 | 작업자 한 명이 매수되는 셈입니다 22.41-24.10
//         쿠버네티스는 25.01-25.90 | 공정 구역마다 26.15-27.01 | 생산관리 서버에 접속할 수 있는 사원증 27.19-29.52
//         서비스 계정 토큰을 기본으로 넣어 둡니다 29.79-32.00 | 이 권한이 과하면 32.74-33.71
//         매수된 작업자는 34.00-*34.94 | 생산관리 서버에 접속해 *34.94-36.28 | 공장 정보를 캐고 36.57-37.57
//         결국 공장 전체를 장악할 수 있습니다 37.96-40.07
//         이렇게 40.84-41.24 | 처음 들어온 한 곳을 발판 삼아 41.50-43.14
//         옆에 있는 다른 시스템으로 옮겨 가며 43.48-*45.44 | 장악 범위를 넓히는 공격을 *45.44-46.88
//         측면이동 47.17-47.80 | 영어로 48.23-48.63 | 래터럴 무브먼트라고 합니다 48.86-50.32
//         문제는 51.09-51.58 | 이 일이 공장 안에서 시작된다는 겁니다 51.80-53.82
//         정문 보안은 54.55-55.37 | 외부인 출입만 보기 때문에 55.61-57.02
//         이미 구역 안에 있는 작업자가 57.39-*58.95 | 무엇을 내보내는지는 보지 못합니다 *58.95-60.89
// 04-3 박스는 해설 목소리라 해커 대사가 없다 → 'hype' 자막 없음.
const ASSETS = [
  ['c5', '../../capture/C5_gcloud_threat_crop.png'],
  ['sa', '../../assets/kubernetes community main icons-svg/resources/unlabeled/sa.svg'],
];
const SUBS = [
  [0.00, 1.98, '근데 공장 정문에 경비가 있잖아요?', 'norm'],
  [2.29, 4.52, '구역마다 검사원까지 꼭 둬야 해요?', 'norm'],
  [5.12, 7.13, '정문은 생각보다 쉽게 뚫립니다.', 'norm'],
  [7.72, 9.34, '구글 클라우드 보고서에 따르면,', 'norm'],
  [9.65, 12.79, '공격자가 처음 들어온 경로의 44.5퍼센트는', 'norm'],
  [13.07, 15.06, '패치하지 않은 소프트웨어의 취약점,', 'norm'],
  [15.46, 18.54, '27.2퍼센트는 약하거나 없는 인증 정보,', 'norm'],
  [18.88, 21.08, '21퍼센트는 설정 실수였습니다.', 'norm'],
  [21.46, 24.10, '이런 틈 하나면, 작업자 한 명이 매수되는 셈입니다.', 'norm'],
  [25.01, 27.01, '쿠버네티스는 공정 구역마다', 'norm'],
  [27.19, 29.52, '생산관리 서버에 접속할 수 있는 사원증,', 'norm'],
  [29.79, 32.00, '서비스 계정 토큰을 기본으로 넣어 둡니다.', 'norm'],
  [32.74, 34.94, '이 권한이 과하면, 매수된 작업자는', 'norm'],
  [34.94, 37.57, '생산관리 서버에 접속해 공장 정보를 캐고,', 'norm'],
  [37.96, 40.07, '결국 공장 전체를 장악할 수 있습니다.', 'norm'],
  [40.84, 43.14, '이렇게 처음 들어온 한 곳을 발판 삼아,', 'norm'],
  [43.48, 45.44, '옆에 있는 다른 시스템으로 옮겨 가며', 'norm'],
  [45.44, 46.88, '장악 범위를 넓히는 공격을', 'norm'],
  [47.17, 50.32, '측면이동, 영어로 lateral movement라고 합니다.', 'norm'],
  [51.09, 53.82, '문제는 이 일이 공장 안에서 시작된다는 겁니다.', 'norm'],
  [54.55, 57.02, '정문 보안은 외부인 출입만 보기 때문에,', 'norm'],
  [57.39, 58.95, '이미 구역 안에 있는 작업자가', 'norm'],
  [58.95, 60.89, '무엇을 내보내는지는 보지 못합니다.', 'norm'],
];

// ── 공장 배치 (월드 좌표) — ③ 끝 상태와 같다 (render/03_basics/scene.js 의 좌표·그리기 함수 복사) ──
// 가로 한 줄: 출고(frontend)·승인(auth)·차체(post)·도장(comment), 위 가운데 생산관리실, 가운데 통로,
// 레플리카로 구역이 위아래 두 줄. ④에서는 출구 검사원을 뺀다 (질문 "구역마다 검사원까지?"와 맞추기 위해).
// 정문·경비는 공장 왼쪽 벽, 통로 끝에 둔다.
const CX = [370, 750, 1130, 1510], ZW = 300, ZH = 200, ROWY = [420, 700];
const SV = ['frontend', 'auth', 'post', 'comment'], PROC = ['출고 담당', '승인 담당', '차체 공정', '도장 공정'];
const N = ['fe', 'auth', 'post', 'comm'];
const CR = { x: 760, y: 150, w: 400, h: 150 }, BLD = { x: 140, y: 70, w: 1640, h: 910 };
const GATE = [606, 714];                          // 왼쪽 벽의 정문 틈 (y), 통로(638~682)와 이어진다
const GUARD = [78, 540];                          // 정문 경비 (벽 바깥)
const WS = 0.75;                                  // 작업자 크기 (③과 같다)
const zoneBox = (i, r) => ({ x: CX[i] - ZW/2, y: ROWY[r], w: ZW, h: ZH });
const WKP = (i, r) => [CX[i] - 70, ROWY[r] + (r === 0 ? 110 : 118)];
const INS = (i, r) => [CX[i] + (r === 0 ? 50 : 100), r === 0 ? 588 : 748];   // ③ 검사원 자리 (질문 장면 흐린 표시용)
const PW0 = WKP(2, 0);                            // 매수되는 작업자: 차체 윗줄

// 침해 정도: [시작, 해제] 구간
const KW = {
  post0: [[22.95, 99]],
  cr:    [[35.25, 40.4], [44.25, 50.9]],
  comm0: [[38.35, 40.4], [43.8, 50.9]],
  auth0: [[38.55, 40.4], [46.3, 50.9]],
  fe0:   [[38.75, 40.4], [44.85, 50.9]],
  post1: [[38.95, 40.4], [45.7, 50.9]],
  comm1: [[39.05, 40.4], [45.9, 50.9]],
  auth1: [[39.15, 40.4], [45.4, 50.9]],
  fe1:   [[39.25, 40.4], [46.1, 50.9]],
};
const kOf = (n, t) => Math.max(0, ...KW[n].map(([a, r]) => win(t, a, a + 0.45, r, r + 0.6)));

const FULL = [920, 510, 0.83];
const CAM = [
  [0, 60, 560, 1.3], [2.2, 70, 560, 1.32], [3.4, ...FULL], [4.9, ...FULL],
  [5.9, 120, 620, 1.2], [7.2, 150, 620, 1.25],
  [20.5, ...FULL], [22.35, ...FULL], [23.3, 1080, 520, 1.7], [24.7, 1080, 520, 1.78],
  [25.7, ...FULL], [26.9, ...FULL], [27.9, 1060, 540, 2.0], [31.9, 1060, 540, 2.1],
  [33.0, 1000, 420, 1.3], [37.7, 1000, 420, 1.34], [38.6, ...FULL],
  [40.5, ...FULL], [41.6, 1120, 540, 1.3], [43.0, 1120, 540, 1.34], [43.8, ...FULL],
  [46.4, ...FULL], [47.25, 940, 185, 0.52], [50.8, 940, 185, 0.52], [51.7, ...FULL],
  [54.3, ...FULL], [55.2, 40, 560, 1.25], [57.2, 55, 560, 1.28], [58.3, ...FULL], [61.4, 920, 510, 0.85],
];

// ── 도구 ──
function polyLen(pts){ let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); return s; }
function polyAt(pts, u){
  let d = clamp(u)*polyLen(pts);
  for (let i = 1; i < pts.length; i++){
    const l = Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
    if (d <= l || i === pts.length-1) return along(pts[i-1][0], pts[i-1][1], pts[i][0], pts[i][1], l ? clamp(d/l) : 0);
    d -= l;
  }
  return pts[pts.length-1];
}
function polyFlow(pts, t, col, a, w){ for (let i = 1; i < pts.length; i++) flowLine(pts[i-1][0], pts[i-1][1], pts[i][0], pts[i][1], t, col, a, w); }
// ③과 같은 통로 경로: 구역 안 → 출입문 → 통로 → 상대 구역
function itemPath(a, ra, b, rb){
  const ys = r => r === 0 ? 555 : 775, yd = r => r === 0 ? 620 : 700, lane = a < b ? 650 : 670;
  return [[CX[a], ys(ra)], [CX[a], yd(ra)], [CX[a], lane], [CX[b], lane], [CX[b], yd(rb)], [CX[b], ys(rb)]];
}
function bez(x1, y1, cx, cy, x2, y2, u){ const a = 1-u; return [a*a*x1 + 2*a*u*cx + u*u*x2, a*a*y1 + 2*a*u*cy + u*u*y2]; }
function hopArrow(x1, y1, x2, y2, u, col, bend=0.25, w=8, a=1){
  if (u <= 0 || a <= 0) return;
  const cx = (x1+x2)/2 - (y2-y1)*bend, cy = (y1+y2)/2 + (x2-x1)*bend;
  withAlpha(a, () => {
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1);
    const M = 40;
    for (let i = 1; i <= M*u; i++) ctx.lineTo(...bez(x1, y1, cx, cy, x2, y2, i/M));
    const [ex, ey] = bez(x1, y1, cx, cy, x2, y2, u), [px, py] = bez(x1, y1, cx, cy, x2, y2, Math.max(0, u - 0.04));
    ctx.lineTo(ex, ey); ctx.stroke();
    ctx.translate(ex, ey); ctx.rotate(Math.atan2(ey-py, ex-px));
    ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-14, -15); ctx.lineTo(-14, 15); ctx.closePath(); ctx.fill();
  });
}
function shieldPath(){
  ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(17,-13); ctx.lineTo(15,6); ctx.quadraticCurveTo(10,18,0,24); ctx.quadraticCurveTo(-10,18,-15,6); ctx.lineTo(-17,-13); ctx.closePath();
}
function star(r){
  ctx.beginPath();
  for (let i = 0; i < 10; i++){ const q = i % 2 ? r*0.45 : r, an = -Math.PI/2 + i*Math.PI/5; ctx.lineTo(Math.cos(an)*q, Math.sin(an)*q); }
  ctx.closePath();
}
function shieldIcon(x, y, s, a){
  withAlpha(a, () => {
    ctx.translate(x, y); ctx.scale(s, s);
    shieldPath(); ctx.fillStyle = C.pnu; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.translate(0, 1); star(8.5); ctx.fillStyle = '#fff'; ctx.fill();
  });
}
// 정문 경비: 파란 조끼 + 방패 배지
function guardMan(x, y, s, a){
  person(x, y, s, a, C.pnu);
  withAlpha(a, () => {
    ctx.translate(x + 28*s, y + 2*s); ctx.scale(s, s);
    shieldPath(); ctx.fillStyle = C.pnu; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.translate(0, 1); star(8); ctx.fillStyle = '#fff'; ctx.fill();
  });
}
// 경비 시야 (바깥쪽 부채꼴)
function cone(t, a){
  if (a <= 0) return;
  const ox = GUARD[0] - 8, oy = GUARD[1] - 38, R = 380;
  const sw = Math.sin(t*1.3)*0.07, a0 = (160-30)*Math.PI/180 + sw, a1 = (160+30)*Math.PI/180 + sw;
  withAlpha(a, () => {
    const g = ctx.createRadialGradient(ox, oy, 10, ox, oy, R);
    g.addColorStop(0, 'rgba(250,204,21,0.62)'); g.addColorStop(1, 'rgba(250,204,21,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.arc(ox, oy, R, a0, a1); ctx.closePath(); ctx.fill();
  });
}

// ── ③에서 복사: 조각 아이콘 · 공정 소품 ──
function pieceGlyph(k, x, y, s, col){
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (k === 0){ rr(-28,-24,56,38,5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,14); ctx.lineTo(0,24); ctx.moveTo(-14,26); ctx.lineTo(14,26); ctx.stroke(); }
  else if (k === 1){ ctx.beginPath(); ctx.arc(-14,0,12,0,Math.PI*2); ctx.moveTo(-2,0); ctx.lineTo(28,0); ctx.moveTo(21,0); ctx.lineTo(21,11); ctx.moveTo(12,0); ctx.lineTo(12,8); ctx.stroke(); }
  else if (k === 2){ ctx.beginPath(); ctx.moveTo(-20,-26); ctx.lineTo(10,-26); ctx.lineTo(20,-16); ctx.lineTo(20,26); ctx.lineTo(-20,26); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); for (let j = 0; j < 3; j++){ ctx.moveTo(-10,-10+j*12); ctx.lineTo(j === 2 ? 2 : 10, -10+j*12); } ctx.stroke(); }
  else { rr(-28,-22,56,36,10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-10,14); ctx.lineTo(-16,26); ctx.lineTo(2,14); ctx.stroke();
    for (let j = -1; j <= 1; j++){ ctx.beginPath(); ctx.arc(j*12,-4,3.5,0,Math.PI*2); ctx.fill(); } }
  ctx.restore();
}
function carPath(){
  ctx.beginPath(); ctx.moveTo(-50,14); ctx.lineTo(-50,-4); ctx.quadraticCurveTo(-48,-10,-38,-10); ctx.lineTo(-24,-10); ctx.lineTo(-12,-26);
  ctx.lineTo(16,-26); ctx.lineTo(30,-10); ctx.lineTo(44,-8); ctx.quadraticCurveTo(50,-6,50,2); ctx.lineTo(50,14); ctx.closePath();
}
function wheels(col){ for (const wx of [-28, 28]){ ctx.beginPath(); ctx.arc(wx,14,10,0,Math.PI*2); ctx.fillStyle = col; ctx.fill(); ctx.beginPath(); ctx.arc(wx,14,4,0,Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); } }
function procGlyph(i, x, y, s, t, a){
  withAlpha(a, () => {
    ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (i === 0){
      const dx = 5*Math.sin(t*2.2);
      ctx.save(); ctx.translate(dx, 0); carPath(); ctx.fillStyle = C.green; ctx.fill(); wheels(C.navy); ctx.restore();
      ctx.strokeStyle = C.green; ctx.lineWidth = 4; for (let j = 0; j < 3; j++){ ctx.beginPath(); ctx.moveTo(-80+dx, -12+j*11); ctx.lineTo(-62+dx, -12+j*11); ctx.stroke(); }
    } else if (i === 1){
      const st = Math.abs(Math.sin(t*2.6));
      rr(-44, 14, 88, 20, 3); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.edge; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 24, 7, 0, Math.PI*2); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(220,38,38,${0.9*(1-st)})`; ctx.stroke();
      ctx.save(); ctx.translate(0, -st*20);
      ctx.beginPath(); ctx.arc(0,-34,10,0,Math.PI*2); ctx.fillStyle = '#7F1D1D'; ctx.fill();
      ctx.fillRect(-5,-26,10,18); rr(-22,-10,44,18,4); ctx.fillStyle = C.red; ctx.fill();
      ctx.restore();
    } else if (i === 2){
      carPath(); ctx.strokeStyle = C.sub; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]); wheels(C.dim);
      const f = 0.6 + 0.4*Math.sin(t*17);
      ctx.save(); ctx.translate(36, -22); ctx.fillStyle = C.amber; ctx.globalAlpha *= f; ctx.beginPath();
      for (let k = 0; k < 8; k++){ const r = k % 2 ? 4 : 11, an = k*Math.PI/4; k ? ctx.lineTo(r*Math.cos(an), r*Math.sin(an)) : ctx.moveTo(r, 0); }
      ctx.closePath(); ctx.fill(); ctx.restore();
    } else {
      carPath(); ctx.fillStyle = C.pnu; ctx.fill(); wheels(C.navy);
      rr(-78,-50,16,28,3); ctx.fillStyle = C.sub; ctx.fill(); ctx.fillRect(-74,-58,8,8);
      for (let j = 0; j < 5; j++){ const ph = (t*1.4 + j*0.2) % 1; ctx.beginPath(); ctx.arc(-60 + ph*40, -52 + ph*22 + (j%2)*6, 3.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,91,170,${0.8*(1-ph)})`; ctx.fill(); }
    }
  });
}
// 작업자 머리 위 파란 이름표 칩 (③ 끝 상태 = 펼쳐진 모양). 매수되면 빨강
function chip(i, x, y, a, col=C.pnu){
  withAlpha(a, () => {
    font(22); const m = ctx.measureText(SV[i]).width, w = 38 + m + 18, h = 38;
    ctx.translate(x + (w - 38)/2, y);
    rr(-w/2, -h/2, w, h, h/2); ctx.fillStyle = col; ctx.fill();
    pieceGlyph(i, -w/2 + 19, 0, 0.42, '#fff');
    font(22); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(SV[i], -w/2 + 38, 1);
  });
}
function drawZone(i, r, t){
  const b = zoneBox(i, r), k = kOf(N[i] + r, t), cx = CX[i];
  zone(b.x, b.y, b.w, b.h, null, 1, k);
  const dy = r === 0 ? b.y + ZH : b.y;   // 출입문 (윗줄은 아래, 아랫줄은 위 → 가운데 통로)
  ctx.fillStyle = '#F7F9FC'; ctx.fillRect(cx - 34, dy - 5, 68, 10);
  ctx.fillStyle = k > 0.5 ? C.red : C.edge; ctx.fillRect(cx - 40, dy - 10, 7, 20); ctx.fillRect(cx + 33, dy - 10, 7, 20);
  if (r === 0) text(PROC[i], cx, b.y - 28, 30, k > 0.5 ? C.red : C.text, 'center');
  procGlyph(i, cx + 62, r === 0 ? b.y + 78 : b.y + 150, 0.9, t, 1);
}
// 매수된 작업자: 작업자 → 해커 실루엣
function turnedWorker(x, y, s, k, t){
  if (k < 1) person(x, y, s, 1 - k);
  if (k > 0) hacker(x, y, s, k);
  const f = P(t, 22.95, 23.8);
  if (f > 0 && f < 1) withAlpha(1 - f, () => {
    ctx.strokeStyle = C.red; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x, y, 45 + 120*eo(f), 0, Math.PI*2); ctx.stroke();
  });
}
// 평소 오가는 요청서·부품 (③ ROUTES 와 같은 흐름, 검사원 없이)
const ROUTES = [[0,2,'doc',2.6,0.0],[0,3,'doc',2.9,0.9],[2,1,'doc',3.1,0.4],[3,2,'doc',3.7,1.7],[2,0,'part',3.3,1.9],[3,0,'part',3.5,0.3]];
function traffic(t){
  for (const [a, b, kind, per, ph] of ROUTES){
    const k0 = Math.floor((t - ph)/per);
    for (let k = k0 - 2; k <= k0; k++){
      const t0 = ph + k*per; if (t0 > t) continue;
      const ra = ((k % 2) + 2) % 2, rb = ra;
      if (Math.max(kOf(N[a] + ra, t), kOf(N[b] + rb, t)) > 0.5) continue;
      const pts = itemPath(a, ra, b, rb), dur = polyLen(pts)/300;
      if (t > t0 + dur) continue;
      const [x, y] = polyAt(pts, (t - t0)/dur), al = P(t, t0, t0 + 0.2) * (1 - P(t, t0 + dur - 0.25, t0 + dur));
      if (kind === 'doc') docSheet(x, y, 0.55, al, C.pnu); else partBox(x, y, 0.55, al, C.amber);
    }
  }
}

// ── 공장 (월드) ──
function factory(t){
  // 바깥 길 (정문으로 이어진다)
  ctx.fillStyle = '#E9EEF5'; ctx.fillRect(-900, 615, 1040, 90);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.setLineDash([26, 22]);
  ctx.beginPath(); ctx.moveTo(-900, 660); ctx.lineTo(140, 660); ctx.stroke(); ctx.setLineDash([]);

  // 공장 건물 (정문 자리만 비운다)
  const { x, y, w, h } = BLD, r = 26;
  rr(x, y, w, h, r); ctx.fillStyle = '#FBFCFE'; ctx.fill();
  const wallPath = () => {
    ctx.beginPath(); ctx.moveTo(x, GATE[1]); ctx.lineTo(x, y+h-r); ctx.arcTo(x, y+h, x+r, y+h, r); ctx.lineTo(x+w-r, y+h);
    ctx.arcTo(x+w, y+h, x+w, y+h-r, r); ctx.lineTo(x+w, y+r); ctx.arcTo(x+w, y, x+w-r, y, r); ctx.lineTo(x+r, y);
    ctx.arcTo(x, y, x, y+r, r); ctx.lineTo(x, GATE[0]);
  };
  ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = C.edge; wallPath(); ctx.stroke();
  const wk = win(t, 39.4, 39.9, 40.4, 41.0);
  if (wk > 0) withAlpha(wk, () => { ctx.shadowColor = C.red; ctx.shadowBlur = 30; ctx.lineWidth = 9; ctx.strokeStyle = C.red; wallPath(); ctx.stroke(); });
  // 톱니 지붕 + 이름 (③과 같다)
  ctx.fillStyle = C.sub; ctx.beginPath(); ctx.moveTo(x + 30, y + 62);
  for (let k = 0; k < 3; k++){ ctx.lineTo(x + 30 + k*22, y + 38); ctx.lineTo(x + 52 + k*22, y + 50); }
  ctx.lineTo(x + 96, y + 62); ctx.closePath(); ctx.fill();
  text('자동차 공장', x + 110, y + 50, 32, C.sub, 'left');

  // 통로 (정문까지 이어진다)
  ctx.fillStyle = '#EEF2F7'; ctx.fillRect(x, 638, w - 40, 44);
  ctx.strokeStyle = '#D5DEEA'; ctx.lineWidth = 2; ctx.setLineDash([18, 14]);
  ctx.beginPath(); ctx.moveTo(x + 10, 660); ctx.lineTo(x + w - 50, 660); ctx.stroke(); ctx.setLineDash([]);

  // 정문: 기둥 + 차단봉
  for (const gy of [GATE[0] - 26, GATE[1]]){ rr(x - 17, gy, 34, 26, 5); ctx.fillStyle = C.navy; ctx.fill(); }
  ctx.lineCap = 'butt'; ctx.lineWidth = 9;
  ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x, GATE[0]); ctx.lineTo(x, GATE[1]); ctx.stroke();
  ctx.strokeStyle = C.red; ctx.setLineDash([15, 15]); ctx.beginPath(); ctx.moveTo(x, GATE[0]); ctx.lineTo(x, GATE[1]); ctx.stroke(); ctx.setLineDash([]);
  const br = win(t, 6.15, 6.35, 7.0, 7.6);
  if (br > 0) withAlpha(br, () => {
    const g = ctx.createRadialGradient(x, 660, 5, x, 660, 230);
    g.addColorStop(0, 'rgba(220,38,38,0.45)'); g.addColorStop(1, 'rgba(220,38,38,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 240, 420, 480, 480);
    ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.lineJoin = 'round';
    const c1 = [[0, 660], [-22, 636], [-8, 618], [-30, 596]], c2 = [[0, 660], [24, 684], [6, 704], [28, 726]];
    for (const c of [c1, c2]){ ctx.beginPath(); ctx.moveTo(x + c[0][0], c[0][1]); for (const p of c.slice(1)) ctx.lineTo(x + p[0], p[1]); ctx.stroke(); }
  });

  // 생산관리실
  controlRoom(CR.x, CR.y, CR.w, CR.h, 1, kOf('cr', t));
  pill('API 서버', CR.x + 110, CR.y + CR.h + 36, 24, kOf('cr', t) > 0.5 ? C.red : C.pnu, win(t, 33.9, 34.3, 40.2, 40.6));

  // 번짐: 생산관리실 → 각 구역, 통로 → 아랫줄
  const sp = win(t, 38.2, 38.5, 40.4, 41.0);
  if (sp > 0){
    const S = [[790, 302, 505, 416], [880, 302, 885, 416], [1130, 302, 1375, 416]];
    S.forEach(([x1, y1, x2, y2], j) => { const u = eio(P(t, 38.2 + j*0.2, 38.6 + j*0.2)); if (u > 0) flowLine(x1, y1, lerp(x1, x2, u), lerp(y1, y2, u), t, C.red, sp, 5); });
    const cu = eo(P(t, 38.8, 39.3));
    flowLine(x + 20, 650, x + w - 60, 650, t, C.red, sp*cu, 5); flowLine(x + w - 60, 670, x + 20, 670, t, C.red, sp*cu, 5);
  }

  // 구역 (아랫줄 = 레플리카 먼저)
  for (let rw = 1; rw >= 0; rw--) for (let i = 0; i < 4; i++) drawZone(i, rw, t);
  traffic(t);

  // 작업자 + 이름표 + 사원증
  for (let rw = 0; rw < 2; rw++) for (let i = 0; i < 4; i++){
    const [wx, wy] = WKP(i, rw), bob = Math.sin(t*3.2 + i*1.7 + rw*0.9)*2.5, isP = i === 2 && rw === 0;
    const kt = isP ? eo(P(t, 22.95, 23.5)) : 0;
    if (isP) turnedWorker(wx, wy + bob, WS, kt, t); else person(wx, wy + bob, WS, 1);
    chip(i, wx, wy - 80, 1, kt > 0.5 ? C.red : C.pnu);
    const idx = rw*4 + i, t0 = 26.15 + 0.1*idx, ba = eo(P(t, t0, t0 + 0.3));
    if (ba > 0){
      let s = 0.36*(1 + 0.45*Math.exp(-Math.max(0, t - t0)*9)), glow = 0;
      if (isP){ const g = win(t, 32.7, 33.2, 37.5, 38.2), b = win(t, 27.2, 27.6, 32.4, 32.9); s *= 1 + 0.6*Math.max(g, b) + 0.06*b*Math.sin(t*7); glow = g; }
      withAlpha(ba, () => {
        if (glow > 0){ ctx.shadowColor = C.gold; ctx.shadowBlur = 30*glow; }
        idBadge(wx, wy + bob + 12 + 8*(s/0.36 - 1), s, 1, glow > 0.5 ? C.gold : C.pnu);
      });
    }
    // ③에서 본 출구 검사원 (질문 장면에서만 흐리게, 그 뒤엔 없다)
    const ga = win(t, 2.9 + 0.1*idx, 3.3 + 0.1*idx, 4.9, 5.4);
    if (ga > 0){
      const [ix, iy] = INS(i, rw);
      inspector(ix, iy, 0.6, 0.45*ga);
      text('?', ix + 34, iy - 62 + Math.sin(t*4 + idx)*4, 40, C.pnu, 'center', ga);
    }
  }
  pill('권한 과다', PW0[0] + 150, PW0[1] + 55, 24, C.red, win(t, 32.85, 33.2, 37.5, 38.0));

  // 매수된 작업자 → 생산관리 서버 접속 → 공장 정보를 캔다
  const AX = 1025, AY0 = PW0[1] - 30, AY1 = CR.y + CR.h + 2;
  const acc = win(t, 34.0, 34.3, 37.6, 38.1);
  if (acc > 0){
    flowLine(AX, AY0, AX, AY1, t, C.red, acc, 6);
    const u = eio(P(t, 34.1, 35.2));
    if (u > 0 && u < 1) idBadge(AX, lerp(AY0, AY1, u), 0.5, 1, C.gold);
    for (let j = 0; j < 3; j++){
      const v = P(t, 36.4 + j*0.3, 37.3 + j*0.3);
      if (v > 0 && v < 1) docSheet(AX, lerp(AY1, AY0, eio(v)), 0.6, 1, C.red);
    }
  }
  // 정문으로 몰래 들어온 공격자 → 차체 작업자를 매수
  if (t >= 5.8 && t < 23.0){
    const ia = Math.min(eo(P(t, 5.8, 6.0)), 1 - eo(P(t, 22.7, 23.0)));
    const ip = t < 21.5 ? along(-380, 680, 230, 668, eio(P(t, 5.9, 6.9)))
                        : polyAt([[230, 668], [1120, 668], [1130, 612], [PW0[0], PW0[1]]], eio(P(t, 21.5, 22.85)));
    hacker(ip[0], ip[1], 0.5, ia);
  }

  // 측면이동: 발판 → 옆으로 옆으로
  const fa = win(t, 41.3, 41.7, 50.9, 51.5);
  if (fa > 0){
    withAlpha(fa, () => { ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.ellipse(PW0[0], PW0[1] + 68, 70, 20, 0, 0, Math.PI*2); ctx.stroke(); ctx.setLineDash([]); });
    pill('발판', PW0[0] + 150, PW0[1] + 55, 30, C.red, fa, 0.6);
  }
  const HOPS = [
    [1250, 440, 1392, 500, -0.45, 43.55],   // 차체 → 도장
    [1395, 416, 1178, 250, 0.25, 44.0],     // 도장 → 생산관리실
    [742, 240, 505, 410, 0.25, 44.55],      // 생산관리실 → 출고
    [372, 628, 752, 696, 0.1, 45.05],       // 출고 → 승인(레플리카)
  ];
  for (const [x1, y1, x2, y2, b, t0] of HOPS)
    hopArrow(x1, y1, x2, y2, eio(P(t, t0, t0 + 0.4)), C.red, b, 9, win(t, t0, t0 + 0.08, 50.9, 51.5));
  // 장악 범위가 넓어진다
  const ra = win(t, 45.4, 45.6, 50.9, 51.5);
  if (ra > 0){
    const g = eio(P(t, 45.4, 46.9)), pb = zoneBox(2, 0);
    const bx = lerp(pb.x - 24, x + 18, g), by = lerp(pb.y - 66, y + 16, g);
    const bx1 = lerp(pb.x + pb.w + 24, x + w - 18, g), by1 = lerp(pb.y + pb.h + 16, y + h - 16, g);
    withAlpha(ra, () => { ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t*30;
      rr(bx, by, bx1 - bx, by1 - by, 24); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(220,38,38,0.05)'; ctx.fill(); });
  }

  // 공장 안에서 시작된다: 차체 구역에서 퍼지는 물결
  const ia2 = win(t, 51.1, 51.5, 53.9, 54.5);
  if (ia2 > 0){
    ctx.save(); rr(x, y, w, h, r); ctx.clip();
    for (let j = 0; j < 3; j++){
      const q = ((t - 51.1)*0.7 + j/3) % 1;
      withAlpha(ia2*(1 - q)*0.7, () => { ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(PW0[0], PW0[1], 60 + 520*q, 0, Math.PI*2); ctx.stroke(); });
    }
    ctx.restore();
  }

  // 사각지대: 안에서 밖으로 내보내는 것
  const bl = eo(P(t, 57.5, 58.3));
  if (bl > 0){
    ctx.save(); rr(x + 4, y + 4, w - 8, h - 8, 22); ctx.clip();
    withAlpha(bl, () => { ctx.strokeStyle = 'rgba(75,85,99,0.13)'; ctx.lineWidth = 3;
      for (let d = -1000; d < 1700; d += 28){ ctx.beginPath(); ctx.moveTo(x + d, y); ctx.lineTo(x + d + 910, y + 910); ctx.stroke(); } });
    ctx.restore();
    const outs = [itemPath(2, 0, 0, 0), itemPath(2, 0, 1, 1), itemPath(2, 0, 3, 1), [[AX, AY0], [AX, AY1]]];
    outs.forEach((pts, j) => {
      polyFlow(pts, t, C.red, bl*0.9, 5);
      const u = ((t - 57.5)*0.45 + j*0.25) % 1, [dx, dy] = polyAt(pts, u);
      docSheet(dx, dy, 0.6, bl*Math.min(1, u*5, (1 - u)*5), C.red);
    });
    pill('사각지대', 1420, 225, 40, C.text, bl, 0, 'rgba(255,255,255,0.97)');
  }

  // 정문 경비와 시야, 방문객
  const ce = Math.max(0.55, win(t, 54.5, 55.0, 70, 71));
  cone(t, ce*(1 + 0.25*Math.sin(t*5)*win(t, 55.5, 55.8, 56.8, 57.2)));
  const v1 = win(t, 0.1, 0.4, 3.2, 3.8), v1x = lerp(-460, -150, eo(P(t, 0.1, 1.4)));
  if (v1 > 0) userIcon(v1x, 690, 0.7, v1);
  const v2 = win(t, 54.4, 54.7, 70, 71), v2x = lerp(-460, -150, eo(P(t, 54.5, 55.7)));
  if (v2 > 0) userIcon(v2x, 690, 0.7, v2);
  guardMan(GUARD[0], GUARD[1], 0.95, 1);
  const sa = Math.max(win(t, 0.35, 0.65, 4.4, 4.9), win(t, 54.6, 54.9, 70, 71));
  if (sa > 0){
    const age = t < 20 ? t - 0.35 : t - 54.6;
    withAlpha(sa, () => { const pop = 1 + 0.3*Math.exp(-Math.max(0, age)*10); shieldIcon(GUARD[0], 405, 2.3*pop, 1); });
    pill('정문 경비', GUARD[0] - 175, 405, 28, C.pnu, sa);
  }
}

// ── 구글 클라우드 보고서 (원그래프) ──
const CARD = { x: 150, y: 150, w: 1000 };
const SC5 = 1000/1616;
const c5 = (sx, sy) => [CARD.x + sx*SC5, CARD.y + sy*SC5];
const PIE = [775, 675];
const SLICES = [
  { a0: -90, a1: 69,  r: 414, lab: null,                 t0: 11.3, t1: 15.3 },   // 소프트웨어 기반 침투 44.5%
  { a0: 69,  a1: 167, r: 326, lab: [118, 828, 436, 902], t0: 15.3, t1: 18.7 },   // 약하거나 없는 인증 27.2%
  { a0: 167, a1: 243, r: 326, lab: [118, 532, 318, 606], t0: 18.7, t1: 21.4 },   // 설정 오류 21.0%
];
const ROWS = [
  { n: '44.5%', lab: '소프트웨어 기반 침투',        dot: '#0079C1', tn: 11.85, tl: 13.07 },
  { n: '27.2%', lab: '약하거나 없는 인증 정보', dot: '#E53D26', tn: 15.46, tl: 17.07 },
  { n: '21%',   lab: '설정 실수',                dot: '#F7AA00', tn: 18.88, tl: 19.99 },
];
// 확대해도 카드가 창을 꽉 채우도록 초점 범위를 제한 (z 1.5: x 506~794, y 403~559)
const CAM_B = [[7.1, 650, 480, 1.0], [9.6, 650, 480, 1.0], [11.3, 760, 540, 1.5], [15.1, 770, 545, 1.52],
               [16.0, 510, 555, 1.5], [18.5, 515, 555, 1.52], [19.3, 510, 470, 1.5], [21.4, 515, 470, 1.52]];
function spot(sl, a){
  if (a <= 0) return;
  const [cx, cy] = c5(...PIE), r = sl.r*SC5, a0 = sl.a0*Math.PI/180, a1 = sl.a1*Math.PI/180;
  ctx.save();
  ctx.globalAlpha = 0.66*a; ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.rect(CARD.x - 14, CARD.y - 14, CARD.w + 28, 1070*SC5 + 28);
  ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
  if (sl.lab){ const [x0, y0] = c5(sl.lab[0], sl.lab[1]), [x1, y1] = c5(sl.lab[2], sl.lab[3]); ctx.rect(x0, y0, x1 - x0, y1 - y0); }
  ctx.fill('evenodd');
  ctx.globalAlpha = a; ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath(); ctx.stroke();
  ctx.restore();
}
function partB(t, bdx){
  if (bdx >= 1900) return;
  // 보고서 창
  ctx.save(); ctx.translate(bdx, 0);
  rr(90, 80, 1110, 800, 22); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.edge; ctx.stroke();
  rr(90, 80, 1110, 800, 22); ctx.clip();
  ctx.translate(-bdx, 0);
  const c = camAt(t, CAM_B);
  withCam(c, -315 + bdx, 10, () => {
    capCard('c5', null, CARD.x, CARD.y, CARD.w, 1, [
      { rects: [[42, 66, 1134, 108]], prog: P(t, 9.7, 10.9) },
      { rects: [[124, 834, 430, 862], [126, 871, 200, 897]], prog: P(t, 17.1, 17.9) },
      { rects: [[124, 538, 312, 566], [124, 574, 197, 600]], prog: P(t, 20.0, 20.6) },
    ], 'Google Cloud Threat Horizons Report H1 2026 (2025 하반기)');
    for (const sl of SLICES) spot(sl, win(t, sl.t0, sl.t0 + 0.4, sl.t1, sl.t1 + 0.4));
  });
  ctx.restore();

  // 오른쪽: 세 숫자 (왼쪽 정렬)
  ctx.save(); ctx.translate(bdx, 0);
  const LX = 1360;
  text('공격자가 처음 들어온 경로', LX, 150, 34, C.sub, 'left', eo(P(t, 8.0, 8.6)));
  ROWS.forEach((r, i) => {
    const y = 290 + i*205, na = eo(P(t, r.tn - 0.05, r.tn + 0.2));
    const next = ROWS[i+1], dim = next ? 1 - 0.5*eo(P(t, next.tn - 0.1, next.tn + 0.3)) : 1;
    withAlpha(na*dim, () => {
      const age = t - r.tn, pop = 1 + 0.28*Math.exp(-Math.max(0, age)*12);
      ctx.save(); ctx.translate(LX, y); ctx.scale(pop, pop);
      ctx.font = '900 132px KRH'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round'; ctx.lineWidth = 132*0.09; ctx.strokeStyle = '#fff'; ctx.strokeText(r.n, 0, 0);
      ctx.fillStyle = C.gold; ctx.fillText(r.n, 0, 0); ctx.restore();
    });
    const la = eo(P(t, r.tl - 0.05, r.tl + 0.3))*dim;
    if (la > 0){
      withAlpha(la, () => { ctx.beginPath(); ctx.arc(LX + 11, y + 92, 11, 0, Math.PI*2); ctx.fillStyle = r.dot; ctx.fill(); });
      text(r.lab, LX + 34 + 18*(1 - la), y + 92, 40, C.text, 'left', la);
    }
  });
  ctx.restore();
}

function draw(t){
  background();
  const out = eio(P(t, 7.1, 7.8)), back = eio(P(t, 21.0, 21.7));
  const fdx = -2100*(out - back), bdx = 2000*(1 - out) + 2000*back;
  if (fdx > -2000){
    withCam(camAt(t, CAM), fdx, 0, () => factory(t));
    // 용어 카드: 사원증 = 서비스 계정 토큰
    const ta = win(t, 27.4, 27.9, 32.3, 32.9);
    if (ta > 0){ ctx.save(); ctx.translate(430 + fdx, 150 + 20*(1 - eo(P(t, 27.4, 28.0)))); ctx.scale(1.3, 1.3);
      termCard('생산관리 서버 접속용 사원증', '서비스 계정 토큰', 0, 0, ta, 'sa', 480); ctx.restore(); }
    // 정의: 측면이동 (Lateral Movement)
    const da = win(t, 47.1, 47.3, 50.45, 50.85);
    if (da > 0){
      punch('측면이동', 960, 175, 170, C.red, da, t - 47.17);
      punch('Lateral Movement', 960, 318, 84, C.text, win(t, 48.8, 49.0, 50.45, 50.85), t - 48.86);
    }
  }
  partB(t, bdx);
  // 자막 자리: 아래쪽을 하얗게 정리
  const fg = ctx.createLinearGradient(0, 878, 0, 940);
  fg.addColorStop(0, 'rgba(255,255,255,0)'); fg.addColorStop(1, 'rgba(255,255,255,1)');
  ctx.fillStyle = fg; ctx.fillRect(0, 878, W, 62); ctx.fillStyle = '#fff'; ctx.fillRect(0, 940, W, H - 940);
  guard(1);
  drawSubs(t, SUBS);
}
