// ③ 기초 개념 — TTS_03 v3 (재녹음) 0.0~130.31s (파일 130.31, duration 130.6)
// 문장·구 경계 (silencedetect noise=-33dB d=0.28 + noise=-30dB d=0.13 실측, 긴 구간 안쪽은 글자 수 비례)
// 03-0  그 답을 보여드리려면 0.20-1.48 | 요즘 웹 서비스가…봐야 합니다 1.79-4.67 | 대부분 클라우드 위에서 돌아갑니다 5.11-7.04
// 03-1  (질문자) 근데 클라우드가 정확히 뭐예요? 7.64-9.96
// 03-2  컴퓨터를 직접 사지 않고 빌려 쓰는 겁니다 10.82-13.20 | 요즘 대규모 웹 서비스는 보통 13.78-15.72
//       이 빌린 컴퓨터 위에서 하나의 프로그램을…나눠서 돌립니다 15.94-19.77 | 이걸 마이크로서비스 구조 20.25-21.65 | 엠에스에이라고 합니다 21.86-23.01
//       바쁜 조각만 골라 늘릴 수 있고 23.69-26.15 | 한 조각이 멈춰도…않습니다 26.46-28.73
//       (클라우드 네이티브, 재서술·길어짐) 이렇게 MSA나 컨테이너화 같은 기술을 활용해 29.34-32.19
//       클라우드의 장점을 최대한 살리도록…운영하는 방식을, 클라우드 네이티브라고 합니다 32.54-36.48
//       지금부턴 자동차 공장으로 비유해보겠습니다 36.88-38.35 | 자동차 만드는 과정을 공정별로 나누고 38.93-41.42 | 자기 일만 맡는 방식 41.93-44.13
//       저희는 실험할 게시판을…네 조각으로 나눠봤습니다 44.52-47.34
//       frontend 출고 48.22-50.27 | auth 승인 50.53-51.86 | post 차체 52.64-55.13 | comment 도장…비유해보겠습니다 56.01-57.92
// 03-3  (질문자) 공정끼리는 어떻게 소통해요? 58.88-60.95
// 03-4a 작업 요청서를 주고받습니다…승인 담당에게 62.08-65.30 | 이 작업지시서 승인된 거 맞나요?…묻습니다 66.31-68.66
//       이렇게 오가는 요청서와 완성 부품이 69.65-71.15 | 바로 네트워크 트래픽입니다 71.64-74.26
// 03-4b …도구가 쿠버네티스입니다 74.55-77.43 | 쿠버네티스 용어로 바꾸면 77.88-79.83 | 공장 전체가 클러스터 80.07-81.56
//       어느 구역에…생산관리실이 마스터 노드 82.30-85.50 | 공정 구역 하나가 파드 86.04-87.50
//       그 구역에서…작업자가 컨테이너입니다 87.72-92.81 | 모든 공정은…두 개씩 운영합니다 (~91.0-94.60)
//       한 곳이 멈춰도 생산이 이어지게요 | 이걸 레플리카라고 합니다 95.25-97.83
//       마지막으로…검사원이 한 명씩 서 있습니다 98.56-101.31 | 들어오는 것은 그냥 넘기고 101.90-103.58
//       구역에서 밖으로…검사합니다 104.12-106.84 | 이 검사원이 사이드카 프록시, 오늘의 주인공입니다 107.05-109.71
//       이렇게 구역마다 검사원을 붙이고 110.20-111.61 | 생산관리실에서 한꺼번에 관리해서 111.85-114.12
//       작업자는 그대로 둔 채 114.69-116.26 | 오가는 요청서만 통제하는 116.48-117.49 | 구조를 서비스메시라고 합니다 118.25-122.10
//       저희 과제는 이 서비스메시를 122.47-126.53 | 새로운 구조로 만드는 것입니다 127.12-130.16
// 단어 시점(글자 수 비례): 마이크로서비스 20.25, 클라우드 네이티브 35.25, frontend 49.0, auth 51.0, post 53.3, comment 56.5,
//   네트워크 트래픽 72.5, 쿠버네티스 76.5, 클러스터 81.0, 마스터 노드 85.0, 파드 87.0, 컨테이너 90.5, 레플리카 96.9,
//   사이드카 프록시 108.0, 서비스메시 120.1
const ASSETS = [
  ['k8s', '../../assets/image/k8s_icon.svg'],
  ['cp', '../../assets/kubernetes community main icons-svg/infrastructure_components/unlabeled/control-plane.svg'],
  ['pod', '../../assets/kubernetes community main icons-svg/resources/unlabeled/pod.svg'],
  ['rs', '../../assets/kubernetes community main icons-svg/resources/unlabeled/rs.svg'],
];
// 컨테이너는 공식 아이콘 세트에 없어 같은 모양(파란 칠각형 + 흰 상자)으로 직접 그린다
(function(){
  const c = document.createElement('canvas'); c.width = 160; c.height = 160; const g = c.getContext('2d');
  g.beginPath();
  for (let i = 0; i < 7; i++){ const a = -Math.PI/2 + i*2*Math.PI/7, x = 80 + 74*Math.cos(a), y = 84 + 74*Math.sin(a); i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.closePath(); g.fillStyle = '#326CE5'; g.fill(); g.lineWidth = 6; g.strokeStyle = '#fff'; g.stroke();
  g.strokeStyle = '#fff'; g.lineWidth = 7; g.lineJoin = 'round'; g.beginPath();
  g.moveTo(80, 42); g.lineTo(116, 61); g.lineTo(116, 105); g.lineTo(80, 124); g.lineTo(44, 105); g.lineTo(44, 61); g.closePath();
  g.moveTo(44, 61); g.lineTo(80, 80); g.lineTo(116, 61); g.moveTo(80, 80); g.lineTo(80, 124); g.stroke();
  IMG.ctr = c;
})();

const SUBS = [
  [0.133, 1.633, '그 답을 보여드리려면,', 'norm'],
  [1.800, 4.666, '요즘 웹 서비스가 어디서 돌아가는지부터 봐야 합니다.', 'norm'],
  [5.100, 7.066, '대부분 클라우드 위에서 돌아갑니다.', 'norm'],
  [7.600, 10.066, '근데 클라우드가 정확히 뭐예요?', 'norm'],
  [10.766, 13.200, '컴퓨터를 직접 사지 않고 빌려 쓰는 겁니다.', 'norm'],
  [13.700, 15.766, '요즘 대규모 웹 서비스는 보통,', 'norm'],
  [15.800, 19.766, '이 빌린 컴퓨터 위에서 하나의 프로그램을 여러 조각으로 나눠서 돌립니다.', 'norm'],
  [20.566, 23.333, '이걸 마이크로서비스 구조, MSA라고 합니다.', 'norm'],
  [24.100, 26.800, '이렇게 나누면 바쁜 조각만 골라 늘릴 수 있고,', 'norm'],
  [26.800, 29.200, '한 조각이 멈춰도 전체가 멈추지 않습니다.', 'norm'],
  [30.233, 33.366, '이렇게 MSA나 컨테이너화 같은 기술을 활용해', 'norm'],
  [33.366, 37.766, '클라우드의 장점을 최대한 살리도록 서비스를 설계하고 운영하는 방식을,', 'norm'],
  [37.766, 39.333, '클라우드 네이티브라고 합니다.', 'norm'],
  [40.166, 42.666, '지금부턴 자동차 공장으로 비유해보겠습니다.', 'norm'],
  [43.200, 45.733, '자동차 만드는 과정을 공정별로 나누고,', 'norm'],
  [45.733, 48.666, '각 공정의 작업자가 자기 일만 맡는 방식입니다.', 'norm'],
  [49.466, 53.166, '저희는 실험할 게시판을 직접 만들어 네 조각으로 나눠봤습니다.', 'norm'],
  [53.833, 56.800, '화면을 보여주는 frontend를 출고 담당으로,', 'norm'],
  [57.200, 59.533, '로그인을 맡는 auth를 승인 담당으로,', 'norm'],
  [60.100, 62.500, '게시글을 맡는 post를 차체 공정으로,', 'norm'],
  [63.300, 66.600, '댓글을 맡는 comment를 도장 공정으로 비유해보겠습니다.', 'norm'],
  [67.600, 69.900, '공정끼리는 어떻게 소통해요?', 'norm'],
  [70.900, 75.666, '작업 요청서를 주고받습니다. 차체 공정은 작업 전에 승인 담당에게,', 'norm'],
  [75.666, 78.633, '"이 작업지시서 승인된거 맞나요?"라고 묻습니다.', 'norm'],
  [79.100, 81.233, '이렇게 오가는 요청서와 완성 부품이', 'norm'],
  [81.233, 82.900, '바로 네트워크 트래픽입니다.', 'norm'],
  [83.433, 86.833, '이런 공장을 실제로 운영해 주는 도구가 쿠버네티스입니다.', 'norm'],
  [87.233, 88.866, '쿠버네티스 용어로 바꾸면,', 'norm'],
  [88.966, 90.433, '공장 전체가 클러스터,', 'norm'],
  [90.833, 94.266, '어느 구역에 무엇을 배치할지 정하는 생산관리실이 마스터 노드,', 'norm'],
  [94.633, 96.066, '공정 구역 하나가 Pod,', 'norm'],
  [96.466, 99.133, '그 구역에서 실제로 일하는 작업자가 컨테이너입니다.', 'norm'],
  [99.766, 102.766, '그리고 모든 공정은 똑같은 구역을 두 개씩 운영합니다.', 'norm'],
  [103.033, 106.700, '한 곳이 멈춰도 생산이 이어지게요. 이걸 레플리카라고 합니다.', 'norm'],
  [107.333, 111.166, '마지막으로, 공정 구역마다 출구에 검사원이 한 명씩 서 있습니다.', 'norm'],
  [111.333, 112.966, '들어오는 것은 그냥 넘기고,', 'norm'],
  [113.000, 115.433, '구역에서 밖으로 나가는 것만 전부 검사합니다.', 'norm'],
  [115.800, 118.833, '이 검사원이 사이드카 프록시, 오늘의 주인공입니다.', 'norm'],
  [119.433, 121.333, '이렇게 구역마다 검사원을 붙이고', 'norm'],
  [121.400, 123.566, '생산관리실에서 한꺼번에 관리해서,', 'norm'],
  [123.633, 124.866, '작업자는 그대로 둔 채', 'norm'],
  [124.933, 126.366, '오가는 요청서만 통제하는', 'norm'],
  [126.366, 127.933, '이 구조를 서비스메시라고 합니다.', 'norm'],
  [128.366, 129.966, '저희 과제는 이 서비스메시를', 'norm'],
  [129.966, 131.466, '새로운 구조로 만드는 것입니다.', 'norm'],
];

// ─────────────── 공통 소도구 ───────────────
const w2s = (c, x, y) => [960 + (x - c[0])*c[2], 470 + (y - c[1])*c[2]];
function polyLen(pts){ let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); return s; }
function polyAt(pts, u){
  const L = polyLen(pts); let d = clamp(u)*L;
  for (let i = 1; i < pts.length; i++){
    const l = Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
    if (d <= l || i === pts.length-1) return along(pts[i-1][0], pts[i-1][1], pts[i][0], pts[i][1], l ? clamp(d/l) : 0);
    d -= l;
  }
  return pts[pts.length-1];
}
// keys = [[t, u], ...] 구간마다 부드럽게
function keyU(t, keys){
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length-1; i++){ const a = keys[i], b = keys[i+1]; if (t <= b[0]) return lerp(a[1], b[1], eio(P(t, a[0], b[0]))); }
  return keys[keys.length-1][1];
}
function glowStroke(x, y, w, h, r, col, k, lw=5){
  if (k <= 0) return;
  withAlpha(k, () => { ctx.shadowColor = col; ctx.shadowBlur = 26; rr(x, y, w, h, r); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.stroke(); });
}
function cloudShape(cx, cy, w, fill, stroke, lw=6){
  const B = [[-0.30,0.05,0.16],[-0.12,-0.09,0.21],[0.12,-0.06,0.19],[0.31,0.06,0.14],[0.0,0.09,0.18]];
  ctx.save();
  if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw; for (const [bx,by,br] of B){ ctx.beginPath(); ctx.arc(cx+bx*w, cy+by*w, br*w, 0, Math.PI*2); ctx.stroke(); } }
  ctx.fillStyle = fill; for (const [bx,by,br] of B){ ctx.beginPath(); ctx.arc(cx+bx*w, cy+by*w, br*w, 0, Math.PI*2); ctx.fill(); }
  ctx.restore();
}
function sparkle(x, y, r, col, a){
  withAlpha(a, () => { ctx.translate(x, y); ctx.beginPath();
    ctx.moveTo(0,-r); ctx.quadraticCurveTo(0,0,r,0); ctx.quadraticCurveTo(0,0,0,r); ctx.quadraticCurveTo(0,0,-r,0); ctx.quadraticCurveTo(0,0,0,-r);
    ctx.fillStyle = col; ctx.fill(); });
}

