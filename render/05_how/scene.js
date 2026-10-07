// ⑤ 작동 원리 — TTS_05 0.0~118.98s (unit duration 119.3)
// 문장·구 경계 (silencedetect -35dB d=0.2 기본, 쉼표 경계는 -30dB d=0.08 로 보정)
// 05-1  바로 이 빈틈을…지킵니다 0.25-2.88 | 이 검사원에게는…들어갑니다 3.16-5.97
//       첫 번째로 6.47-7.08 | 나가는 트래픽만 스캔합니다 7.29-8.87
//       구역이 내보낸 것 다섯 개를 한 줄씩 쌓아 9.41-11.74 | 흑백 이미지 한 장으로 만듭니다 11.98-13.58
//       이때 한 줄에는 요청 종류, 14.12-15.71 | 경로, 15.90-16.31 | 크기, 16.50-16.85 | 시간 간격 같은 스무 가지 특징이 담깁니다 17.11-19.45
// 05-2  (질문자) 그 이미지만 보고 이상한지 어떻게 알아요? 20.36-22.56
// 05-3a 정상품의 모습만 외워 두면 됩니다 23.58-25.35 | 여기에 쓰는 두 번째 기술이 26.05-27.57 | 딥러닝 이상탐지 모델입니다 27.82-29.42
//       외워 둔 정상과 다르게 생긴 것이 나오면 30.12-32.19 | 이상으로 판단합니다 32.43-33.43
//       공격은 불량품처럼 드물기 때문에 34.15-36.02 | 공격 데이터 없이 36.30-37.28 | 평소 나가던 정상 이미지만으로 학습시킵니다 37.49-39.63
//       이렇게 학습한 검사원은 / 사람 눈에…것도 / 미세한 차이를 잡아냅니다 40.36-45.01 (43.32~43.76 짧은 쉼, 앞부분은 음절 비례)
//       마지막으로 45.70-46.34 | 검사기를 가볍게 만듭니다 46.57-47.92
//       구역마다 검사원이 있으니 48.60-50.08 | 검사가 느리면 50.29-51.05 | 공장 전체가 느려집니다 51.26-52.49
//       그래서 크고 세밀한 선생님 검사기를 먼저 학습시킨 뒤 53.18-56.22
//       작은 학생 검사기가 56.59-57.80 | 그 판단을 보고 57.99-58.80 | 따라 배우게 합니다 58.94-59.74
//       이 방식을 60.43-61.07 | 지식증류라고 합니다 61.37-62.45
// 05-3b 그런데 의심만으로 막으면 63.22-64.71 | 정상 생산까지 멈출 수 있습니다 65.01-66.99 | 그래서 한 번 더 확인합니다 67.67-69.03
//       나가는 요청서가 의심스러우면 69.62-71.40 | 검사원이 생산관리실에 묻습니다 71.76-73.63
//       "옆 구역에서도 이런 요청서를 보낸 적 있나요?" 74.28-76.60 | 없다면 반려합니다 77.10-78.20 | 차단, 78.73-79.12 | 드롭입니다 79.42-80.01
//       나가는 부품이 의심스러우면 80.59-82.21 | 옆 구역에 똑같은 작업을 요청해 받은 부품과 비교합니다 82.58-85.51
//       둘이 다르면 의심받은 쪽 대신 86.16-~88.1 | 옆 구역 부품을 내보냅니다 ~88.1-89.35 | 교체, 89.96-90.38 | 릴레이입니다 90.61-91.31
//       괜히 의심했더라도 91.89-92.95 | 고객은 정상 부품을 받으니 93.24-94.70 | 생산은 멈추지 않습니다 94.85-96.17
//       문제가 없으면 96.75-97.53 | 그대로 통과, 97.78-98.48 | 포워드입니다 98.71-99.36
// 05-4  (질문자) 근데 왜 들어오는 요청서는 검사 안 해요? 100.27-102.65
// 05-5  모든 구역 출구에 검사원이 있기 때문입니다 103.88-106.79
//       들어오는 요청서는 보낸 구역의 출구에서 107.20-109.71 | 이미 검사를 거쳤습니다 110.02-111.34
//       그리고 매수된 작업자가 옆으로 번지려면 111.80-114.18 | 결국 뭔가를 밖으로 내보내야 합니다 114.48-116.37
//       그래서 나가는 것만 잘 지키면 됩니다 116.79-118.84
//
// 사실 기준 (manifests/REPORT_FACTS.md): 이미지 = 세로 특징 20 × 가로 패킷 5 (20×5), 마스킹 없음.
// 트래픽 이미지는 설명용으로 코드에서 만든다 (결정적 난수, seed 고정). 실제 포스터·보고서 이미지는 쓰지 않는다.
//   행 20 = 특징, 열 5 = 나간 것 5개. 요청 종류·경로 접두·인증 같은 행은 5개가 같고, 경로 깊이/길이·크기·시간 간격 행은 열마다 밝기가 다르다.
const ASSETS = [];
function rng(seed){ let r = seed; return () => (r = (r*9301 + 49297) % 233280) / 233280; }
// 설명용 정상 이미지 (스캔 결과로도 쓴다)
const NORM = [
  [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],      // 요청 종류 (5개 같음)
  [1,1,1,1,1],                                                         // 경로 접두 (같음)
  [.35,.85,.5,.15,.65], [.6,.2,.95,.45,.3], [0,1,0,1,1], [.75,.4,.1,.9,.5],  // 경로 깊이·길이·쿼리·숫자 비율 (열마다 다름)
  [0,0,0,0,0], [.2,.6,.3,.8,.45], [0,0,0,0,0], [1,1,1,1,1],             // 인증 (같음)
  [0,0,0,0,0], [0,0,0,0,0],
  [.45,.95,.2,.65,.3],                                                 // 크기
  [0,0,0,0,0],
  [.1,.7,.35,1,.55],                                                   // 시간 간격
  [.3,.42,.55,.7,.85],                                                 // 누적 크기
];
const VARY = [6, 7, 9, 11, 16, 18, 19];
// 정상 변형: 같은 모양, 변하는 행의 밝기만 조금씩 다르다
function normVariant(seed){ const r = rng(seed); return NORM.map((row, i) => VARY.includes(i) ? row.map(v => clamp(v + (r() - 0.5)*0.34)) : row.slice()); }
const NV = [normVariant(11), normVariant(23), normVariant(37), normVariant(41)];
// 미세한 이상: 정상과 3칸만 다르다
const SUBTLE_CELLS = [[3, 2], [14, 3], [17, 3]];
const SUBTLE = (() => { const m = NORM.map(r => r.slice()); m[3][2] = 1; m[14][3] = 0.8; m[17][3] = 0.9; return m; })();
// 뚜렷한 이상 (울타리 밖): 요청 종류·경로가 전혀 다른 모양
const OUTL = (() => { const r = rng(97); return NORM.map((row, i) => {
  if (i === 0 || i === 5 || i === 13) return [0,0,0,0,0];
  if (i === 2 || i === 10) return [1,1,1,1,1];
  if (i === 12 || i === 15) return [0,1,1,0,1].map((v, c) => i === 15 ? 1 - v : v);
  if (VARY.includes(i)) return row.map(() => r() < 0.5 ? 0.05 : 0.95);
  return row.slice(); }); })();

