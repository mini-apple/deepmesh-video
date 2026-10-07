// ② 왜 필요한가 — TTS_02 0.0~42.35s
// 문장 경계 (silencedetect 실측)
// S1 먼저, 요즘 해킹이…보겠습니다 0.19-3.12
// S2 2025년 11월 3.68-4.85 | 앤트로픽 보고서에 따르면 5.12-6.42 | 한 해킹 공격에서…80에서 90퍼센트를 6.78-9.66 | AI가 스스로 해냈습니다 9.93-11.21
// S3 침투는 물론 11.84-12.65 | 안으로 들어간 뒤 옆 시스템으로 번지는 것까지요 12.90-15.24
// S4 2026년에는…만 개 넘게 찾아냈습니다 15.96-22.36
// S5 공격하는 쪽도 같은 속도로 찾을 수 있으니 23.03-25.27 | 결국 언젠가는 뚫린다고 봐야 합니다 25.58-27.57
// S6 게다가 뚫린 뒤…너무 빠릅니다 28.32-33.38
// S7 그래서 저희는 질문을 바꿨습니다 34.14-36.01
// S8 어떻게 안 뚫리게 할까가 아니라 36.45-38.18 | 뚫린 다음…막을 수 있을지로요 38.50-42.11
const ASSETS = [
  ['c1', '../../capture/C1_head.png'],
  ['c2', '../../capture/C2_anthropic_8090_crop.png'],
  ['c4', '../../capture/C4_glasswing_10000_crop.png'],
  ['pod', '../../assets/kubernetes community main icons-svg/resources/unlabeled/pod.svg'],
];
// 형광펜 위치 (원본 픽셀. c2/c4 는 capture/_highlights.json 값, 나머지는 화면 확인값)
const HL = {
  c1_date: [[852, 448, 994, 482]],
  c2_exploit: [[834.9, 324.4, 1016.4, 350.2]],
  c2_8090: [[217.9, 518.5, 901.9, 552.9]],
  c2_lateral: [[1035.2, 324.4, 1302.2, 350.2]],
  c4_month: [[0, 3, 197.0, 34.5]],
  c4_tenk: [[806.5, 42.5, 929.6, 74.0], [0, 82.0, 158.2, 113.5]],
};
// 'srt' = 화면엔 안 그리고 SRT 에만 (큰 글씨가 같은 문장을 보여줄 때)
const SUBS = [
  [0.19, 3.12, '먼저, 요즘 해킹이 어떻게 달라졌는지부터 보겠습니다.', 'norm'],
  [3.68, 6.42, '2025년 11월, Anthropic 보고서에 따르면', 'norm'],
  [6.78, 9.66, '한 해킹 공격에서 전체 과정의 80에서 90퍼센트를', 'norm'],
  [9.93, 11.21, 'AI가 스스로 해냈습니다.', 'norm'],
  [11.84, 15.24, '침투는 물론, 안으로 들어간 뒤 옆 시스템으로 번지는 것까지요.', 'norm'],
  [15.96, 19.50, '2026년에는 약 50개 기관이 AI로 한 달 남짓 만에', 'norm'],
  [19.50, 22.36, '심각한 취약점을 만 개 넘게 찾아냈습니다.', 'norm'],
  [23.03, 25.27, '공격하는 쪽도 같은 속도로 찾을 수 있으니,', 'norm'],
  [25.58, 27.57, '결국 언젠가는 뚫린다고 봐야 합니다.', 'norm'],
  [28.32, 31.15, '게다가 뚫린 뒤 공격이 안에서 번지는 속도는,', 'norm'],
  [31.15, 33.38, '사람이 보고 대응하기엔 너무 빠릅니다.', 'norm'],
  [34.14, 36.01, '그래서 저희는 질문을 바꿨습니다.', 'norm'],
  [36.45, 38.18, '어떻게 안 뚫리게 할까가 아니라,', 'srt'],
  [38.50, 42.11, '뚫린 다음 안에서 번지는 걸 어떻게 자동으로 막을 수 있을지로요.', 'srt'],
];

const CY = 470;   // 자막 위 화면 중심
// camAt / withCam / punch 는 common.js
function podBox(x, y, k, s=1){
  ctx.save();
  if (k > 0){ ctx.shadowColor = C.red; ctx.shadowBlur = 26*k; }
  rr(x-80*s, y-55*s, 160*s, 110*s, 14); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
  if (k > 0){ ctx.fillStyle = `rgba(220,38,38,${0.13*k})`; ctx.fill(); }
  ctx.lineWidth = 3; ctx.strokeStyle = k > 0.5 ? C.red : C.edge; ctx.stroke(); ctx.restore();
  imgFit('pod', x, y, 64*s);
}

// ── A. Anthropic 발표 (0~6.9) ──
function partA(t){
  const a = win(t, 0.15, 0.7, 6.3, 6.9); if (a <= 0) return;
  const c = camAt(t, [[0, 960, 470, 0.94], [6.4, 960, 470, 1.06]]);
  const dy = -260*eio(P(t, 6.3, 6.9));
  withCam(c, 0, dy, () => {
    capCard('c1', [120, 140, 1600, 345], 210, 309, 1500, a, [{ rects: HL.c1_date, prog: P(t, 3.7, 4.5) }], 'Anthropic');
  });
}