// 질문자 (링 아나운서): 정장 + 나비넥타이 + 마이크, 말풍선 물음표
function asker(t, t0, t1){
  const a = win(t, t0, t0+0.4, t1, t1+0.45); if (a <= 0) return;
  const x = 1735 + 140*(1 - eo(P(t, t0, t0+0.45))), y = 770, s = 1.05;
  withAlpha(a, () => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-38,-6,76,92,26); ctx.fillStyle = '#374151'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-13,-6); ctx.lineTo(0,20); ctx.lineTo(13,-6); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(0,2); ctx.lineTo(-13,-6); ctx.lineTo(-13,10); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0,2); ctx.lineTo(13,-6); ctx.lineTo(13,10); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0,-36,23,0,Math.PI*2); ctx.fillStyle = C.skin; ctx.fill();
    ctx.beginPath(); ctx.arc(0,-40,25,Math.PI*1.02,Math.PI*1.98); ctx.closePath(); ctx.fillStyle = '#1f2937'; ctx.fill();
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-28,24); ctx.lineTo(-40,-2); ctx.stroke();
    rr(-46,-30,11,30,4); ctx.fillStyle = '#6B7280'; ctx.fill();
    ctx.beginPath(); ctx.arc(-40.5,-33,10,0,Math.PI*2); ctx.fillStyle = '#111827'; ctx.fill();
    ctx.restore();
  });
  // 말풍선
  const age = t - t0 - 0.25, b = eo(P(age, 0, 0.3)) * a;
  if (b <= 0) return;
  const pop = 1 + 0.3*Math.exp(-Math.max(0, age)*9), bx = x - 150, by = y - 170 + Math.sin(t*3)*4;
  withAlpha(b, () => {
    ctx.translate(bx, by); ctx.scale(pop, pop);
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.18)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.ellipse(0, 0, 78, 64, 0, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 3; ctx.strokeStyle = C.amber; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40, 46); ctx.lineTo(92, 96); ctx.lineTo(18, 60); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(40, 49); ctx.lineTo(92, 96); ctx.lineTo(21, 62); ctx.stroke();
    ctx.font = '900 88px KRH'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.amber; ctx.fillText('?', 0, 4);
  });
}