const SUBS = [
  [0.25, 2.88, '바로 이 빈틈을 구역 출구의 검사원이 지킵니다.', 'norm'],
  [3.16, 5.97, '이 검사원에게는 크게 세 가지 기술이 들어갑니다.', 'norm'],
  [6.47, 8.87, '첫 번째로, 나가는 트래픽만 스캔합니다.', 'norm'],
  [9.41, 11.74, '구역이 내보낸 것 다섯 개를 한 줄씩 쌓아', 'norm'],
  [11.98, 13.58, '흑백 이미지 한 장으로 만듭니다.', 'norm'],
  [14.12, 16.85, '이때 한 줄에는 요청 종류, 경로, 크기,', 'norm'],
  [17.11, 19.45, '시간 간격 같은 스무 가지 특징이 담깁니다.', 'norm'],
  [20.36, 22.56, '그 이미지만 보고 이상한지 어떻게 알아요?', 'norm'],
  [23.58, 25.35, '정상품의 모습만 외워 두면 됩니다.', 'norm'],
  [26.05, 27.57, '여기에 쓰는 두 번째 기술이', 'norm'],
  [27.82, 29.42, '딥러닝 이상탐지 모델입니다.', 'norm'],
  [30.12, 32.19, '외워 둔 정상과 다르게 생긴 것이 나오면', 'norm'],
  [32.43, 33.43, '이상으로 판단합니다.', 'norm'],
  [34.15, 36.02, '공격은 불량품처럼 드물기 때문에,', 'norm'],
  [36.30, 38.05, '공격 데이터 없이 평소 나가던', 'norm'],
  [38.05, 39.63, '정상 이미지만으로 학습시킵니다.', 'norm'],
  [40.36, 41.63, '이렇게 학습한 검사원은', 'norm'],
  [41.63, 43.50, '사람 눈에 거의 똑같아 보이는 것도', 'norm'],
  [43.50, 45.01, '미세한 차이를 잡아냅니다.', 'norm'],
  [45.70, 47.92, '마지막으로, 검사기를 가볍게 만듭니다.', 'norm'],
  [48.60, 50.08, '구역마다 검사원이 있으니,', 'norm'],
  [50.29, 52.49, '검사가 느리면 공장 전체가 느려집니다.', 'norm'],
  [53.18, 56.22, '그래서 크고 세밀한 선생님 검사기를 먼저 학습시킨 뒤,', 'norm'],
  [56.59, 59.74, '작은 학생 검사기가 그 판단을 보고 따라 배우게 합니다.', 'norm'],
  [60.43, 62.45, '이 방식을 지식증류라고 합니다.', 'norm'],
  [63.22, 64.71, '그런데 의심만으로 막으면', 'norm'],
  [65.01, 66.99, '정상 생산까지 멈출 수 있습니다.', 'norm'],
  [67.67, 69.03, '그래서 한 번 더 확인합니다.', 'norm'],
  [69.62, 71.40, '나가는 요청서가 의심스러우면,', 'norm'],
  [71.76, 73.63, '검사원이 생산관리실에 묻습니다.', 'norm'],
  [74.28, 76.60, '"옆 구역에서도 이런 요청서를 보낸 적 있나요?"', 'srt'],
  [77.10, 78.20, '없다면 반려합니다.', 'norm'],
  [78.73, 80.01, '차단, Drop입니다.', 'srt'],
  [80.59, 82.21, '나가는 부품이 의심스러우면,', 'norm'],
  [82.58, 85.51, '옆 구역에 똑같은 작업을 요청해 받은 부품과 비교합니다.', 'norm'],
  [86.16, 88.10, '둘이 다르면 의심받은 쪽 대신', 'norm'],
  [88.10, 89.35, '옆 구역 부품을 내보냅니다.', 'norm'],
  [89.96, 91.31, '교체, Relay입니다.', 'srt'],
  [91.89, 94.78, '괜히 의심했더라도 고객은 정상 부품을 받으니', 'norm'],
  [94.78, 96.17, '생산은 멈추지 않습니다.', 'norm'],
  [96.75, 99.36, '문제가 없으면 그대로 통과, Forward입니다.', 'norm'],
  [100.27, 102.65, '근데 왜 들어오는 요청서는 검사 안 해요?', 'norm'],
  [103.88, 106.79, '모든 구역 출구에 검사원이 있기 때문입니다.', 'norm'],
  [107.20, 109.71, '들어오는 요청서는 보낸 구역의 출구에서', 'norm'],
  [110.02, 111.34, '이미 검사를 거쳤습니다.', 'norm'],
  [111.80, 114.18, '그리고 매수된 작업자가 옆으로 번지려면', 'norm'],
  [114.48, 116.37, '결국 뭔가를 밖으로 내보내야 합니다.', 'norm'],
  [116.79, 118.84, '그래서 나가는 것만 잘 지키면 됩니다.', 'norm'],
];

// ─────────────── 공용 도구 (이 단위 전용) ───────────────
const pop = (t, t0) => 0.6 + 0.4*eo(P(t, t0, t0 + 0.35)) + 0.12*Math.sin(Math.PI*clamp((t - t0)/0.35));
// 구역 벽에 문(출입구)을 낸다
function door(x, y0, y1, a=1){
  withAlpha(a, () => {
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(x - 3, y0, 6, y1 - y0);
    ctx.fillStyle = C.sub; ctx.fillRect(x - 7, y0 - 4, 14, 8); ctx.fillRect(x - 7, y1 - 4, 14, 8);
  });
}
function polyAt(pts, u){
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++){ const d = Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); seg.push(d); L += d; }
  let s = clamp(u)*L;
  for (let i = 0; i < seg.length; i++){
    if (s <= seg[i] || i === seg.length - 1){ const k = seg[i] ? clamp(s/seg[i]) : 1; return [lerp(pts[i][0], pts[i+1][0], k), lerp(pts[i][1], pts[i+1][1], k)]; }
    s -= seg[i];
  }
}
// 번호 칩 (작은 1·2·3)
function chip(n, label, x, y, a, sz=30, col=C.pnu){
  withAlpha(a, () => {
    font(sz); const m = ctx.measureText(label).width, r = sz*0.72, w = 2*r + 30 + m + 22;
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.12)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
    rr(x, y - r - 8, w, 2*r + 16, r + 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 2.5; ctx.strokeStyle = col; ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 8 + r, y, r, 0, Math.PI*2); ctx.fillStyle = col; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), x + 8 + r, y + 1);
    ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.fillText(label, x + 8 + 2*r + 16, y + 1);
  });
}
// 20×5 격자. colProg[c] = 0~1 (위에서 아래로 채워짐), lines = 셀 경계선 진하기
function cellGrid(x, y, w, h, vals, colProg, a, lines=1){
  withAlpha(a, () => {
    const cw = w/5, ch = h/20;
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);
    for (let c = 0; c < 5; c++){
      const n = Math.ceil(clamp(colProg[c])*20);
      for (let r = 0; r < n; r++){ const g = Math.round(vals[r][c]*255); ctx.fillStyle = `rgb(${g},${g},${g})`; ctx.fillRect(x + c*cw, y + r*ch, cw + 0.6, ch + 0.6); }
    }
    if (lines > 0){
      ctx.strokeStyle = `rgba(130,140,155,${0.55*lines})`; ctx.lineWidth = 1;
      for (let c = 1; c < 5; c++){ ctx.beginPath(); ctx.moveTo(x + c*cw, y); ctx.lineTo(x + c*cw, y + h); ctx.stroke(); }
      for (let r = 1; r < 20; r++){ ctx.beginPath(); ctx.moveTo(x, y + r*ch); ctx.lineTo(x + w, y + r*ch); ctx.stroke(); }
    }
    ctx.strokeStyle = C.text; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  });
}
function strip(x, y, w, h, c, prog, a){
  withAlpha(a, () => {
    const ch = h/20, n = Math.ceil(clamp(prog)*20);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);
    for (let r = 0; r < n; r++){ const g = Math.round(NORM[r][c]*255); ctx.fillStyle = `rgb(${g},${g},${g})`; ctx.fillRect(x, y + r*ch, w, ch + 0.6); }
    ctx.strokeStyle = C.pnuGreen; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
  });
}
// 설명용 20×5 이미지 카드 (가로:세로 = 1.47)
function thumbG(vals, cx, cy, w, a, col=null, lw=5, lines=0.35){
  const h = w/1.47;
  withAlpha(a, () => {
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.18)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#fff'; ctx.fillRect(cx - w/2 - 7, cy - h/2 - 7, w + 14, h + 14); ctx.restore();
  });
  cellGrid(cx - w/2, cy - h/2, w, h, vals, [1,1,1,1,1], a, lines);
  withAlpha(a, () => { ctx.lineWidth = col ? lw : 1.5; ctx.strokeStyle = col || C.edge; ctx.strokeRect(cx - w/2 - 7, cy - h/2 - 7, w + 14, h + 14); });
}
// 말풍선: 꼬리 끝 (tx, ty)
function bubble(s, x, y, sz, a, tx, ty, col=C.pnu, sc=1){
  withAlpha(a, () => {
    font(sz); const m = ctx.measureText(s).width, w = m + sz*1.6, h = sz*2.2;
    ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y);
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.16)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    ctx.beginPath(); ctx.roundRect(x - w/2, y - h/2, w, h, h/2);
    const bx = clamp(tx, x - w/2 + h*0.6, x + w/2 - h*0.6), by = ty > y ? y + h/2 - 2 : y - h/2 + 2;
    ctx.moveTo(bx - 22, by); ctx.lineTo(tx, ty); ctx.lineTo(bx + 22, by);
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 3.5; ctx.strokeStyle = col; ctx.beginPath(); ctx.roundRect(x - w/2, y - h/2, w, h, h/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx - 22, by); ctx.lineTo(tx, ty); ctx.lineTo(bx + 22, by); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillRect(bx - 20, by - 5, 40, 8);
    ctx.fillStyle = C.text; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 2);
  });
}
// 질문자 컷: 사람 + 큰 말풍선
function qmark(x, y, a, col=C.amber, sz=54){ text('?', x, y, sz, col, 'center', a); }
// 신호등 (on = {drop, relay, forward} 0~1)
function tlight(cx, cy, s, a, on){
  withAlpha(a, () => {
    ctx.translate(cx, cy); ctx.scale(s, s);
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
    rr(-82, -212, 164, 424, 40); ctx.fillStyle = C.navy; ctx.fill(); ctx.restore();
    for (const [k, col, dy] of [['drop', C.red, -130], ['relay', C.orange, 0], ['forward', C.green, 130]]){
      ctx.beginPath(); ctx.arc(0, dy, 56, 0, Math.PI*2); ctx.fillStyle = '#34446a'; ctx.fill();
      const v = on[k] || 0;
      if (v > 0){ ctx.save(); ctx.globalAlpha *= v; ctx.shadowColor = col; ctx.shadowBlur = 50; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, dy, 56, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    }
  });
}
// 3D 블록 (지식증류 도식용)
function cuboid(x, y, w, h, d, f, tp, sd){
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d*0.8); ctx.lineTo(x + w + d, y - d*0.8); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fillStyle = tp; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d, y - d*0.8); ctx.lineTo(x + w + d, y + h - d*0.8); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fillStyle = sd; ctx.fill();
  ctx.fillStyle = f; ctx.fillRect(x, y, w, h);
}
function ebar(x, y, w, h, vals, col, a){
  withAlpha(a, () => {
    const n = vals.length, cw = w/n;
    for (let i = 0; i < n; i++){ ctx.fillStyle = withA(col, 0.12 + 0.88*vals[i]); ctx.fillRect(x + i*cw, y, cw, h); }
    ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  });
}
function withA(hex, a){ const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function arrow(x1, y1, x2, y2, col, a, w=5, prog=1){
  withAlpha(a, () => {
    const x = lerp(x1, x2, prog), y = lerp(y1, y2, prog), ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x - Math.cos(ang)*w*2, y - Math.sin(ang)*w*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(ang - 0.45)*w*4.5, y - Math.sin(ang - 0.45)*w*4.5); ctx.lineTo(x - Math.cos(ang + 0.45)*w*4.5, y - Math.sin(ang + 0.45)*w*4.5); ctx.closePath(); ctx.fill();
  });
}
// 결정적 난수