// ── B. 보고서 본문: 80~90%, lateral movement (6.5~15.9) ──
const C2X = 180, C2Y = 283, C2S = 1560/1440;
const c2p = (sx, sy) => [C2X + (sx-190)*C2S, C2Y + (sy-225)*C2S];
function partB(t){
  const a = win(t, 6.5, 7.0, 15.3, 15.9); if (a <= 0) return;
  const f8090 = c2p(560, 535), fExp = c2p(1070, 337);
  f8090[1] -= 110; fExp[1] += 25;   // 강조 줄이 문단 전체와 함께 자막 위에 보이도록
  const c = camAt(t, [[6.5, 960, 470, 0.96], [7.6, 960, 470, 1.0], [8.4, f8090[0], f8090[1], 1.45], [11.4, f8090[0]+30, f8090[1], 1.5],
                      [12.3, fExp[0], fExp[1], 1.55], [15.3, fExp[0]+40, fExp[1], 1.62]]);
  const dy = 240*(1 - eio(P(t, 6.5, 7.1))), dx = -700*eio(P(t, 15.3, 15.9));
  withCam(c, dx, dy, () => {
    capCard('c2', [190, 225, 1440, 345], C2X, C2Y, 1560, a, [
      { rects: HL.c2_8090, prog: P(t, 8.3, 9.5) },
      { rects: HL.c2_exploit, prog: P(t, 11.9, 12.5) },
      { rects: HL.c2_lateral, prog: P(t, 12.9, 13.8), color: 'rgba(252,165,165,0.95)' },
    ], 'Anthropic 보고서 (2025.11)');
  });
  // AI가 스스로 해냈습니다 → 숫자 한 방
  const s = win(t, 9.9, 10.15, 11.35, 11.7);
  if (s > 0){
    ctx.fillStyle = `rgba(255,255,255,${0.94*s})`; ctx.fillRect(0, 0, W, H);
    punch('80~90%', 960, 420, 250, C.gold, s, t - 9.9);
    text('AI가 스스로 수행', 960, 610, 54, C.text, 'center', win(t, 10.1, 10.35, 11.35, 11.7));
  }
}

// ── C. Project Glasswing: 만 개 넘는 취약점 (15.6~23.2) ──
function partC(t){
  const a = win(t, 15.6, 16.2, 22.6, 23.2); if (a <= 0) return;
  const dx = 800*(1 - eio(P(t, 15.6, 16.3))), dy = -300*eio(P(t, 22.6, 23.2));
  const c = camAt(t, [[15.6, 960, 470, 1.0], [19.4, 960, 470, 1.0], [20.4, 1010, 430, 1.07], [22.6, 1020, 430, 1.09]]);
  withCam(c, dx, dy, () => {
    capCard('c4', null, 310, 170, 1300, a, [
      { rects: HL.c4_month, prog: P(t, 18.3, 19.1) },
      { rects: HL.c4_tenk, prog: P(t, 19.7, 20.9) },
    ], 'Anthropic, Project Glasswing (2026.05)');
  });
  const n = Math.round(10000 * eo(P(t, 19.7, 20.9)));
  const na = win(t, 19.6, 19.9, 22.6, 23.0);
  punch(n.toLocaleString('en-US') + (n >= 10000 ? '+' : ''), 960, 690 + dy, 170, C.gold, na, t - 20.9);
  text('심각한 취약점', 960, 835 + dy, 42, C.sub, 'center', na);
}

// ── D. 같은 속도 → 결국 뚫린다 (23.0~28.1) ──
const LANE = [[380, '지키는 쪽', C.pnu], [580, '공격하는 쪽', C.red]], BX0 = 560, WALLX = 1560;
function partD(t){
  const a = win(t, 23.0, 23.5, 27.6, 28.1); if (a <= 0) return;
  const hit = P(t, 25.65, 26.2), sh = win(t, 25.9, 26.0, 26.3, 26.7) * 9;
  withAlpha(a, () => {
    ctx.translate(Math.sin(t*70)*sh, Math.cos(t*55)*sh*0.5);
    person(250, 345, 0.85, 1); hacker(250, 548, 0.85, 1);
    const p = eio(P(t, 23.2, 25.1));
    for (const [y, lab, col] of LANE){
      text(lab, 340, y, 36, col, 'left');
      rr(BX0, y-20, WALLX-40-BX0, 40, 20); ctx.fillStyle = C.panel; ctx.fill();
      const extra = col === C.red ? eio(hit) * 300 : 0;
      const wdt = (WALLX-40-BX0)*p + extra;
      if (wdt > 0){ rr(BX0, y-20, wdt, 40, 20); ctx.fillStyle = col; ctx.fill(); }
    }
    // 방어선 (파란 벽) — 공격 막대가 뚫고 나간다
    const wa = eo(P(t, 23.4, 23.9));
    ctx.save(); ctx.globalAlpha *= wa;
    rr(WALLX-20, 300, 40, 360, 10); ctx.fillStyle = C.pnu; ctx.fill();
    if (hit > 0){
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
      const cr = [[0,470],[14,510],[-10,545],[12,580],[-6,620],[10,660]];
      ctx.beginPath(); ctx.moveTo(WALLX + cr[0][0], cr[0][1]);
      const m = Math.max(1, Math.round(cr.length*hit));
      for (let i = 1; i < m; i++) ctx.lineTo(WALLX + cr[i][0], cr[i][1]); ctx.stroke();
      const fl = win(t, 25.7, 25.8, 26.1, 26.8);
      const g = ctx.createRadialGradient(WALLX, 580, 10, WALLX, 580, 260);
      g.addColorStop(0, `rgba(220,38,38,${0.45*fl})`); g.addColorStop(1, 'rgba(220,38,38,0)');
      ctx.fillStyle = g; ctx.fillRect(WALLX-300, 300, 600, 560);
    }
    ctx.restore();
  });
}