// ─────────────── A. 웹 서비스 → 클라우드에서 빌려 쓴다 (0~14.7) ───────────────
function browserWin(x, y, w, h, a){
  withAlpha(a, () => {
    const k = w/760;
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.18)'; ctx.shadowBlur = 30*k; ctx.shadowOffsetY = 10*k;
    rr(x, y, w, h, 12*k); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.edge; ctx.stroke();
    const bh = 44*k;
    ctx.save(); rr(x, y, w, h, 12*k); ctx.clip();
    ctx.fillStyle = '#EEF2F7'; ctx.fillRect(x, y, w, bh);
    ['#F87171','#FBBF24','#34D399'].forEach((c, j) => { ctx.beginPath(); ctx.arc(x+24*k+j*20*k, y+bh/2, 6*k, 0, Math.PI*2); ctx.fillStyle = c; ctx.fill(); });
    rr(x+100*k, y+10*k, w-130*k, bh-20*k, 8*k); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = C.pnu; ctx.fillRect(x, y+bh, w, 58*k);
    ctx.font = `700 ${Math.max(6, 30*k)}px KR`; ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('게시판', x+26*k, y+bh+30*k);
    for (let j = 0; j < 5; j++){
      const ry = y + bh + 80*k + j*64*k;
      rr(x+26*k, ry, w-52*k, 48*k, 6*k); ctx.fillStyle = '#F1F5FA'; ctx.fill();
      ctx.fillStyle = '#9CA3AF'; ctx.fillRect(x+46*k, ry+13*k, (w-52*k)*[0.42,0.55,0.36,0.48,0.3][j], 9*k);
      ctx.fillStyle = '#D1D9E6'; ctx.fillRect(x+46*k, ry+30*k, (w-52*k)*0.22, 7*k);
    }
    ctx.restore();
  });
}
function rack(x, y, w, h, t, a, seed, lit){
  withAlpha(a, () => {
    rr(x, y, w, h, 8); ctx.fillStyle = '#2B3A55'; ctx.fill();
    const n = 6, uh = (h - 20)/n;
    for (let j = 0; j < n; j++){
      const yy = y + 10 + j*uh;
      rr(x+8, yy+3, w-16, uh-6, 3); ctx.fillStyle = '#3B4D6E'; ctx.fill();
      const on = Math.sin(t*(5 + 3*lit) + j*1.7 + seed*2.3) > -0.2;
      ctx.fillStyle = on ? '#4ADE80' : '#1F7A45'; ctx.beginPath(); ctx.arc(x + w - 20, yy + uh/2, 4.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#5B6E90'; ctx.fillRect(x+16, yy+uh/2-2, w*0.42, 4);
    }
  });
}
function pcIcon(x, y, s, a){
  withAlpha(a, () => {
    ctx.translate(x, y); ctx.scale(s, s);
    rr(-80,-52,116,80,8); ctx.fillStyle = C.navy; ctx.fill();
    rr(-72,-44,100,62,4); ctx.fillStyle = '#6EA8FE'; ctx.fill();
    ctx.fillStyle = C.navy; ctx.fillRect(-29,28,14,14); ctx.fillRect(-48,42,52,8);
    rr(46,-52,40,100,6); ctx.fillStyle = '#374151'; ctx.fill();
    ctx.beginPath(); ctx.arc(66,-34,5,0,Math.PI*2); ctx.fillStyle = '#4ADE80'; ctx.fill();
    ctx.fillStyle = '#4B5563'; ctx.fillRect(54,-16,24,4); ctx.fillRect(54,-6,24,4);
  });
}
const RACKS = [[1095, 262], [1220, 262], [1345, 262]];   // (x, y) 폭 110 높이 210
const LINE_A = [616, 612], LINE_B = [1092, 430];
function partA(t){
  const worldA = 1 - eo(P(t, 14.011, 14.594)); if (worldA <= 0) return;
  const c = camAt(t, [[0, 960, 470, 1.0], [4.991, 960, 470, 1.0], [13.719, 960, 470, 1.03], [14.594, 1275, 370, 3.0]]);
  withAlpha(worldA, () => withCam(c, 0, 0, () => {
    const u = eio(P(t, 4.991, 6.078));
    // 클라우드 + 데이터센터
    const ca = eo(P(t, 5.288, 5.979));
    if (ca > 0) withAlpha(ca, () => {
      cloudShape(1275, 300 - 30*(1 - ca), 800, '#E6F0FA', '#C4D8EF');
      text('클라우드', 1275, 150 - 30*(1 - ca), 46, C.pnu, 'center');
    });
    const lit = win(t, 12.035, 12.431, 14.4, 14.886);
    RACKS.forEach(([x, y], j) => rack(x, y, 110, 210, t, eo(P(t, 5.7 + j*0.12, 6.2 + j*0.12)), j, lit));
    text('데이터센터', 1275, 500, 26, C.sub, 'center', eo(P(t, 6.177, 6.572)), 400);
    // 빌려 쓰는 선
    const la = eo(P(t, 6.078, 6.572));
    if (la > 0){
      flowLine(LINE_A[0], LINE_A[1], LINE_B[0], LINE_B[1], t, C.green, la, 3 + 3*lit);
      for (let j = 0; j < 3; j++){
        const v = ((t*0.45 + j/3) % 1), [px, py] = along(LINE_A[0], LINE_A[1], LINE_B[0], LINE_B[1], v);
        withAlpha(la, () => { ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI*2); ctx.fillStyle = C.green; ctx.fill(); });
      }
    }
    pill('빌려 쓰기', 860, 462, 34, C.green, eo(P(t, 12.084, 12.431)), eo(P(t, 12.084, 12.431)));
    // 직접 사는 컴퓨터 → X
    const pa = win(t, 10.746, 11.143, 13.323, 13.817);
    if (pa > 0){
      pcIcon(760, 320, 1.0, pa * (1 - 0.45*eo(P(t, 11.837, 12.233))));
      pill('직접 구매', 760, 214, 30, C.sub, pa);
      const x1 = eio(P(t, 11.589, 11.787)), x2 = eio(P(t, 11.737, 11.936));
      withAlpha(pa, () => {
        ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.lineCap = 'round';
        if (x1 > 0){ ctx.beginPath(); ctx.moveTo(670, 250); ctx.lineTo(670 + 180*x1, 250 + 130*x1); ctx.stroke(); }
        if (x2 > 0){ ctx.beginPath(); ctx.moveTo(850, 250); ctx.lineTo(850 - 180*x2, 250 + 130*x2); ctx.stroke(); }
      });
    }
    // 사용자 + 노트북 (웹 브라우저가 노트북 화면으로 줄어든다)
    const ua = eo(P(t, 5.387, 5.881));
    userIcon(290, 690, 1.05, ua);
    text('사용자', 290, 790, 26, C.sub, 'center', ua, 400);
    const r0 = [490, 165 + 40*(1 - eo(P(t, 0.067, 0.657))), 940, 615], r1 = [415, 548, 190, 118];
    const bx = lerp(r0[0], r1[0], u), by = lerp(r0[1], r1[1], u), bw = lerp(r0[2], r1[2], u), bh = lerp(r0[3], r1[3], u);
    if (u > 0) withAlpha(u, () => {
      rr(bx - 10, by - 10, bw + 20, bh + 20, 10); ctx.fillStyle = '#374151'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx - 30, by + bh + 10); ctx.lineTo(bx + bw + 30, by + bh + 10); ctx.lineTo(bx + bw + 52, by + bh + 32); ctx.lineTo(bx - 52, by + bh + 32); ctx.closePath();
      ctx.fillStyle = '#6B7280'; ctx.fill();
    });
    browserWin(bx, by, bw, bh, eo(P(t, 0.067, 0.552)));
    // 어디서 돌아갈까?
    const qa = win(t, 2.307, 2.605, 4.792, 5.189);
    if (qa > 0){ punch('?', 1560 + Math.sin(t*2)*6, 250, 150, C.pnu, qa, t - 2.307); punch('?', 1660, 410 + Math.sin(t*2.5+1)*6, 90, C.dim, qa*eo(P(t, 2.903, 3.202)), t - 2.903); }
  }));
}