// ─────────────── ③과 같은 공장 배치 (render/03_basics/scene.js 의 그리기 함수를 옮겨 씀) ───────────────
// 가로 한 줄: 출고(frontend)·승인(auth)·차체(post)·도장(comment), 아래 줄 = 레플리카, 가운데 통로, 위 생산관리실.
// 윗줄 문은 아래(통로 쪽), 아랫줄 문은 위. 검사원은 문 옆(윗줄 오른쪽 아래, 아랫줄 오른쪽 위).
const CX = [370, 750, 1130, 1510], ZW = 300, ZH = 200, ROWY = [420, 700];
const SV = ['frontend', 'auth', 'post', 'comment'], PROC = ['출고 담당', '승인 담당', '차체 공정', '도장 공정'];
const CTRL = { x: 760, y: 150, w: 400, h: 150 }, BLD = { x: 140, y: 70, w: 1640, h: 910 };
const INSP = (i, r) => [CX[i] + (r === 0 ? 50 : 100), r === 0 ? 588 : 748];
const DOOR = (i, r) => [CX[i], r === 0 ? ROWY[0] + ZH : ROWY[1]];
const WK = (i, r) => [CX[i] - 70, r === 0 ? ROWY[0] + 110 : ROWY[1] + 118];
const FULL = [960, 525, 0.8];
const w2s = (c, x, y) => [960 + (x - c[0])*c[2], 470 + (y - c[1])*c[2]];
function polyLen(pts){ let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); return s; }
function glowStroke(x, y, w, h, r, col, k, lw=5){
  if (k <= 0) return;
  withAlpha(k, () => { ctx.shadowColor = col; ctx.shadowBlur = 26; rr(x, y, w, h, r); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.stroke(); });
}
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
function drawTag(i, x, y, a){
  if (a <= 0) return;
  withAlpha(a, () => {
    font(22); const m = ctx.measureText(SV[i]).width, w = 38 + m + 18, h = 38;
    ctx.translate(x + (w - 38)/2, y);
    rr(-w/2, -h/2, w, h, h/2); ctx.fillStyle = C.pnu; ctx.fill();
    pieceGlyph(i, -w/2 + 19, 0, 0.42, '#fff');
    font(22); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(SV[i], -w/2 + 38, 1);
  });
}
function drawZone(i, r, t, a=1, k=0){
  if (a <= 0) return;
  const cx = CX[i], zy = ROWY[r], x = cx - ZW/2;
  zone(x, zy, ZW, ZH, null, a, k);
  withAlpha(a, () => {
    const dy = r === 0 ? zy + ZH : zy;
    ctx.fillStyle = k > 0.3 ? '#F9E3E3' : '#F7F9FC'; ctx.fillRect(cx - 34, dy - 5, 68, 10);
    ctx.fillStyle = C.edge; ctx.fillRect(cx - 40, dy - 10, 7, 20); ctx.fillRect(cx + 33, dy - 10, 7, 20);
  });
  if (r === 0) text(PROC[i], cx, zy - 28, 30, k > 0.5 ? C.red : C.text, 'center', a);
  procGlyph(i, cx + 62, r === 0 ? zy + 78 : zy + 150, 0.9, t, a);
  const [wx, wy] = WK(i, r), bob = Math.sin(t*3.2 + i*1.7 + r*0.9)*2.5;
  person(wx, wy + bob, 0.75, a);
  drawTag(i, wx, wy - 80, a);
}
// 요청서·부품이 다니는 길 (③과 같음): 구역 안 → 문 → 통로 → 상대 문 → 구역 안
function itemPath(a, ra, b, rb){
  const ys = r => r === 0 ? 555 : 775, yd = r => r === 0 ? 620 : 700, lane = a < b ? 650 : 670;
  return [[CX[a], ys(ra)], [CX[a], yd(ra)], [CX[a], lane], [CX[b], lane], [CX[b], yd(rb)], [CX[b], ys(rb)]];
}
const doorFrac = pts => Math.hypot(pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]) / polyLen(pts);
function scanFx(x, y, k, t){
  if (k <= 0) return;
  withAlpha(k, () => {
    rr(x - 34, y - 40, 68, 80, 8); ctx.fillStyle = 'rgba(0,166,81,0.16)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = C.pnuGreen; ctx.stroke();
    const ly = y - 36 + 72*((t*2.4) % 1);
    ctx.shadowColor = C.pnuGreen; ctx.shadowBlur = 14; ctx.fillStyle = C.pnuGreen; ctx.fillRect(x - 32, ly - 2, 64, 4);
  });
}
function drawItem(kind, x, y, s, a, col){ if (kind === 'doc') docSheet(x, y, s, a, col); else partBox(x, y, s, a, col); }
// 평소 오가는 요청서·부품. o.te = 멈춘 시각(생산 멈춤), o.scan = 검사원이 서 있는지(0~1), o.grey
const ROUTES = [[0,2,'doc',2.6,0.0],[0,3,'doc',2.9,0.9],[2,1,'doc',3.1,0.4],[3,2,'doc',3.7,1.7],[2,0,'part',3.3,1.9],[3,0,'part',3.5,0.3]];
function ambient(t, a, o={}){
  if (a <= 0) return;
  const te = o.te !== undefined ? Math.min(t, o.te) : t;
  for (const [ia, ib, kind, per, ph] of ROUTES){
    const k0 = Math.max(0, Math.floor((te - ph - 8)/per));
    for (let k = k0; ; k++){
      const t0 = ph + k*per; if (t0 > te) break;
      const r = k % 2, pts = itemPath(ia, r, ib, r), L = polyLen(pts), dur = L/300;
      if (te > t0 + dur) continue;
      const u = (te - t0)/dur, [x, y] = polyAt(pts, u), passT = t0 + doorFrac(pts)*dur;
      const al = a * P(te, t0, t0 + 0.2) * (1 - P(te, t0 + dur - 0.25, t0 + dur));
      const sc = o.scan === undefined ? 1 : o.scan;
      if (sc > 0.5 && !o.grey) scanFx(x, y, al * (1 - clamp(Math.abs(te - passT)/0.35)), t);
      const col = o.grey ? C.dim : (sc > 0.5 && te > passT) ? C.green : kind === 'doc' ? C.pnu : C.amber;
      drawItem(kind, x, y, 0.55, al, col);
    }
  }
}
// 공장 전체 (월드 좌표, withCam 안에서 부른다)
// o: {row1A, ctrlA, insA(i,r)->0~1, k(i,r)->0~1, amb, ambO, glow:[[i,r,col,k]], gate}
function factory(t, o={}){
  rr(BLD.x, BLD.y, BLD.w, BLD.h, 26); ctx.fillStyle = '#FBFCFE'; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  if (o.gate){ ctx.fillStyle = '#FFFFFF'; ctx.fillRect(BLD.x - 4, 636, 8, 48); ctx.fillStyle = C.sub; ctx.fillRect(BLD.x - 8, 630, 16, 8); ctx.fillRect(BLD.x - 8, 682, 16, 8); }
  ctx.fillStyle = C.sub; ctx.beginPath(); ctx.moveTo(BLD.x + 30, BLD.y + 62);
  for (let k = 0; k < 3; k++){ ctx.lineTo(BLD.x + 30 + k*22, BLD.y + 38); ctx.lineTo(BLD.x + 52 + k*22, BLD.y + 50); }
  ctx.lineTo(BLD.x + 96, BLD.y + 62); ctx.closePath(); ctx.fill();
  text('자동차 공장', BLD.x + 110, BLD.y + 50, 32, C.sub, 'left');
  ctx.fillStyle = '#EEF2F7'; ctx.fillRect(BLD.x + 40, 638, BLD.w - 80, 44);
  if (o.gate) ctx.fillRect(BLD.x - 4, 638, 48, 44);
  ctx.strokeStyle = '#D5DEEA'; ctx.lineWidth = 2; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.moveTo(BLD.x + 50, 660); ctx.lineTo(BLD.x + BLD.w - 50, 660); ctx.stroke(); ctx.setLineDash([]);
  controlRoom(CTRL.x, CTRL.y, CTRL.w, CTRL.h, o.ctrlA === undefined ? 1 : o.ctrlA);
  const kf = o.k || (() => 0), r1 = o.row1A === undefined ? 1 : o.row1A;
  for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) drawZone(i, r, t, r === 1 ? r1 : 1, kf(i, r));
  for (const [i, r, col, k] of (o.glow || [])) glowStroke(CX[i] - ZW/2, ROWY[r], ZW, ZH, 18, col, k);
  if (o.amb) ambient(t, o.amb, o.ambO || {});
  for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){
    const ia = (o.insA ? o.insA(i, r) : 1) * (r === 1 ? r1 : 1); if (ia <= 0) continue;
    const [x, y] = INSP(i, r); inspector(x, y, 0.6, ia);
  }
}
// 질문자 (링 아나운서): ③과 같은 모습 — 정장 + 나비넥타이 + 마이크, 물음표 말풍선
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
  const age = t - t0 - 0.25, b = eo(P(age, 0, 0.3)) * a;
  if (b <= 0) return;
  const pp = 1 + 0.3*Math.exp(-Math.max(0, age)*9), bx = x - 150, by = y - 170 + Math.sin(t*3)*4;
  withAlpha(b, () => {
    ctx.translate(bx, by); ctx.scale(pp, pp);
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.18)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.ellipse(0, 0, 78, 64, 0, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 3; ctx.strokeStyle = C.amber; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40, 46); ctx.lineTo(92, 96); ctx.lineTo(18, 60); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(40, 49); ctx.lineTo(92, 96); ctx.lineTo(21, 62); ctx.stroke();
    ctx.font = '900 88px KRH'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.amber; ctx.fillText('?', 0, 4);
  });
}
// 큰 판정 글자 (흰 받침)
function verdictWord(s, x, y, col, a, age){
  if (a <= 0) return;
  withAlpha(a*0.9, () => { font(96); ctx.font = '900 96px KRH'; const m = ctx.measureText(s).width; rr(x - m/2 - 40, y - 70, m + 80, 140, 28); ctx.fillStyle = '#fff'; ctx.fill(); });
  punch(s, x, y, 96, col, a, age);
}