// ── E. 번지는 속도 vs 사람 (28.1~34.0) ──
const GRID = []; for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) GRID.push([300 + q*250, 360 + r*200]);
const ORDER = [0, 1, 5, 4, 2, 6, 3, 7];      // 번지는 순서
function partE(t){
  const a = win(t, 28.1, 28.6, 33.6, 34.1); if (a <= 0) return;
  withAlpha(a, () => {
    const inf = i => eo(P(t, 28.7 + ORDER.indexOf(i)*0.17, 28.95 + ORDER.indexOf(i)*0.17));
    // 번지는 선
    ctx.strokeStyle = C.red; ctx.lineWidth = 5;
    for (let j = 1; j < ORDER.length; j++){
      const [x1,y1] = GRID[ORDER[j-1]], [x2,y2] = GRID[ORDER[j]], u = eio(P(t, 28.7 + (j-1)*0.17 + 0.05, 28.7 + j*0.17 + 0.05));
      if (u > 0){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(...along(x1,y1,x2,y2,u)); ctx.stroke(); }
    }
    GRID.forEach(([x,y], i) => podBox(x, y, inf(i)));
    // 사람: 알아채고 대응하기까지 한참 걸린다
    const px = 1560, py = 470;
    person(px, py - 20, 0.9, 1);
    const ring = eo(P(t, 28.8, 33.3)) * 0.16;
    ctx.lineWidth = 12; ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.arc(px, py + 10, 150, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = C.sub; ctx.beginPath(); ctx.arc(px, py + 10, 150, -Math.PI/2, -Math.PI/2 + Math.PI*2*ring); ctx.stroke();
    // 물음표 (무슨 일이지?)
    const qa = win(t, 30.0, 30.4, 33.6, 34.0);
    text('?', px + 105, py - 175 + Math.sin(t*3)*4, 64, C.sub, 'center', qa);
  });
}

// ── F. 질문을 바꾸다 (34.0~) ──
function partF(t){
  // 물음표가 두 질문으로 갈라진다
  const qa = win(t, 34.2, 34.7, 36.1, 36.5);
  if (qa > 0){
    withAlpha(qa, () => {
      const sc = 1 + 0.05*Math.sin(t*2.4);
      ctx.translate(960, 460); ctx.scale(sc, sc);
      ctx.beginPath(); ctx.arc(0, 0, 170, 0, Math.PI*2); ctx.fillStyle = '#EAF1FA'; ctx.fill();
    });
    punch('?', 960, 455, 230, C.pnu, qa, t - 34.2);
  }
  const q1 = eo(P(t, 36.4, 36.9));
  text('어떻게 안 뚫리게 할까?', 960, 300, 60, C.dim, 'center', q1);
  const st = eio(P(t, 37.5, 38.2));
  if (st > 0 && q1 > 0){ font(60); const m = ctx.measureText('어떻게 안 뚫리게 할까?').width;
    ctx.fillStyle = C.red; ctx.fillRect(960 - m/2 - 12, 298, (m + 24)*st, 7); }
  const q2 = eo(P(t, 38.5, 39.2)), rise = 30*(1 - q2);
  text('뚫린 다음, 안에서 번지는 걸', 960, 520 + rise, 76, C.pnu, 'center', q2);
  text('어떻게 자동으로 막을 수 있을까?', 960, 625 + rise, 76, C.pnu, 'center', q2);
  const ul = eio(P(t, 40.4, 41.5));
  if (ul > 0){ font(76); const m = ctx.measureText('어떻게 자동으로 막을 수 있을까?').width;
    ctx.fillStyle = C.pnuGreen; ctx.fillRect(960 - m/2, 682, m*ul, 10); }
}

function draw(t){
  background();
  partA(t); partB(t); partC(t); partD(t); partE(t); partF(t);
  guard(1);
  drawSubs(t, SUBS);
}