// ─────────────── B·C. 프로그램이 조각으로 (MSA) → 늘리기·멈춤 (클라우드 네이티브) ───────────────
const PX = [480, 800, 1120, 1440], PY = 480, PW = 220, PH = 140;
const PNAME = ['화면', '로그인', '게시글', '댓글'];
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
function pieceBox(k, x, y, w, h, t, labA=1, gray=0, busy=0){
  ctx.save();
  if (busy > 0){ ctx.shadowColor = C.orange; ctx.shadowBlur = 30*busy; }
  rr(x - w/2, y - h/2, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
  if (busy > 0){ ctx.fillStyle = `rgba(234,88,12,${0.10*busy})`; ctx.fill(); }
  if (gray > 0){ ctx.fillStyle = `rgba(209,213,219,${0.75*gray})`; ctx.fill(); }
  ctx.lineWidth = 3.5; ctx.strokeStyle = gray > 0.5 ? C.dim : busy > 0.5 ? C.orange : C.pnu; ctx.stroke();
  ctx.restore();
  pieceGlyph(k, x, y - 16, 0.95, gray > 0.5 ? C.dim : C.pnu);
  text(PNAME[k], x, y + 42, 26, gray > 0.5 ? C.dim : C.sub, 'center', labA);
  if (gray > 0) withAlpha(gray, () => {   // 멈춤 표시
    ctx.beginPath(); ctx.arc(x + w/2 - 30, y - h/2 + 30, 20, 0, Math.PI*2); ctx.fillStyle = C.sub; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(x + w/2 - 37, y - h/2 + 21, 5, 18); ctx.fillRect(x + w/2 - 28, y - h/2 + 21, 5, 18);
  });
}
// 조각 도식이 왼쪽으로 작아지는 변환 (33.4~34.6). 이후 공장 비유 동안 왼쪽에 남는다.
const LEFT = { fx: 960, fy: 585, z: 0.4, sx: 340, sy: 470 };
function partBCam(t){
  const k = eio(P(t, 39.287, 41.422)), z0 = lerp(1.25, 1.0, eio(P(t, 14.108, 15.178)));
  const out = eio(P(t, 48.717, 49.915));
  return { fx: 960, fy: lerp(520, LEFT.fy, k), z: lerp(z0, LEFT.z, k), dx: lerp(0, LEFT.sx - 960, k) - 260*out, dy: lerp(50, LEFT.sy - 470, k) };
}
function partBScreen(t, x, y){ const q = partBCam(t); return [960 + q.dx + (x - q.fx)*q.z, 470 + q.dy + (y - q.fy)*q.z]; }
const STOPJ = 1;   // 멈추는 게시글 복제본 (아래쪽)
function partB(t){
  const a = eo(P(t, 14.108, 14.692)) * (1 - eo(P(t, 48.717, 49.796))); if (a <= 0) return;
  const q = partBCam(t);
  withAlpha(a, () => withCam([q.fx, q.fy, q.z], q.dx, q.dy, () => {
    // 빌린 컴퓨터 판
    rr(230, 280, 1460, 615, 22); ctx.fillStyle = '#F3F8FD'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#C4D8EF'; ctx.stroke();
    cloudShape(292, 326, 70, '#D4E5F7', null);
    text('빌린 컴퓨터', 336, 322, 28, C.sub, 'left', 1, 700);
    const blk = eo(P(t, 14.789, 15.372)), u = eio(P(t, 17.636, 18.741));
    const lnk = eo(P(t, 18.741, 19.294));
    // 게시글 복제본 둘 (24.6~) — 비유로 넘어가기 전에 다시 하나로 접힌다 (35.8~36.5)
    const stop = win(t, 26.848, 27.324, 29.709, 30.488);
    const fold = 1 - eio(P(t, 37.572, 39.625));
    const cp = [1, 2].map(j => eio(P(t, 24.987 + 0.15*j, 25.767 + 0.15*j)) * fold);
    const cy = j => PY + 160*(j+1)*cp[j];
    // 조각 사이 연결 (서로 요청을 주고받으며 돈다). 멈춘 복제본으로 가는 선만 멈춘다
    if (lnk > 0){
      flowLine(PX[0]+PW/2, PY, PX[1]-PW/2, PY, t, C.green, lnk);
      flowLine(PX[1]+PW/2, PY, PX[2]-PW/2, PY, t, C.green, lnk);
      flowLine(PX[2]+PW/2, PY, PX[3]-PW/2, PY, t, C.green, lnk);
      cp.forEach((v, j) => { if (v > 0.6){ const dead = j === STOPJ && stop > 0.5, al = lnk*P(v, 0.6, 1);
        flowLine(PX[1]+PW/2, PY, PX[2]-PW/2, cy(j), dead ? 0 : t, dead ? C.dim : C.green, al);
        flowLine(PX[2]+PW/2, cy(j), PX[3]-PW/2, PY, dead ? 0 : t, dead ? C.dim : C.green, al); } });
    }
    // 로그인 → 게시글 조각들로 가는 요청서. 멈춘 복제본으로 가던 것은 살아 있는 조각으로 옮겨 간다
    for (let k = 0; k < 9; k++){
      const t0 = 26.059 + k*0.42, d = 0.95; if (t < t0 || t > t0 + d) continue;
      let tgt = k % 3, alt = null;
      if (tgt === STOPJ + 1 && t0 + d > 26.967 && t0 < 30.292) alt = k % 2 ? 0 : 1;   // 원본 또는 위 복제본으로
      const yT = n => n === 0 ? PY : cy(n - 1);
      const sw = alt === null ? 0 : eio(P(t, Math.max(t0, 26.967), Math.max(t0, 26.967) + 0.45));
      const ex = PX[2] - PW/2 - 14, ey = lerp(yT(tgt), alt === null ? yT(tgt) : yT(alt), sw);
      const v = eio(P(t, t0, t0 + d)), x = lerp(PX[1] + PW/2 + 12, ex, v), y = lerp(PY, ey, v);
      docSheet(x, y, 0.42, lnk * P(t, t0, t0 + 0.12) * (1 - P(t, t0 + d - 0.12, t0 + d)), C.pnu);
    }
    // 복제본 (바쁜 게시글 조각만)
    cp.forEach((v, j) => { if (v > 0) withAlpha(Math.min(1, v*3), () => pieceBox(2, PX[2], cy(j), PW, PH, t, 1, j === STOPJ ? stop : 0, 0)); });
    // 원래 프로그램 한 덩어리 → 네 조각
    if (blk > 0){
      const by = lerp(330, PY, eo(P(t, 14.789, 15.469)));
      withAlpha(blk, () => {
        text('게시판 프로그램', 960, by - 112, 40, C.text, 'center', 1 - P(t, 18.078, 18.631));
        if (u <= 0.001){
          rr(370, by - 75, 1180, 150, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = C.pnu; ctx.stroke();
          for (let i = 0; i < 4; i++) pieceGlyph(i, PX[i], by - 16, 0.95, C.pnu);
          const cr = win(t, 17.525, 17.801, 18.023, 18.189);
          if (cr > 0) withAlpha(cr, () => { ctx.strokeStyle = C.pnu; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
            for (const cx of [640, 960, 1280]){ ctx.beginPath(); ctx.moveTo(cx, by - 75); ctx.lineTo(cx, by - 75 + 150*eo(P(t, 17.525, 17.967))); ctx.stroke(); } ctx.setLineDash([]); });
        } else {
          const bounds = [370, 640, 960, 1280, 1550];
          for (let i = 0; i < 4; i++){
            const x0 = (bounds[i] + bounds[i+1])/2, w0 = bounds[i+1] - bounds[i];
            const busy = i === 2 ? win(t, 24.11, 24.597, 25.474, 26.254) : 0;
            const hl = pairHL(i, t);   // 공정과 이어질 때 강조
            pieceBox(i, lerp(x0, PX[i], u), by, lerp(w0, PW, u), lerp(150, PH, u), t, P(u, 0.5, 1), 0, busy);
            glowStroke(PX[i] - PW/2, by - PH/2, PW, PH, 16, C.pnu, hl, 6);
          }
        }
      });
    }
    // 바쁨: 요청서가 쌓이고 게이지가 찬다 → 복제본으로 나눠진다
    for (let j = 0; j < 6; j++){
      const t0 = 24.11 + j*0.18, dj = j % 3;
      const fall = eo(P(t, t0, t0 + 0.35)), go = eio(P(t, 25.377, 26.157));
      const sx = PX[2] - 62 + j*25, sy = PY - PH/2 - 26 - (j%2)*10;
      const tx = PX[2] - 40 + (j%2)*80, ty = PY + 160*dj - 20;
      const x = lerp(sx, tx, go), y = lerp(lerp(sy - 120, sy, fall), ty, go);
      const al = fall * (1 - eo(P(t, 26.254, 26.644)));
      if (al > 0) docSheet(x, y, 0.5, al, C.orange);
    }
    const gA = win(t, 24.008, 24.305, 29.709, 30.292);
    if (gA > 0){
      const load = lerp(lerp(0.3, 0.95, eio(P(t, 24.11, 25.377))), 0.34, eio(P(t, 25.767, 26.449)));
      const ys = [[PY, 1]].concat(cp.map((v, j) => v > 0.95 ? [cy(j), j === STOPJ ? 1 - stop : 1] : null)).filter(v => v !== null);
      ys.forEach(([yy, ga]) => withAlpha(gA*ga, () => {
        const gx = PX[2] + PW/2 + 18, gh = PH - 20, gy = yy - gh/2;
        rr(gx, gy, 16, gh, 8); ctx.fillStyle = '#E5E7EB'; ctx.fill();
        rr(gx, gy + gh*(1 - load), 16, gh*load, 8); ctx.fillStyle = load > 0.75 ? C.red : C.green; ctx.fill();
      }));
    }
    // 게시글 하나가 멈춰도 나머지는 정상 (오른쪽 위 체크)
    const ok = [[PX[0], PY], [PX[1], PY], [PX[2], PY], [PX[3], PY], [PX[2], PY + 160*(2 - STOPJ)]];
    ok.forEach(([x, y], i) => verdictMark('forward', x + PW/2 - 6, y - PH/2 + 6, 0.5, win(t, 27.5 + i*0.1, 27.75 + i*0.1, 28.9, 29.4)));
  }));
  // 핵심 단어
  const ma = win(t, 20.511, 20.72, 23.083, 23.494);
  if (ma > 0){
    ctx.font = '900 84px KRH'; const m = ctx.measureText('마이크로서비스 구조').width;
    const tot = m + 36 + 150, x0 = 960 - tot/2;
    punch('마이크로서비스 구조', x0 + m/2, 150, 84, C.pnu, ma, t - 20.566);
    pill('MSA', x0 + m + 36 + 75, 152, 50, C.pnu, ma * eo(P(t, 22.158, 22.467)), eo(P(t, 22.158, 22.467)));
  }
  punch('클라우드 네이티브', 960, 150, 92, C.pnuGreen, win(t, 36.863, 37.185, 39.287, 40.487), t - 36.863);
}

// ─────────────── D~J. 자동차 공장 (배치는 하나, 카메라로 보여준다) ───────────────
const CX = [370, 750, 1130, 1510], ZW = 300, ZH = 200, ROWY = [420, 700];
const SV = ['frontend', 'auth', 'post', 'comment'], PROC = ['출고 담당', '승인 담당', '차체 공정', '도장 공정'];
const NAME_T = [54.97, 57.846, 60.727, 64.034], PROC_T = [56.136, 58.533, 61.581, 64.783];
const CTRL = { x: 760, y: 150, w: 400, h: 150 }, BLD = { x: 140, y: 70, w: 1640, h: 910 };
const REP_T = i => 100.15 + i*0.15;              // 레플리카 구역이 내려오는 시점
const INS_T = (i, r) => 107.872 + (r*4 + i)*0.2;  // 검사원 등장
const INS = (i, r) => [CX[i] + (r === 0 ? 50 : 100), r === 0 ? 588 : 748];
const STOP = [102.687, 106.356];                      // comment 첫 구역 정지

const FCAM = [
  [39.625, 310, 525, 0.54], [41.021, 310, 525, 0.6], [48.717, 310, 525, 0.6], [49.678, 960, 395, 1.12], [53.101, 960, 395, 1.12],
  [53.691, 370, 500, 1.5], [56.427, 370, 500, 1.52], [57.156, 750, 500, 1.5], [58.945, 750, 500, 1.52], [60.157, 1130, 500, 1.5],
  [62.341, 1130, 500, 1.52], [63.435, 1510, 500, 1.5], [66.132, 1510, 500, 1.52], [67.724, 1090, 410, 0.98], [70.818, 1070, 410, 0.99], [71.486, 960, 410, 1.1], [72.5, 960, 420, 1.1],
  [73.965, 940, 540, 1.35], [78.44, 940, 540, 1.38], [79.271, 960, 430, 1.08], [83.168, 960, 440, 1.04], [84.859, 1180, 525, 0.78],
  [106.616, 1180, 525, 0.78], [107.513, 960, 525, 0.93], [110.866, 960, 525, 0.93], [111.791, 1130, 560, 1.7], [118.972, 1150, 560, 1.75],
  [119.795, 960, 430, 0.76], [131.447, 960, 430, 0.79],
];

function carPath(){
  ctx.beginPath(); ctx.moveTo(-50,14); ctx.lineTo(-50,-4); ctx.quadraticCurveTo(-48,-10,-38,-10); ctx.lineTo(-24,-10); ctx.lineTo(-12,-26);
  ctx.lineTo(16,-26); ctx.lineTo(30,-10); ctx.lineTo(44,-8); ctx.quadraticCurveTo(50,-6,50,2); ctx.lineTo(50,14); ctx.closePath();
}
function wheels(col){ for (const wx of [-28, 28]){ ctx.beginPath(); ctx.arc(wx,14,10,0,Math.PI*2); ctx.fillStyle = col; ctx.fill(); ctx.beginPath(); ctx.arc(wx,14,4,0,Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); } }
function procGlyph(i, x, y, s, t, a, hard=0){
  withAlpha(a, () => {
    ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (i === 0){          // 출고: 완성차가 나간다
      const dx = 5*Math.sin(t*2.2);
      ctx.save(); ctx.translate(dx, 0); carPath(); ctx.fillStyle = C.green; ctx.fill(); wheels(C.navy); ctx.restore();
      ctx.strokeStyle = C.green; ctx.lineWidth = 4; for (let j = 0; j < 3; j++){ ctx.beginPath(); ctx.moveTo(-80+dx, -12+j*11); ctx.lineTo(-62+dx, -12+j*11); ctx.stroke(); }
    } else if (i === 1){   // 승인: 도장 찍기
      const st = Math.abs(Math.sin(t*(2.6 + 5*hard)));
      rr(-44, 14, 88, 20, 3); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.edge; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 24, 7, 0, Math.PI*2); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(220,38,38,${0.9*(1-st)})`; ctx.stroke();
      ctx.save(); ctx.translate(0, -st*20);
      ctx.beginPath(); ctx.arc(0,-34,10,0,Math.PI*2); ctx.fillStyle = '#7F1D1D'; ctx.fill();
      ctx.fillRect(-5,-26,10,18); rr(-22,-10,44,18,4); ctx.fillStyle = C.red; ctx.fill();
      ctx.restore();
    } else if (i === 2){   // 차체: 뼈대 용접
      carPath(); ctx.strokeStyle = C.sub; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]); wheels(C.dim);
      const f = 0.6 + 0.4*Math.sin(t*17);
      ctx.save(); ctx.translate(36, -22); ctx.fillStyle = C.amber; ctx.globalAlpha *= f; ctx.beginPath();
      for (let k = 0; k < 8; k++){ const r = k % 2 ? 4 : 11, an = k*Math.PI/4; k ? ctx.lineTo(r*Math.cos(an), r*Math.sin(an)) : ctx.moveTo(r, 0); }
      ctx.closePath(); ctx.fill(); ctx.restore();
    } else {               // 도장: 색 입히기
      carPath(); ctx.fillStyle = C.pnu; ctx.fill(); wheels(C.navy);
      rr(-78,-50,16,28,3); ctx.fillStyle = C.sub; ctx.fill(); ctx.fillRect(-74,-58,8,8);
      for (let j = 0; j < 5; j++){ const ph = (t*1.4 + j*0.2) % 1; ctx.beginPath(); ctx.arc(-60 + ph*40, -52 + ph*22 + (j%2)*6, 3.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,91,170,${0.8*(1-ph)})`; ctx.fill(); }
    }
  });
}
// 작업자 머리 위 이름표: 처음엔 조각 아이콘만, 이름이 불리면 서비스 이름으로 펼쳐진다
function drawTag(i, x, y, t, a){
  if (a <= 0) return;
  const n = eio(P(t, NAME_T[i] - 0.1, NAME_T[i] + 0.35));
  const pop = t > NAME_T[i] ? 1 + 0.25*Math.exp(-(t - NAME_T[i])*9) : 1;
  withAlpha(a, () => {
    font(22); const m = ctx.measureText(SV[i]).width;
    const w = lerp(38, 38 + m + 18, n), h = 38;
    ctx.translate(x + (w - 38)/2, y); ctx.scale(pop, pop);
    rr(-w/2, -h/2, w, h, h/2); ctx.fillStyle = C.pnu; ctx.fill();
    pieceGlyph(i, -w/2 + 19, 0, 0.42, '#fff');
    if (n > 0.3){ ctx.globalAlpha *= P(n, 0.3, 1); font(22); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(SV[i], -w/2 + 38, 1); }
  });
}
function zoneA(i, t){ return eo(P(t, 38.6 + i*0.25, 39.0 + i*0.25)); }
function workerA(i, t){ return eo(P(t, 41.9 + i*0.2, 42.3 + i*0.2)); }
function tagA(i, t){ return P(t, 45.8 + i*0.1, 46.0 + i*0.1); }
function rowY(i, r, t){ return r === 0 ? ROWY[0] + 20*(1 - zoneA(i, t)) : lerp(ROWY[0], ROWY[1], eio(P(t, REP_T(i), REP_T(i) + 0.9))); }
function drawZone(i, r, t, a){
  const cx = CX[i], zy = rowY(i, r, t), x = cx - ZW/2;
  zone(x, zy, ZW, ZH, null, a);
  withAlpha(a, () => {   // 출입문 (row0 은 아래, row1 은 위 → 가운데 통로로 나간다)
    const dy = r === 0 ? zy + ZH : zy;
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(cx - 34, dy - 5, 68, 10);
    ctx.fillStyle = C.edge; ctx.fillRect(cx - 40, dy - 10, 7, 20); ctx.fillRect(cx + 33, dy - 10, 7, 20);
  });
  if (r === 0){
    const la = eo(P(t, PROC_T[i] - 0.15, PROC_T[i] + 0.25)), hot = win(t, PROC_T[i] - 0.15, PROC_T[i] + 0.2, PROC_T[i] + 1.6, PROC_T[i] + 2.2);
    text(PROC[i], cx, zy - 28, 30, hot > 0.5 ? C.pnu : C.text, 'center', a*la);
  }
  procGlyph(i, cx + 62, r === 0 ? zy + 78 : zy + 150, 0.9, t, a, i === 1 ? win(t, 75.655, 75.862, 77.821, 78.131) : 0);
  const wy = r === 0 ? zy + 110 : zy + 118, wa = a * workerA(i, t), bob = Math.sin(t*3.2 + i*1.7 + r*0.9)*2.5;
  person(cx - 70, wy + bob, 0.75, wa);
  drawTag(i, cx - 70, wy - 80, t, wa * tagA(i, t));
}