// ─────────────── A·B. 검사원 소개 → 나가는 트래픽 스캔 (0~23.3) ───────────────
// 차체 공정(post) 윗 구역의 문(아래)과 검사원을 확대. 격자는 화면 오른쪽 카드에 쌓인다.
const GX = 1080, GY = 250, GW = 480, GH = 327, CARD = { x: 1000, y: 175, w: 860, h: 560 };
const SCAN_T = [9.7, 10.25, 10.8, 11.35, 11.9];
const FEAT = [[15.0, '요청 종류'], [15.9, '경로'], [16.5, '크기'], [17.2, '시간 간격'], [17.95, '… 모두 20가지']];
const SCAM = [[0, ...FULL], [1.0, ...FULL], [2.4, 1180, 560, 2.3], [5.9, 1185, 560, 2.3], [7.1, 1400, 560, 1.6], [19.9, 1410, 560, 1.63]];
const INS_POP = (i, r) => 1.1 + (r*4 + i)*0.13;
function partScan(t){
  const a = win(t, -1, 0, 19.9, 20.5);
  const cam = camAt(t, SCAM);
  if (a > 0){
    const [px, py] = DOOR(2, 0);
    withAlpha(a, () => withCam(cam, 0, 0, () => {
      factory(t, { insA: (i, r) => eo(P(t, INS_POP(i, r), INS_POP(i, r) + 0.3)),
                   amb: win(t, -1, 0, 6.0, 6.6), ambO: { scan: t > 1.8 ? 1 : 0 } });
      // 들어오는 것: 검사 없이 통과
      const ina = win(t, 6.9, 7.2, 8.6, 9.0);
      if (ina > 0){ const [x, y] = polyAt(itemPath(1, 0, 2, 0).slice(2), eio(P(t, 6.95, 8.5))); docSheet(x, y, 0.8, ina, C.sub); }
      // 나가는 것 5개: 문에서 스캔 → 통로로
      for (let i = 0; i < 5; i++){
        const s = SCAN_T[i], da = win(t, s - 1.0, s - 0.8, s + 0.6, s + 0.9);
        if (da <= 0) continue;
        const [wx, wy] = WK(2, 0);
        const p = t < s ? polyAt([[wx + 40, wy - 10], [px, 555], [px, 620]], eio(P(t, s - 0.95, s)))
                        : polyAt([[px, 620], [px, 650], [900, 650]], eo(P(t, s, s + 0.9)));
        scanFx(p[0], p[1], da*win(t, s - 0.2, s - 0.05, s + 0.15, s + 0.35), t);
        docSheet(p[0], p[1], 0.8, da, t >= s ? C.green : C.pnu);
      }
    }));
    // 문 옆 안내
    const [dx] = w2s(cam, px, 700);
    pill('들어오는 것 → 그대로', dx, 135, 28, C.sub, a*win(t, 7.1, 7.4, 8.4, 8.7));
    pill('나가는 것 → 스캔', dx, 135, 28, C.pnuGreen, a*win(t, 8.6, 8.9, 13.6, 14.1));
    // A: 세 가지 기술 칩 (확대 중 오른쪽을 흐리게)
    const veil = win(t, 2.6, 3.4, 6.2, 6.9);
    if (veil > 0){ const g = ctx.createLinearGradient(1050, 0, 1300, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(255,255,255,${0.88*veil})`); ctx.fillStyle = g; ctx.fillRect(1050, 30, 870, 880); }
  }
  const labels = ['나가는 트래픽 스캔', '딥러닝 이상탐지', '검사기 경량화'];
  for (let i = 0; i < 3; i++){
    const t0 = 3.9 + i*0.45;
    const ca = i === 0 ? eo(P(t, t0, t0 + 0.35)) : win(t, t0, t0 + 0.35, 6.3, 6.8);
    if (ca <= 0) continue;
    if (i === 0){
      const m = eio(P(t, 6.3, 7.1));
      chip(1, labels[0], lerp(1240 + 60*(1 - ca), 56, m), lerp(420, 76, m), ca*win(t, 0, 0.1, 19.9, 20.4), lerp(40, 28, m));
    } else chip(i + 1, labels[i], 1240 + 60*(1 - ca), 420 + i*120, ca, 40);
  }
  // B: 이미지 카드 (화면 좌표). 질문자 컷(~23.3)까지 남아 가운데로 옮겨 간다
  const ga = win(t, 9.0, 9.5, 22.8, 23.3); if (ga <= 0) return;
  const mv = eio(P(t, 19.9, 20.7)), ox = -380*mv;
  const cw = GW/5;
  const colProg = SCAN_T.map(s => t >= s + 0.5 ? 1 : 0);
  withAlpha(ga, () => {
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.16)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    rr(CARD.x + ox, CARD.y, CARD.w, CARD.h, 22); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.edge; ctx.stroke();
  });
  cellGrid(GX + ox, GY, GW, GH, NORM, colProg, ga, 1 - 0.6*eo(P(t, 17.9, 18.9)));
  withAlpha(ga, () => { ctx.strokeStyle = C.text; ctx.lineWidth = 2; ctx.strokeRect(GX + ox, GY, GW, GH); });
  const ax = eo(P(t, 12.1, 12.6))*ga;
  withAlpha(ax, () => {
    ctx.save(); ctx.translate(GX + ox - 34, GY + GH/2); ctx.rotate(-Math.PI/2);
    font(28); ctx.fillStyle = C.sub; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('특징 20개', 0, 0); ctx.restore();
    text('나간 것 5개', GX + ox + GW/2, GY + GH + 70, 28, C.sub, 'center');
  });
  for (let c = 0; c < 5; c++) text(String(c + 1), GX + ox + (c + 0.5)*cw, GY + GH + 26, 24, C.dim, 'center', ga*colProg[c]);
  // 스캔된 한 줄(세로 20칸)이 문에서 카드로 날아가 쌓인다
  const [sx, sy] = w2s(cam, DOOR(2, 0)[0], DOOR(2, 0)[1]);
  for (let i = 0; i < 5; i++){
    const s = SCAN_T[i];
    if (t >= s && t < s + 0.5){
      const u = eio(P(t, s, s + 0.5));
      strip(lerp(sx - 20, GX + i*cw, u), lerp(sy - GH*0.3, GY, u), lerp(cw*0.45, cw, u), lerp(GH*0.6, GH, u), i, P(t, s, s + 0.3), 1);
    }
  }
  // 한 줄 = 특징 20개
  const ha = win(t, 14.3, 14.7, 19.5, 19.9)*ga;
  if (ha > 0) withAlpha(ha, () => {
    ctx.save(); ctx.shadowColor = C.gold; ctx.shadowBlur = 18; ctx.strokeStyle = C.gold; ctx.lineWidth = 5;
    ctx.strokeRect(GX + 4*cw - 3, GY - 3, cw + 6, GH + 6); ctx.restore();
    text('한 줄', GX + 4.5*cw, GY - 34, 30, C.gold, 'center');
  });
  FEAT.forEach(([ft, s], i) => {
    const fa2 = win(t, ft, ft + 0.25, 19.5, 19.9)*ga; if (fa2 <= 0) return;
    const y = GY + 20 + i*72, x = 1710 + 16*(1 - eo(P(t, ft, ft + 0.3)));
    withAlpha(fa2*0.6, () => { ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GX + GW + 6, lerp(GY + 20, GY + GH - 20, i/4)); ctx.lineTo(x - 92, y); ctx.stroke(); });
    pill(s, x, y, 28, i === 4 ? C.gold : C.text, fa2);
  });
}

// ─────────────── Q1. 질문자 (20.0~23.3) ───────────────
function partQ1(t){ asker(t, 20.1, 22.7); }

// ─────────────── C. 딥러닝 이상탐지 (23.2~45.5) ───────────────
const FC = [1180, 470];
const NPTS = (() => { const r = rng(7), out = []; for (let i = 0; i < 30; i++){ const th = r()*Math.PI*2, rad = Math.sqrt(r()); out.push([FC[0] + Math.cos(th)*rad*230, FC[1] + Math.sin(th)*rad*140, r()]); } return out; })();
const THUMBS = [[1085, 420], [1270, 505], [1180, 400]];
function fencePath(prog){
  const n = 90, m = Math.max(2, Math.round(n*prog));
  ctx.beginPath();
  for (let i = 0; i <= m; i++){
    const th = i/n*Math.PI*2, k = 1 + 0.07*Math.sin(3*th + 0.6) + 0.05*Math.cos(5*th);
    const x = FC[0] + Math.cos(th)*300*k, y = FC[1] + Math.sin(th)*200*k;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
}
function partDetect(t){
  const a = win(t, 23.1, 23.6, 39.9, 40.6);
  if (a > 0){
    const cam = camAt(t, [[23.2, 960, 460, 1.05], [33.5, 960, 460, 1.09], [39.9, 940, 460, 1.11]]);
    withAlpha(a, () => withCam(cam, 0, 0, () => {
      // OCSVM 산점도 좌표축 (특징 공간)
      const axa = eo(P(t, 23.7, 24.4));
      if (axa > 0) withAlpha(axa*0.85, () => {
        const ox0 = 812, oy0 = 726, ax1 = 1660, ay1 = 208;
        ctx.strokeStyle = C.dim; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ox0, oy0); ctx.lineTo(ax1, oy0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox0, oy0); ctx.lineTo(ox0, ay1); ctx.stroke();
        ctx.fillStyle = C.dim;
        ctx.beginPath(); ctx.moveTo(ax1, oy0); ctx.lineTo(ax1 - 15, oy0 - 8); ctx.lineTo(ax1 - 15, oy0 + 8); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ox0, ay1); ctx.lineTo(ox0 - 8, ay1 + 15); ctx.lineTo(ox0 + 8, ay1 + 15); ctx.closePath(); ctx.fill();
      });
      // 학습 데이터: 평소 나가던 정상 이미지 더미
      const sa = eo(P(t, 23.2, 23.7));
      const glow = eo(P(t, 37.5, 38.0));
      withAlpha(sa, () => {
        text('평소 나가던 이미지', 330, 175, 30, C.sub, 'center');
        for (let k = 2; k >= 0; k--) thumbG(NV[k], 330 + k*14, 300 - k*14, 230, 1, k === 0 && glow > 0 ? C.green : null, 5);
        if (glow > 0) pill('정상만 학습', 330, 440, 30, C.green, glow, glow);
      });
      // 공격 이미지: 학습에 안 씀
      const xa = eo(P(t, 34.3, 34.8));
      withAlpha(xa, () => {
        text('공격 이미지', 330, 545, 30, C.sub, 'center');
        thumbG(SUBTLE, 344, 650, 190, 0.55); thumbG(OUTL, 330, 664, 190, 0.55);
        const xs = eo(P(t, 36.3, 36.7));
        if (xs > 0){ ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(250, 600); ctx.lineTo(lerp(250, 420, xs), lerp(600, 730, xs)); ctx.stroke();
          if (xs > 0.5){ const q = (xs - 0.5)*2; ctx.beginPath(); ctx.moveTo(420, 600); ctx.lineTo(lerp(420, 250, q), lerp(600, 730, q)); ctx.stroke(); } }
      });
      // 학습 흐름 (정상 → 경계 안)
      flowLine(480, 300, 860, 430, t, C.green, 0.7*win(t, 23.5, 23.9, 39.9, 40.4)*(0.5 + 0.5*glow));
      // 정상 점들이 모인다
      NPTS.forEach(([x, y, r], i) => {
        const t0 = 23.6 + r*1.5, u = eio(P(t, t0, t0 + 0.8));
        if (u <= 0) return;
        const px = lerp(360, x, u), py = lerp(300, y, u);
        withAlpha(u, () => { ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI*2); ctx.fillStyle = C.green; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); });
      });
      THUMBS.forEach(([x, y], i) => {
        const u = eio(P(t, 24.0 + i*0.35, 24.9 + i*0.35)); if (u <= 0) return;
        thumbG(NV[i], lerp(360, x, u), lerp(300, y, u), lerp(200, 110, u), u, C.green, 3, 0.2);
      });
      // 울타리 (정상 경계)
      const fp = eio(P(t, 27.8, 29.3));
      if (fp > 0){
        ctx.save(); fencePath(fp); ctx.strokeStyle = C.green; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.stroke(); ctx.restore();
        if (fp >= 1){ ctx.save(); fencePath(1); ctx.fillStyle = 'rgba(22,163,74,0.06)'; ctx.fill(); ctx.restore(); }
        pill('정상 경계', FC[0] - 250, FC[1] + 205, 28, C.green, eo(P(t, 29.0, 29.4)));
      }
      // 벗어난 하나: 이상 이미지 → 경계 밖 빨간 점 하나로 대응
      const oa = eo(P(t, 30.3, 31.3));
      if (oa > 0){
        const ox = lerp(2050, 1660, oa), oy = lerp(150, 235, oa);
        const bad = eo(P(t, 32.4, 32.7));
        const dotX = 1545, dotY = 300;   // 정상 경계 밖
        thumbG(OUTL, ox, oy, 128, 1, bad > 0 ? C.red : C.sub, bad > 0 ? 6 : 2, 0.2);
        if (bad > 0){
          // 이미지 → 경계 밖 점 대응선
          withAlpha(bad*0.55, () => { ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(ox - 40, oy + 46); ctx.lineTo(dotX + 12, dotY - 10); ctx.stroke(); ctx.setLineDash([]); });
          // 경계 밖 빨간 점 하나 (정상=경계 안 점들 / 이상=경계 밖 점)
          withAlpha(bad, () => {
            ctx.save(); ctx.shadowColor = C.red; ctx.shadowBlur = 22*bad;
            ctx.beginPath(); ctx.arc(dotX, dotY, 13, 0, Math.PI*2); ctx.fillStyle = C.red; ctx.fill();
            ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
          });
          pill('이상', dotX, dotY + 46, 32, C.red, bad, bad);
        }
      }
    }));
  }
  // 사람 눈엔 거의 똑같은 정상 / 이상 (3칸만 다름)
  const b = win(t, 40.1, 40.7, 44.9, 45.5);
  if (b > 0){
    const sl = 60*(1 - eo(P(t, 40.1, 40.8)));
    const v = eo(P(t, 43.55, 43.9));
    thumbG(NORM, 600 - sl, 420, 540, b, v > 0 ? C.green : null, 7);
    thumbG(SUBTLE, 1320 + sl, 420, 540, b, v > 0 ? C.red : null, 7);
    // 다른 3칸을 빨갛게 짚는다
    const dc = eo(P(t, 43.7, 44.1));
    if (dc > 0) withAlpha(b*dc, () => {
      const w = 540, h = w/1.47, x0 = 1320 + sl - w/2, y0 = 420 - h/2;
      for (const [r, c] of SUBTLE_CELLS){ ctx.save(); ctx.shadowColor = C.red; ctx.shadowBlur = 14; ctx.strokeStyle = C.red; ctx.lineWidth = 4;
        ctx.strokeRect(x0 + c*w/5 - 3, y0 + r*h/20 - 3, w/5 + 6, h/20 + 6); ctx.restore(); }
    });
    punch('≈', 960, 420, 120, C.sub, b*(1 - v*0.7), t - 41.6);
    // 확대경이 오른쪽 이미지를 훑는다
    const mg = win(t, 42.0, 42.3, 43.4, 43.7);
    if (mg > 0) withAlpha(mg*b, () => {
      const u = eio(P(t, 42.0, 43.5)), mx = 1150 + u*340, my = 330 + Math.sin(u*Math.PI*2)*70;
      ctx.lineWidth = 9; ctx.strokeStyle = C.navy; ctx.beginPath(); ctx.arc(mx, my, 56, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx + 40, my + 40); ctx.lineTo(mx + 86, my + 86); ctx.lineWidth = 14; ctx.stroke();
    });
    pill('정상', 600 - sl, 700, 38, C.green, b*v, v);
    pill('이상', 1320 + sl, 700, 38, C.red, b*v, v);
    text('사람 눈엔 거의 똑같아도', 960, 150, 44, C.text, 'center', b*eo(P(t, 41.6, 42.0))*(1 - v));
  }
  // 칩 ② (코너) + 핵심 단어
  const w = win(t, 27.8, 28.1, 29.4, 29.9);
  punch('딥러닝 이상탐지', 960, 150, 72, C.pnu, w*a, t - 27.8);
  chip(2, '딥러닝 이상탐지', 56, 76, eo(P(t, 29.5, 29.9))*win(t, 23, 23.1, 44.9, 45.4), 28);
}

// ─────────────── D. 검사기 경량화 · 지식증류 (45.5~62.9) ───────────────
const TV = (() => { const r = rng(3); return Array.from({ length: 16 }, () => r()); })();
const SV0 = (() => { const r = rng(91); return Array.from({ length: 16 }, () => r()); })();
function partKD(t){
  // 핵심 단어 + 칩 ③
  punch('검사기 경량화', 960, 470, 96, C.pnu, win(t, 46.5, 46.8, 47.9, 48.4), t - 46.5);
  chip(3, '검사기 경량화', 56, 76, eo(P(t, 48.0, 48.4))*win(t, 45, 45.1, 62.6, 63.1), 28);
  // D1. 공장 전체: 구역마다 검사원 → 서비스마다 따로 학습한 검사기 → 느리면 공장 전체가 느려진다 (48.3~53.3)
  const a1 = win(t, 48.3, 48.8, 52.7, 53.3);
  if (a1 > 0){
    const slow = eo(P(t, 50.3, 51.4));
    const cam = camAt(t, [[48.3, 960, 525, 0.78], [53.3, 960, 530, 0.82]]);
    withAlpha(a1, () => withCam(cam, 0, 0, () => {
      factory(t, { glow: [], amb: 1 - 0.6*slow });
      // 서비스마다 따로 학습한 검사기 (같은 서비스 = 같은 색 블록)
      const COLS = [['#A7E3BE', '#CDEFD9', '#7FC79C'], ['#F5B8B8', '#F9D5D5', '#D98E8E'], ['#A7C7EE', '#C6DBF5', '#85A6CC'], ['#D6C1F2', '#E6D8F8', '#B39AD6']];
      for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){
        const da = eo(P(t, 49.1 + i*0.15, 49.4 + i*0.15)), [x, y] = INSP(i, r), [f, tp, sd] = COLS[i];
        withAlpha(da, () => cuboid(x - 14, y - 78, 26, 26, 12, f, tp, sd));
      }
      // 느려짐: 문 앞에 요청서가 줄을 선다
      for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){
        const [x, y] = DOOR(i, r);
        for (let q = 0; q < 3; q++){
          const qa = eo(P(t, 50.6 + q*0.35 + i*0.05, 50.9 + q*0.35 + i*0.05));
          docSheet(x - 48*(q + 1) + 20, r === 0 ? y - 40 : y + 40, 0.55, qa, C.orange);
        }
      }
      withAlpha(slow, () => { ctx.fillStyle = 'rgba(234,88,12,0.10)'; ctx.fillRect(BLD.x + 40, 638, BLD.w - 80, 44); });
    }));
    pill('서비스마다 따로 학습', 1480, 74, 30, C.pnu, win(t, 49.0, 49.4, 50.6, 51.0));
    const ha = win(t, 51.3, 51.7, 52.7, 53.3);
    if (ha > 0) verdictWord('느려짐', 960, 820, C.orange, ha, t - 51.3);
  }
  // D2. 선생님 검사기 → 학생 검사기 (53.0~62.9)
  const a2 = win(t, 53.0, 53.6, 62.5, 63.1);
  if (a2 <= 0) return;
  const ta = eo(P(t, 53.2, 53.8)), sa = eo(P(t, 56.5, 57.0));
  const tfade = 1 - 0.7*eo(P(t, 61.4, 62.0));
  withAlpha(a2, () => {
    // 선생님 줄
    withAlpha(ta*tfade, () => {
      ctx.translate(-80*(1 - ta), 0);
      text('선생님 검사기', 140, 150, 42, C.text, 'left');
      text('파라미터 314.69K', 440, 152, 32, C.gold, 'left');
      // 도식만 아래로 내려 파라미터 자막과 겹치지 않게
      ctx.save(); ctx.translate(0, 48);
      thumbG(NORM, 230, 305, 130, 1);
      arrow(310, 305, 345, 305, C.dim, 1, 4);
      cuboid(360, 230, 120, 160, 60, '#F0AA84', '#F5C3A5', '#C98B6C');
      cuboid(560, 220, 150, 180, 70, '#F0AA84', '#F5C3A5', '#C98B6C');
      cuboid(790, 280, 80, 60, 22, '#F0AA84', '#F5C3A5', '#C98B6C');
      ctx.fillStyle = '#F0AA84'; ctx.fillRect(900, 220, 18, 170); ctx.fillRect(940, 250, 18, 110);
      arrow(972, 305, 1010, 305, C.dim, 1, 4);
      const tb = eo(P(t, 54.8, 55.6));
      ebar(1020, 283, 400, 44, TV.map(v => v*tb), C.orange, 1);
      text('판단', 1220, 360, 26, C.sub, 'center', tb);
      ctx.restore();
    });
    // 학생 줄
    withAlpha(sa, () => {
      ctx.translate(-80*(1 - sa), 0);
      text('학생 검사기', 140, 560, 42, C.text, 'left');
      text('파라미터 1.23K ~ 12.64K', 400, 562, 32, C.gold, 'left');
      thumbG(NORM, 230, 700, 130, 1);
      arrow(310, 700, 513, 700, C.dim, 1, 4);
      // conv 블록을 선생님 검사기의 가로 중앙(≈659)에 맞춤
      cuboid(528, 660, 26, 90, 30, '#A7C7EE', '#C6DBF5', '#85A6CC');
      cuboid(598, 660, 34, 90, 30, '#A7C7EE', '#C6DBF5', '#85A6CC');
      cuboid(678, 690, 40, 26, 8, '#A7C7EE', '#C6DBF5', '#85A6CC');
      ctx.fillStyle = '#A7C7EE'; ctx.fillRect(748, 670, 12, 70); ctx.fillRect(778, 660, 12, 90);
      arrow(810, 700, 1010, 700, C.dim, 1, 4);
      const lp = eio(P(t, 58.9, 59.8));
      ebar(1020, 678, 400, 44, SV0.map((v, i) => lerp(v, TV[i], lp)), C.pnu, 1);
      text('판단', 1220, 755, 26, C.sub, 'center');
    });
    // 따라 배우기 (선생님 판단 → 학생 판단)
    const ka = win(t, 57.95, 58.3, 61.3, 61.8);
    if (ka > 0){
      for (const x of [1080, 1220, 1360]){
        withAlpha(ka, () => { ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t*40; ctx.beginPath(); ctx.moveTo(x, 383); ctx.lineTo(x, 655); ctx.stroke(); ctx.setLineDash([]); });
        arrow(x, 630, x, 668, C.gold, ka, 4);
      }
      pill('따라 배우기', 1580, 500, 32, C.gold, ka);
    }
    // 지식증류
    const kw = eo(P(t, 61.3, 61.6));
    if (kw > 0){
      withAlpha(kw*0.85, () => { rr(440, 405, 540, 110, 24); ctx.fillStyle = '#fff'; ctx.fill(); });
      punch('지식증류', 710, 460, 96, C.pnu, kw, t - 61.3);
    }
    // 학생 검사기가 검사원에게
    const ia = eo(P(t, 61.2, 61.6));
    if (ia > 0){
      inspector(1650, 720, 1.0*pop(t, 61.2), ia);
      const u = eio(P(t, 61.6, 62.4));
      withAlpha(ia, () => { const cx = lerp(470, 1650, u), cy = lerp(700, 610, u) - Math.sin(u*Math.PI)*120; cuboid(cx - 18, cy - 14, 30, 30, 14, '#A7C7EE', '#C6DBF5', '#85A6CC'); });
    }
  });
}

// ─────────────── E. 의심만으로 막으면 → 한 번 더 확인 (62.8~69.4) ───────────────
const ECAM = [960, 500, 0.9];
function partHalt(t){
  const a = win(t, 62.8, 63.3, 67.3, 67.8); if (a <= 0) return;
  const block = eo(P(t, 64.6, 64.9)), halt = eo(P(t, 65.1, 65.8));
  withAlpha(a, () => withCam(ECAM, 0, 0, () => {
    factory(t, { amb: 1, ambO: { te: 65.1, grey: halt > 0.5 } });
    // 차체 공정 문에서 정상 요청서가 의심만으로 막힘
    const [wx, wy] = WK(2, 0);
    const [dx, dy] = polyAt([[wx + 40, wy - 10], [1130, 555], [1130, 620], [1130, 652]], eio(P(t, 63.2, 63.9)));
    docSheet(dx, dy, 1.1, 1, C.pnu);
    qmark(dx - 52, dy - 20, eo(P(t, 63.9, 64.2)), C.amber, 50);
    if (block > 0) withAlpha(block, () => { rr(1080 - 30*(1 - block), 684, 100 + 60*(1 - block), 14, 6); ctx.fillStyle = C.red; ctx.fill(); });
    // 다른 구역은 멈춰 선다
    if (halt > 0) for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){
      if (i === 2 && r === 0) continue;
      const [x, y] = WK(i, r); text('…', x + 40, y - 50, 40, C.dim, 'center', halt);
    }
  }));
  pill('생산 멈춤', 1470, 225, 36, C.red, a*eo(P(t, 65.6, 66.0)), eo(P(t, 65.6, 66.0)));
}

// ─────────────── F·G·H. 반려(Drop) · 교체(Relay) · 통과(Forward) (67.4~100.3) ───────────────
// Drop: 차체 공정(post) 윗 구역 · 생산관리실 · 아래 줄 차체 구역(레플리카) 기록
// Relay·Forward: 출고 담당(frontend) 윗 구역 · 아래 줄 출고 구역(레플리카) · 공장 밖 고객
const CHK_D = [1130, 652], CHK_R = [370, 652], SLOT_A = [390, 660], SLOT_B = [505, 660], CUST = [40, 640];
const STCAM = [[69.1, 1100, 560, 1.1], [79.9, 1110, 560, 1.12], [80.8, 360, 580, 1.3], [99.8, 370, 580, 1.33]];
function partLightAndStage(t){
  // 신호등: 가운데 크게 → 오른쪽 위 작게
  const la = win(t, 67.4, 67.9, 99.8, 100.3);
  if (la > 0){
    const m = eio(P(t, 69.0, 69.7));
    const on = {
      drop: t < 69.2 ? eo(P(t, 67.9, 68.1)) : eo(P(t, 77.5, 77.7))*(1 - eo(P(t, 80.3, 80.5))),
      relay: t < 69.2 ? eo(P(t, 68.3, 68.5)) : eo(P(t, 88.1, 88.3))*(1 - eo(P(t, 96.4, 96.6))),
      forward: t < 69.2 ? eo(P(t, 68.7, 68.9)) : eo(P(t, 97.8, 98.0)),
    };
    const lab = la*(1 - eo(P(t, 68.95, 69.25)));
    [['반려 (Drop)', C.red, -130, 67.9], ['교체 (Relay)', C.orange, 0, 68.3], ['통과 (Forward)', C.green, 130, 68.7]].forEach(([s, col, dy, t0]) => {
      text(s, 840 + 20*(1 - eo(P(t, t0, t0 + 0.3))), 450 + dy, 54, col, 'left', lab*eo(P(t, t0, t0 + 0.3)));
    });
    // 무대가 깔린 뒤 맨 위에 다시 그린다 (아래 참고)
    partLightAndStage.light = [lerp(700, 1830, m), lerp(450, 205, m), lerp(1.0, 0.3, m)*pop(t, 67.4), la, on];
  } else partLightAndStage.light = null;
  const a = win(t, 69.1, 69.7, 99.8, 100.3);
  if (a > 0){
    const cam = camAt(t, STCAM);
    const cA = win(t, 69.1, 69.7, 80.0, 80.6);
    withAlpha(a, () => withCam(cam, 0, 0, () => {
      factory(t, { gate: true, ctrlA: 1, glow: [[2, 1, C.pnu, win(t, 74.4, 74.8, 77.0, 77.5)]] });
      // 고객 (공장 밖)
      const cua = win(t, 80.3, 80.9, 99.8, 100.3);
      if (cua > 0){ userIcon(CUST[0], CUST[1], 1.0, cua); text('고객', CUST[0], CUST[1] + 92, 26, C.sub, 'center', cua); }
      if (t < 80.8) stageDrop(t, cA);
      if (t > 80.2 && t < 96.9) stageRelay(t);
      if (t > 96.3) stageForward(t);
    }));
    // 말풍선·큰 판정 글자 (화면 좌표)
    const [ix, iy] = w2s(cam, INSP(2, 0)[0], INSP(2, 0)[1] - 30);
    bubble('옆 구역에서도 이런 요청서를 보낸 적 있나요?', 1400, 730, 34, a*win(t, 74.0, 74.35, 76.9, 77.3), ix + 10, iy + 10, C.pnu, 0.9 + 0.1*eo(P(t, 74.0, 74.4)));
    verdictWord('차단 (Drop)', 1400, 830, C.red, a*win(t, 78.7, 78.9, 80.1, 80.5), t - 78.7);
    verdictWord('교체 (Relay)', 1400, 830, C.orange, a*win(t, 89.95, 90.15, 91.8, 92.3), t - 89.95);
    verdictWord('통과 (Forward)', 1400, 830, C.green, a*win(t, 98.0, 98.2, 99.8, 100.3), t - 98.0);
  }
  if (partLightAndStage.light) tlight(...partLightAndStage.light);
}
function stageDrop(t, a){
  withAlpha(a, () => {
    const sus = eo(P(t, 70.7, 71.0)), rej = eo(P(t, 77.5, 77.8));
    const [wx, wy] = WK(2, 0);
    let [x, y] = polyAt([[wx + 40, wy - 10], [1130, 555], [1130, 620], CHK_D], eio(P(t, 69.7, 70.7)));
    const back = eio(P(t, 78.4, 79.4));
    if (back > 0){ x = CHK_D[0]; y = lerp(CHK_D[1], 545, back); }
    docSheet(x, y, 0.95, win(t, 69.5, 69.8, 79.6, 80.2), rej > 0 ? C.red : sus > 0 ? C.amber : C.pnu);
    qmark(x - 52, y - 20, sus*(1 - rej), C.amber, 50);
    // 생산관리실에 묻기 → 답
    flowLine(INSP(2, 0)[0] - 10, INSP(2, 0)[1] - 45, CTRL.x + CTRL.w - 40, CTRL.y + CTRL.h, t, rej > 0 ? C.red : C.pnu, 0.85*win(t, 71.8, 72.3, 79.5, 80.2), 4);
    // 옆 구역(아래 줄 차체 구역)이 보낸 기록
    const ra = win(t, 74.4, 74.9, 79.6, 80.2);
    if (ra > 0) withAlpha(ra, () => {
      const px = 1185, py = 150, pw = 300, ph = 150;
      ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.14)'; ctx.shadowBlur = 16; rr(px, py, pw, ph, 14); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = C.pnu; ctx.stroke();
      text('옆 구역이 보낸 기록', px + pw/2, py + 28, 24, C.pnu, 'center');
      for (let k = 0; k < 3; k++) docSheet(px + 70 + k*80, py + 95, 0.8, 1, C.green);
      const mg = win(t, 75.2, 75.4, 76.8, 77.0);
      if (mg > 0) withAlpha(mg, () => {
        const mx = lerp(px + 60, px + 240, eio(P(t, 75.2, 76.8))), my = py + 92;
        ctx.lineWidth = 6; ctx.strokeStyle = C.navy; ctx.beginPath(); ctx.arc(mx, my, 30, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + 21, my + 21); ctx.lineTo(mx + 44, my + 44); ctx.lineWidth = 9; ctx.stroke();
      });
      const no = eo(P(t, 77.1, 77.35));
      if (no > 0){ withAlpha(no, () => { ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(px + 2, py + 48, pw - 4, ph - 50); }); verdictMark('drop', px + pw/2, py + 95, 1.1*pop(t, 77.1), no); }
    });
    if (rej > 0) verdictMark('drop', CHK_D[0] - 70, CHK_D[1] - 10, 0.8*pop(t, 77.5), rej*win(t, 77.4, 77.5, 79.8, 80.3));
  });
}
function speckPart(x, y, s, a, col, speck){
  partBox(x, y, s, a, col);
  if (speck > 0) withAlpha(a*speck, () => { ctx.beginPath(); ctx.arc(x + 10*s, y + 6*s, 7*s, 0, Math.PI*2); ctx.fillStyle = C.red; ctx.fill(); });
}
function stageRelay(t){
  const sus = eo(P(t, 81.7, 82.0));
  const [wx, wy] = WK(0, 0), [rx, ry] = WK(0, 1);
  // 의심받은 부품 (몰래 넣은 이물질)
  const pa = win(t, 80.6, 80.9, 88.4, 89.4);
  let p1 = polyAt([[wx + 40, wy - 10], [370, 555], [370, 620], CHK_R], eio(P(t, 80.7, 81.6)));
  const toA = eio(P(t, 84.4, 85.2)); if (toA > 0) p1 = [lerp(CHK_R[0], SLOT_A[0], toA), lerp(CHK_R[1], SLOT_A[1], toA)];
  const out = eo(P(t, 88.1, 88.6));
  speckPart(p1[0], p1[1] - 28*out, 0.9, pa*(1 - 0.5*out), sus > 0 ? C.orange : C.amber, 1);
  qmark(p1[0] - 50, p1[1] - 20, sus*(1 - toA), C.orange, 50);
  if (out > 0) verdictMark('drop', p1[0] + 26, p1[1] - 50, 0.45, pa*out);
  // 같은 작업을 옆 구역(레플리카)에 요청
  const ra = win(t, 82.5, 82.7, 83.7, 83.9);
  if (ra > 0){ const q = polyAt([CHK_R, [370, 700], [370, 775], [rx + 40, ry - 10]], eio(P(t, 82.6, 83.7))); docSheet(q[0], q[1], 0.8, ra, C.pnu); }
  // 옆 구역이 만든 부품
  const ba = win(t, 83.8, 84.1, 96.2, 96.7);
  let p2 = polyAt([[rx + 40, ry - 10], [370, 775], [370, 700], [420, 676], SLOT_B], eio(P(t, 83.9, 85.2)));
  const go = eio(P(t, 88.1, 89.4)); if (go > 0) p2 = polyAt([SLOT_B, [470, 676], [140, 676], [CUST[0] + 40, CUST[1] + 20]], go);
  speckPart(p2[0], p2[1], 0.9, ba, C.amber, 0);
  // 비교
  const cmp = win(t, 85.2, 85.6, 88.0, 88.4);
  if (cmp > 0) withAlpha(cmp, () => { rr(SLOT_A[0] - 45, SLOT_A[1] - 40, SLOT_B[0] - SLOT_A[0] + 90, 80, 14); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill(); ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.stroke(); ctx.setLineDash([]); });
  if (cmp > 0){ speckPart(SLOT_A[0], SLOT_A[1], 0.9, cmp*pa, C.orange, 1); speckPart(SLOT_B[0], SLOT_B[1], 0.9, cmp*(go > 0 ? 0 : 1), C.amber, 0); }
  const ne = win(t, 86.2, 86.4, 88.0, 88.4);
  punch('≠', (SLOT_A[0] + SLOT_B[0])/2, SLOT_A[1] - 2, 54, C.orange, ne, t - 86.2);
  if (ne > 0) withAlpha(ne, () => { ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(SLOT_A[0] + 9, SLOT_A[1] + 5, 14 + 3*Math.sin(t*8), 0, Math.PI*2); ctx.stroke(); });
  // 옆 구역 부품이 고객에게
  flowLine(SLOT_B[0], 676, CUST[0] + 40, 676, t, C.orange, 0.8*win(t, 88.0, 88.3, 91.5, 92.2));
  const ok = eo(P(t, 93.3, 93.6));
  if (ok > 0) verdictMark('forward', CUST[0] + 50, CUST[1] - 70, 0.7*pop(t, 93.3), ok*win(t, 93.2, 93.3, 96.3, 96.8));
  // 생산은 계속
  flowLine(370, 660, CUST[0] + 40, 660, t, C.green, 0.7*win(t, 94.8, 95.2, 96.3, 96.8));
}
function stageForward(t){
  const fa = win(t, 96.6, 96.9, 99.8, 100.3);
  const [wx, wy] = WK(0, 0);
  const pts = [[wx + 40, wy - 10], [370, 555], [370, 620], CHK_R, [300, 676], [140, 676], [CUST[0] + 40, CUST[1] + 20]];
  const uc = polyLen(pts.slice(0, 4))/polyLen(pts);
  const u = t < 97.5 ? uc*eio(P(t, 96.7, 97.5)) : uc + (1 - uc)*eio(P(t, 97.9, 98.9));
  const [x, y] = polyAt(pts, u);
  partBox(x, y, 0.9, fa*(1 - eo(P(t, 98.9, 99.2))), t > 97.8 ? C.green : C.amber);
  const ok = eo(P(t, 97.75, 97.95));
  verdictMark('forward', CHK_R[0] - 70, CHK_R[1] - 10, 0.8*pop(t, 97.75), fa*ok);
  flowLine(370, 660, CUST[0] + 40, 660, t, C.green, 0.8*fa*ok);
}

// ─────────────── Q2. 질문자 (99.9~103.4) ───────────────
function partQ2(t){ asker(t, 100.0, 102.8); }

// ─────────────── I. 들어오는 것은 보낸 쪽 출구에서 이미 검사됨 (103.4~119.3) ───────────────
const ICAM = [[103.4, 960, 525, 0.8], [106.9, 960, 525, 0.8], [107.9, 960, 560, 1.42], [116.5, 960, 560, 1.42], [117.5, 960, 525, 0.8], [119.3, 960, 525, 0.81]];
function partInbound(t){
  const a = win(t, 103.4, 103.9, 130, 131); if (a <= 0) return;
  const bribe = eo(P(t, 111.9, 112.6));
  const r1 = 1 - 0.7*win(t, 107.0, 107.8, 116.5, 117.4);
  const cam = camAt(t, ICAM);
  withAlpha(a, () => withCam(cam, 0, 0, () => {
    factory(t, { row1A: r1, k: (i, r) => i === 3 && r === 0 ? bribe : 0,
                 amb: win(t, 103.4, 103.9, 106.6, 107.2) + 0.6*win(t, 117.2, 117.8, 130, 131) });
    // 모든 구역 출구에 검사원 (차례로 고리)
    for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){
      const t0 = 103.95 + (r*4 + i)*0.18, ring = win(t, t0, t0 + 0.3, 106.4, 107.0);
      if (ring > 0){ const [x, y] = INSP(i, r); withAlpha(ring, () => { ctx.beginPath(); ctx.arc(x, y - 6, 58, 0, Math.PI*2); ctx.fillStyle = 'rgba(0,166,81,0.14)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.pnuGreen; ctx.stroke(); }); }
    }
    // 차체 → 승인: 차체(post) 출구에서 검사된 요청서가 그대로 승인 담당(auth)으로 들어간다
    const [wx3, wy3] = WK(3, 0), [wx2, wy2] = WK(2, 0), [wx1, wy1] = WK(1, 0);
    const dpath = [[wx2 + 40, wy2 - 10], [1130, 555], [1130, 620], [1130, 650], [750, 650], [750, 620], [750, 555], [wx1 + 40, wy1 - 10]];
    const ud = polyLen(dpath.slice(0, 3))/polyLen(dpath);
    const du = t < 108.3 ? ud*eio(P(t, 107.3, 108.0)) : ud + (1 - ud)*eio(P(t, 108.35, 109.8));
    const dA = win(t, 107.2, 107.4, 109.8, 110.2);
    if (dA > 0){
      const [x, y] = polyAt(dpath, du);
      scanFx(x, y, dA*win(t, 107.85, 108.0, 108.3, 108.45), t);
      docSheet(x, y, 0.9, dA, t > 108.2 ? C.green : C.pnu);
    }
    verdictMark('forward', 1230, 520, 0.7*pop(t, 108.15), eo(P(t, 108.15, 108.35))*win(t, 108.1, 108.2, 111.6, 112.1));
    arrow(1100, 666, 780, 666, C.green, 0.9*eo(P(t, 108.4, 109.0))*win(t, 108.3, 108.4, 111.6, 112.1), 5, eo(P(t, 108.4, 109.3)));
    pill('이미 검사됨', 750, 720, 26, C.green, win(t, 109.9, 110.2, 111.6, 112.1));
    // 매수된 도장 작업자가 내보내려는 요청서 → 출구에서 막힘
    if (bribe > 0) pill('매수', wx3 + 45, wy3 - 80, 24, C.red, bribe*win(t, 111.9, 112.2, 116.5, 117.2), bribe);
    const ra = win(t, 112.8, 113.1, 116.6, 117.2);
    if (ra > 0){
      let p = polyAt([[wx3 + 40, wy3 - 10], [1510, 555], [1510, 626]], eio(P(t, 113.0, 114.6)));
      const blk = eo(P(t, 115.2, 115.4));
      if (blk > 0) p = [1510, lerp(626, 575, eio(P(t, 115.3, 116.0)))];
      docSheet(p[0], p[1], 0.9, ra, C.red);
      verdictMark('drop', 1440, 610, 0.8*pop(t, 115.2), blk*ra);
    }
    // 나가는 문만 지키면 된다: 모든 출구가 초록으로
    const ex = eo(P(t, 116.9, 117.4));
    if (ex > 0) for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){
      const [x, y] = DOOR(i, r);
      ctx.save(); ctx.globalAlpha *= ex; ctx.shadowColor = C.green; ctx.shadowBlur = 24; rr(x - 36, y - 6, 72, 12, 6); ctx.fillStyle = C.green; ctx.fill(); ctx.restore();
    }
  }));
  // 차체가 보낸 요청서 = 승인 담당이 받는 요청서
  const ea = win(t, 109.0, 109.4, 111.5, 112.0);
  if (ea > 0) withAlpha(ea, () => {
    ctx.font = '700 46px KR'; const s1 = '차체가 보낸 요청서', s2 = '  =  ', s3 = '승인 담당이 받는 요청서';
    const w1 = ctx.measureText(s1).width, w2 = ctx.measureText(s2).width, w3 = ctx.measureText(s3).width, x0 = 960 - (w1 + w2 + w3)/2;
    rr(x0 - 30, 780, w1 + w2 + w3 + 60, 84, 20); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillStyle = C.pnu; ctx.fillText(s1, x0, 822); ctx.fillStyle = C.gold; ctx.fillText(s2, x0 + w1, 822); ctx.fillStyle = C.pnu; ctx.fillText(s3, x0 + w1 + w2, 822);
  });
  verdictWord('나가는 것만', 960, 102, C.green, eo(P(t, 117.0, 117.3)), t - 117.0);
}

function draw(t){
  background();
  partScan(t);
  partQ1(t);
  partDetect(t);
  partKD(t);
  partHalt(t);
  partLightAndStage(t);
  partQ2(t);
  partInbound(t);
  guard(1);
  drawSubs(t, SUBS);
}