// 요청서(doc)·부품(part)이 구역 사이를 오간다
function itemPath(a, ra, b, rb){
  const ys = r => r === 0 ? 555 : 775, yd = r => r === 0 ? 620 : 700, lane = a < b ? 650 : 670;
  return [[CX[a], ys(ra)], [CX[a], yd(ra)], [CX[a], lane], [CX[b], lane], [CX[b], yd(rb)], [CX[b], ys(rb)]];
}
const doorFrac = pts => Math.hypot(pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]) / polyLen(pts);
const ROUTES = [[0,2,'doc',2.6,0.0],[0,3,'doc',2.9,0.9],[2,1,'doc',3.1,0.4],[3,2,'doc',3.7,1.7],[2,0,'part',3.3,1.9],[3,0,'part',3.5,0.3]];
const SPEED = 300;
function trafficA(t){ return win(t, 70.923, 71.373, 115.276, 115.752) * (1 - 0.65*win(t, 72.613, 73.063, 78.131, 78.749)) + win(t, 119.554, 120.398, 200.987, 201.987); }
function scanFx(x, y, k, t){
  if (k <= 0) return;
  withAlpha(k, () => {
    rr(x - 34, y - 40, 68, 80, 8); ctx.fillStyle = 'rgba(0,166,81,0.16)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = C.pnuGreen; ctx.stroke();
    const ly = y - 36 + 72*((t*2.4) % 1);
    ctx.shadowColor = C.pnuGreen; ctx.shadowBlur = 14; ctx.fillStyle = C.pnuGreen; ctx.fillRect(x - 32, ly - 2, 64, 4);
  });
}
function drawItem(kind, x, y, s, a, col){ if (kind === 'doc') docSheet(x, y, s, a, col); else partBox(x, y, s, a, col); }
function traffic(t){
  const ta = trafficA(t); if (ta <= 0) return;
  for (const [a, b, kind, per, ph] of ROUTES){
    for (let k = 0; ; k++){
      const t0 = 70.923 + ph + k*per; if (t0 > t) break;
      if (!((t0 >= 70.923 && t0 <= 115.276) || t0 >= 119.554)) continue;
      let ra = t0 > REP_T(3) + 1 ? k % 2 : 0, rb = ra;
      if (t0 > STOP[0] - 1.6 && t0 < STOP[1]){ if (b === 3) rb = 1; if (a === 3) ra = 1; }
      const pts = itemPath(a, ra, b, rb), L = polyLen(pts), dur = L/SPEED;
      if (t > t0 + dur) continue;
      const u = (t - t0)/dur, [x, y] = polyAt(pts, u);
      const passT = t0 + doorFrac(pts)*dur, insOn = passT > INS_T(a, ra) + 0.3;
      const al = ta * P(t, t0, t0 + 0.2) * (1 - P(t, t0 + dur - 0.25, t0 + dur));
      if (insOn) scanFx(x, y, al * (1 - clamp(Math.abs(t - passT)/0.35)), t);
      drawItem(kind, x, y, 0.55, al, insOn && t > passT ? C.green : kind === 'doc' ? C.pnu : C.amber);
    }
  }
}
// 특정 장면용 요청서 (keys: [[t,u],...])
function featured(kind, pts, t, keys, s, a, col){
  const u = keyU(t, keys), [x, y] = polyAt(pts, u);
  drawItem(kind, x, y, s, a, col); return [x, y];
}

// 쿠버네티스 용어 대응 (오른쪽 범례에 하나씩 붙는다)
const TERMS = [
  [89.745, '공장 전체', '클러스터', 'k8s', [1780, 200]],
  [93.475, '생산관리실', '마스터 노드', 'cp', [1160, 225]],
  [95.571, '공정 구역 하나', 'Pod', 'pod', [1660, 470]],
  [99.263, '작업자', '컨테이너', 'ctr', [1440, 520]],
  [105.183, '같은 구역 두 개', '레플리카', 'rs', [1660, 800]],
];
const SLOT_Y = [205, 340, 475, 610, 745], LEG_X = 1670, LEG_W = 400;
function kubeTitle(x, y, s, a, pop=1){
  withAlpha(a, () => {
    ctx.translate(x, y); ctx.scale(s*pop, s*pop);
    const im = IMG.k8s; if (im){ const h = 120*im.height/im.width; ctx.drawImage(im, -250, -h/2, 120, h); }
    ctx.font = '900 84px KRH'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.lineWidth = 8; ctx.strokeStyle = '#fff'; ctx.strokeText('쿠버네티스', -110, 4); ctx.fillStyle = '#326CE5'; ctx.fillText('쿠버네티스', -110, 4);
  });
}
function legend(t, c){
  const la = 1 - eo(P(t, 106.616, 107.632)); if (la <= 0) return;
  // 쿠버네티스 → 범례 머리
  const ka = eo(P(t, 85.544, 86.001)); if (ka > 0){
    const u = eio(P(t, 87.249, 87.882));
    kubeTitle(lerp(820, 1668, u), lerp(700, 105, u), lerp(1, 0.42, u), ka*la, 1 + 0.25*Math.exp(-Math.max(0, t - 85.658)*10));
  }
  TERMS.forEach(([t0, from, to, icon, anchor], j) => {
    const a = eo(P(t, t0 - 0.15, t0 + 0.3)) * la; if (a <= 0) return;
    const y = SLOT_Y[j], dx = 70*(1 - eo(P(t, t0 - 0.15, t0 + 0.4)));
    // 연결선: 카드 → 공장 안의 해당 요소
    const lw = win(t, t0, t0 + 0.4, t0 + 2.2, t0 + 2.8) * la;
    if (lw > 0){ const [ax, ay] = w2s(c, anchor[0], anchor[1]);
      withAlpha(lw, () => { ctx.strokeStyle = C.pnu; ctx.lineWidth = 3; ctx.setLineDash([8, 7]); ctx.lineDashOffset = -t*30;
        const u = eo(P(t, t0, t0 + 0.4)); ctx.beginPath(); ctx.moveTo(LEG_X - LEG_W/2 + dx, y); ctx.lineTo(lerp(LEG_X - LEG_W/2, ax, u), lerp(y, ay, u)); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(ax, ay, 8*u, 0, Math.PI*2); ctx.fillStyle = C.pnu; ctx.fill(); }); }
    const fresh = win(t, t0 - 0.1, t0 + 0.2, t0 + 1.8, t0 + 2.6);
    if (fresh > 0) withAlpha(fresh*a, () => { ctx.shadowColor = C.pnu; ctx.shadowBlur = 30; rr(LEG_X - LEG_W/2 + dx, y - 60, LEG_W, 120, 16); ctx.lineWidth = 4; ctx.strokeStyle = C.pnu; ctx.stroke(); });
    termCard(from, to, LEG_X + dx, y, a, icon, LEG_W);
  });
}

// 사이드카 프록시 용어 카드 (크게)
function bigTerm(from, to, x, y, a, age){
  withAlpha(a, () => {
    const pop = 1 + 0.2*Math.exp(-Math.max(0, age)*10); ctx.translate(x, y); ctx.scale(pop, pop);
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.16)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 8;
    rr(-270, -86, 540, 172, 20); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 4; ctx.strokeStyle = C.pnuGreen; ctx.stroke();
    text(from, 0, -40, 30, C.sub, 'center', 1, 400);
    ctx.font = '900 64px KRH'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.pnuGreen; ctx.fillText(to, 0, 28);
  });
}

function factory(t){
  const fa = eo(P(t, 39.625, 40.888)); if (fa <= 0) return;
  const c = camAt(t, FCAM);
  withAlpha(fa, () => withCam(c, 0, 0, () => {
    // 공장 건물
    rr(BLD.x, BLD.y, BLD.w, BLD.h, 26); ctx.fillStyle = '#FBFCFE'; ctx.fill();
    const cl = win(t, 89.326, 89.577, 90.582, 91.138);
    ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    glowStroke(BLD.x, BLD.y, BLD.w, BLD.h, 26, C.pnu, cl, 8);
    withAlpha(1, () => {   // 톱니 지붕 + 이름
      ctx.fillStyle = C.sub; ctx.beginPath(); ctx.moveTo(BLD.x + 30, BLD.y + 62);
      for (let k = 0; k < 3; k++){ ctx.lineTo(BLD.x + 30 + k*22, BLD.y + 38); ctx.lineTo(BLD.x + 52 + k*22, BLD.y + 50); }
      ctx.lineTo(BLD.x + 96, BLD.y + 62); ctx.closePath(); ctx.fill();
    });
    text('자동차 공장', BLD.x + 110, BLD.y + 50, 32, C.sub, 'left');
    // 통로
    const ca = eo(P(t, 43.428, 44.019));
    withAlpha(ca, () => { ctx.fillStyle = '#EEF2F7'; ctx.fillRect(BLD.x + 40, 638, BLD.w - 80, 44);
      ctx.strokeStyle = '#D5DEEA'; ctx.lineWidth = 2; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.moveTo(BLD.x + 50, 660); ctx.lineTo(BLD.x + BLD.w - 50, 660); ctx.stroke(); ctx.setLineDash([]); });
    // 오가는 요청서와 부품 = 네트워크 트래픽 (통로가 흐른다)
    const cf = win(t, 79.164, 79.591, 82.866, 83.32);
    if (cf > 0){
      flowLine(BLD.x + 60, 650, BLD.x + BLD.w - 60, 650, t, C.green, cf, 4);
      flowLine(BLD.x + BLD.w - 60, 670, BLD.x + 60, 670, t, C.green, cf, 4);
      for (let i = 0; i < 4; i++){ flowLine(CX[i], 560, CX[i], 648, t, C.green, cf, 3); }
    }
    // 생산관리실
    controlRoom(CTRL.x, CTRL.y, CTRL.w, CTRL.h, eo(P(t, 40.888, 41.69)));
    glowStroke(CTRL.x, CTRL.y, CTRL.w, CTRL.h, 18, C.pnu, win(t, 92.865, 93.17, 94.186, 94.698) + win(t, 121.455, 121.767, 123.016, 123.485) + 0.7*win(t, 128.333, 128.548, 130.842, 131.308));
    // 어느 구역에 무엇을 배치할지 (지시선)
    const as = win(t, 90.833, 91.239, 92.56, 93.068);
    if (as > 0) for (let i = 0; i < 4; i++){
      const x1 = CTRL.x + 70 + i*87, y1 = CTRL.y + CTRL.h, x2 = CX[i], y2 = ROWY[0] - 4, u = eio(P(t, 82.3 + i*0.1, 82.9 + i*0.1));
      withAlpha(as, () => { ctx.strokeStyle = C.pnu; ctx.lineWidth = 3; ctx.setLineDash([8, 7]); ctx.lineDashOffset = -t*40;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, u), lerp(y1, y2, u)); ctx.stroke(); ctx.setLineDash([]); });
    }
    // 공정 구역 (레플리카 줄 먼저 → 윗줄 뒤에서 내려온다)
    for (let i = 0; i < 4; i++){ const ra = eo(P(t, REP_T(i), REP_T(i) + 0.3)); if (ra > 0) drawZone(i, 1, t, ra); }
    for (let i = 0; i < 4; i++){ const za = zoneA(i, t); if (za > 0) drawZone(i, 0, t, za); }
    // 비유 대응: 조각과 이어질 때 구역 강조
    for (let i = 0; i < 4; i++) glowStroke(CX[i] - ZW/2, ROWY[0], ZW, ZH, 18, C.pnu, pairHL(i, t), 6);
    // 이름 불릴 때 구역 강조
    for (let i = 0; i < 4; i++) glowStroke(CX[i] - ZW/2, ROWY[0], ZW, ZH, 18, C.pnu, win(t, NAME_T[i] - 0.9, NAME_T[i] - 0.5, PROC_T[i] + 1.4, PROC_T[i] + 2.0));
    glowStroke(CX[2] - ZW/2, ROWY[0], ZW, ZH, 18, C.pnu, win(t, 72.613, 73.063, 77.821, 78.44));
    glowStroke(CX[1] - ZW/2, ROWY[0], ZW, ZH, 18, C.pnu, win(t, 72.613, 73.063, 77.821, 78.44));
    // 용어 대응 강조: Pod(구역) · 컨테이너(작업자) · 레플리카(두 구역)
    glowStroke(CX[3] - ZW/2, ROWY[0], ZW, ZH, 18, C.pnu, win(t, 94.592, 94.917, 96.117, 96.748));
    const cw = win(t, 98.559, 98.861, 100.227, 100.612);
    if (cw > 0) withAlpha(cw, () => { ctx.shadowColor = C.pnu; ctx.shadowBlur = 20; ctx.strokeStyle = C.pnu; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(CX[3] - 70, 522, 52, 70, 0, 0, Math.PI*2); ctx.stroke(); });
    const rp = win(t, 104.792, 105.183, 106.616, 107.393);
    glowStroke(CX[3] - ZW/2, ROWY[0], ZW, ZH, 18, C.pnu, rp); glowStroke(CX[3] - ZW/2, ROWY[1], ZW, ZH, 18, C.pnu, rp);
    // 한 곳이 멈춰도 (comment 윗 구역 정지 → 아래 구역이 이어받음)
    const st = win(t, STOP[0], STOP[0] + 0.4, STOP[1] - 0.4, STOP[1]);
    if (st > 0){
      withAlpha(st, () => { rr(CX[3] - ZW/2, ROWY[0], ZW, ZH, 18); ctx.fillStyle = 'rgba(156,163,175,0.55)'; ctx.fill();
        ctx.beginPath(); ctx.arc(CX[3], ROWY[0] + ZH/2, 44, 0, Math.PI*2); ctx.fillStyle = C.sub; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillRect(CX[3] - 16, ROWY[0] + ZH/2 - 20, 11, 40); ctx.fillRect(CX[3] + 5, ROWY[0] + ZH/2 - 20, 11, 40); });
      glowStroke(CX[3] - ZW/2, ROWY[1], ZW, ZH, 18, C.green, st);
      verdictMark('forward', CX[3] + ZW/2 - 36, ROWY[1] + 36, 0.7, win(t, 95.3, 95.6, STOP[1] - 0.4, STOP[1]));
    }
    // 네 조각이 공장으로 들어온다 (이름표 자리로)
    for (let i = 0; i < 4; i++){
      const u = eio(P(t, 44.6 + i*0.12, 45.6 + i*0.12)), fa2 = win(t, 44.6 + i*0.12, 44.8 + i*0.12, 45.7 + i*0.1, 45.9 + i*0.1);
      if (fa2 > 0) withAlpha(fa2, () => { const x = lerp(CX[i], CX[i] - 70, u), y = lerp(-120, 450, u);
        ctx.beginPath(); ctx.arc(x, y, 19 + 12*(1 - u), 0, Math.PI*2); ctx.fillStyle = C.pnu; ctx.fill(); pieceGlyph(i, x, y, 0.42 + 0.3*(1 - u), '#fff'); });
    }
    // 검사원 → 생산관리실 그물 (서비스메시)
    const meshA = eo(P(t, 121.455, 121.767));
    if (meshA > 0){
      let idx = 0;
      for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++, idx++){
        const [ix, iy] = INS(i, r), x1 = CTRL.x + 60 + i*93, y1 = CTRL.y + CTRL.h, u = eio(P(t, 112.0 + idx*0.12, 112.6 + idx*0.12));
        if (u <= 0) continue;
        const pulse = 0.75 + 0.25*win(t, 128.333, 128.548, 130.842, 131.308);
        withAlpha(meshA*pulse, () => { ctx.strokeStyle = C.pnuGreen; ctx.lineWidth = 3.5; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t*40;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, ix, u), lerp(y1, iy - 30, u)); ctx.stroke(); ctx.setLineDash([]); });
      }
    }
    // 오가는 요청서·부품
    traffic(t);
    // G. 차체 → 승인: "이 지시서 승인된 거 맞아요?"
    const g1 = win(t, 73.063, 73.401, 77.409, 77.821);
    if (g1 > 0){
      const [x, y] = featured('doc', itemPath(2, 0, 1, 0), t, [[73.176, 0], [77.203, 1]], 0.95, g1, C.pnu);
      withAlpha(g1 * eo(P(t, 73.627, 73.965)), () => { ctx.beginPath(); ctx.arc(x + 34, y - 42, 20, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = C.amber; ctx.stroke(); ctx.font = '900 28px KRH'; ctx.fillStyle = C.amber; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', x + 34, y - 41); });
    }
    const g2 = win(t, 77.924, 78.234, 79.377, 79.804);
    if (g2 > 0){
      const [x, y] = featured('doc', itemPath(1, 0, 2, 0), t, [[78.028, 0], [79.271, 1]], 0.95, g2, C.green);
      verdictMark('forward', x + 30, y - 34, 0.5, g2);
    }
    // I. 출구 검사: 들어오는 건 통과, 나가는 것만 검사
    const i1 = win(t, 111.341, 111.566, 112.542, 112.767);
    if (i1 > 0){ featured('doc', itemPath(1, 0, 2, 0), t, [[111.341, 0.5], [112.617, 1]], 0.7, i1, C.pnu);
      pill('통과', CX[2] + 88, 662, 22, C.sub, win(t, 111.941, 112.091, 112.617, 112.917)); }
    const o1p = itemPath(2, 0, 1, 0), d1 = doorFrac(o1p);
    const o1 = win(t, 112.992, 113.276, 115.371, 115.657);
    if (o1 > 0){
      const green = t > 114.038;
      const [x, y] = featured('doc', o1p, t, [[113.086, 0], [113.562, d1], [114.229, d1], [115.467, 0.55]], 0.7, o1, green ? C.green : C.pnu);
      scanFx(x, y, win(t, 113.562, 113.657, 114.133, 114.324), t);
      verdictMark('forward', x + 32, y - 36, 0.45, win(t, 114.038, 114.181, 115.181, 115.562));
    }
    const o2p = itemPath(2, 0, 0, 0), d2 = doorFrac(o2p);
    const o2 = win(t, 114.038, 114.229, 115.562, 115.858);
    if (o2 > 0){
      const green = t > 115.086;
      const [x, y] = featured('part', o2p, t, [[114.133, 0], [114.657, d2], [115.181, d2], [115.752, 0.45]], 0.7, o2, green ? C.green : C.amber);
      scanFx(x, y, win(t, 114.61, 114.705, 115.133, 115.324), t);
      verdictMark('forward', x + 32, y - 34, 0.45, win(t, 115.086, 115.229, 115.657, 115.973));
    }
    // 검사원
    for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){
      const t0 = INS_T(i, r), a = eo(P(t, t0, t0 + 0.3)); if (a <= 0) continue;
      const [x, y] = INS(i, r), pop = 1 + 0.35*Math.exp(-Math.max(0, t - t0)*9);
      const ring = win(t, 110.3 + (r*4+i)*0.08, 110.6 + (r*4+i)*0.08, 111.5, 112.0);
      if (ring > 0) withAlpha(ring, () => { ctx.beginPath(); ctx.arc(x, y - 6, 58, 0, Math.PI*2); ctx.fillStyle = 'rgba(0,166,81,0.14)'; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = C.pnuGreen; ctx.stroke(); });
      inspector(x, y, 0.6*pop, a);
    }
    // 작업자는 그대로 (파란 테)
    const wk = win(t, 123.64, 123.858, 124.584, 124.949);
    if (wk > 0) for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) withAlpha(wk, () => {
      ctx.strokeStyle = C.pnu; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(CX[i] - 70, (r === 0 ? 530 : 818) - 8, 48, 66, 0, 0, Math.PI*2); ctx.stroke(); });
    // 질문: 공정끼리는?
    const qm = win(t, 67.724, 68.033, 69.786, 70.302);
    if (qm > 0) for (let i = 0; i < 3; i++) punch('?', (CX[i] + CX[i+1])/2, 520 + Math.sin(t*3 + i)*6, 64, C.amber, qm*eo(P(t, 59.0 + i*0.15, 59.3 + i*0.15)), t - 67.724 - i*0.15);
  }));
  // ── 화면 고정 요소 ──
  // 네트워크 트래픽
  punch('네트워크 트래픽', 960, 800, 88, C.pnu, win(t, 81.732, 81.883, 83.017, 83.49), t - 81.883);
  legend(t, c);
  // 사이드카 프록시 (+ 오늘의 주인공 스포트라이트)
  const sp = win(t, 117.588, 118.049, 118.741, 119.433);
  if (sp > 0){
    const [sx, sy] = w2s(c, INS(2, 0)[0], INS(2, 0)[1] - 5);
    const g = ctx.createRadialGradient(sx, sy, 90, sx, sy, 380);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(255,255,255,${0.72*sp})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let k = 0; k < 5; k++){ const an = k*1.26 + t*0.8, r = 125 + 10*Math.sin(t*4 + k);
      sparkle(sx + r*Math.cos(an), sy + r*Math.sin(an)*0.8, 11 + 4*Math.sin(t*6 + k), C.gold, sp*eo(P(t, 108.7 + k*0.08, 109.0 + k*0.08))); }
  }
  bigTerm('출구 검사원', '사이드카 프록시', 1490, 300, win(t, 116.78, 117.069, 118.856, 119.554), t - 116.896);
  // 서비스메시
  punch('서비스메시', 960, 112, 96, C.pnuGreen, eo(P(t, 127.195, 127.314)), t - 127.243);
}

// 조각 i 와 공정 구역 i 를 차례로 짝지음 (39.2~43.7)
const PAIR_T = i => 43.428 + i*1.1;
const pairHL = (i, t) => win(t, PAIR_T(i), PAIR_T(i) + 0.3, PAIR_T(i) + 1.05, PAIR_T(i) + 1.4);
// 비유 연결: 왼쪽 조각 도식 → [비유] → 오른쪽 자동차 공장, 조각마다 대응 공정으로 점선
function bridge(t){
  const a = win(t, 40.62, 41.289, 48.717, 49.56); if (a <= 0) return;
  const c = camAt(t, FCAM);
  const [lx, ly] = partBScreen(t, 960, 280);
  text('웹 서비스 (게시판)', lx, ly - 36, 34, C.text, 'center', a);
  const [bx, by] = w2s(c, 960, BLD.y);
  text('자동차 공장', bx, by - 36, 34, C.text, 'center', a * eo(P(t, 41.289, 41.957)));
  // 화살표 + 비유 칩
  const ar = eio(P(t, 41.021, 41.823)), x0 = 668, x1 = 832, y = 470;
  if (ar > 0) withAlpha(a, () => {
    const xe = lerp(x0, x1, ar);
    ctx.strokeStyle = C.pnu; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe - 12, y); ctx.stroke();
    ctx.fillStyle = C.pnu; ctx.beginPath(); ctx.moveTo(xe + 6, y); ctx.lineTo(xe - 22, y - 20); ctx.lineTo(xe - 22, y + 20); ctx.closePath(); ctx.fill();
  });
  const ch = eo(P(t, 41.823, 42.224));
  if (ch > 0) withAlpha(a, () => { const pop = 1 + 0.3*Math.exp(-Math.max(0, t - 41.823)*9);
    ctx.translate(750, 410); ctx.scale(pop, pop); pill('비유', 0, 0, 34, C.pnu, ch, ch); });
  // 조각 → 공정 구역 점선
  for (let i = 0; i < 4; i++){
    const u = eio(P(t, PAIR_T(i), PAIR_T(i) + 0.6)); if (u <= 0) continue;
    const la = lerp(0.28, 1, pairHL(i, t));
    const [sx, sy] = partBScreen(t, PX[i], PY + PH/2 + 6), [ex, ey] = w2s(c, CX[i], ROWY[0] + ZH + 6);
    const d = 150 + (3 - i)*26, c1 = [sx, sy + d], c2 = [ex, ey + d - 40];
    withAlpha(a*la, () => {
      ctx.strokeStyle = C.pnu; ctx.lineWidth = 3.5; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t*40; ctx.beginPath(); ctx.moveTo(sx, sy);
      let hx = sx, hy = sy; const N = 40;
      for (let k = 1; k <= N*u; k++){ const v = k/N, m = 1 - v;
        hx = m*m*m*sx + 3*m*m*v*c1[0] + 3*m*v*v*c2[0] + v*v*v*ex; hy = m*m*m*sy + 3*m*m*v*c1[1] + 3*m*v*v*c2[1] + v*v*v*ey; ctx.lineTo(hx, hy); }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI*2); ctx.fillStyle = C.pnu; ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy, 7, 0, Math.PI*2); ctx.fill();
    });
  }
}

function draw(t){
  background();
  partA(t); partB(t); factory(t); bridge(t);
  asker(t, 7.412, 10.049);
  asker(t, 67.18, 70.096);
  guard(1);
  drawSubs(t, SUBS);
}
