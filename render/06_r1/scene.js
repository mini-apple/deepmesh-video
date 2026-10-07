// 시나리오 2 r1 설명 — TTS_06_시연 68.07~81.57s (06-5 박스만). 비유 없이 실제 용어로.
// 문장 경계 (silencedetect 실측, 원본 시각 → 이 단위 시각 = 원본 − 68.07)
// S1a 두 번째 공격은 공격자가, 68.27-69.87 → 0.20-1.80
// S1b 프론트엔드가 사용자에게 내보내는 첫 화면에 70.15-72.78 → 2.08-4.71
// S1c ...한 줄을...크로스사이트스크립트 공격입니다 73.09-77.30 → 5.02-9.23 (쉼 없음: '크로스...' ≈7.12)
// S2  화면을 연 사용자의 브라우저에서 실행되는... 77.70-81.35 → 9.63-13.28 (쉼 없음: '실행되는' ≈11.46)
// 앞 박스(06-4) 끝 66.89, 다음 박스(06-6) 시작 82.46 → 겹치지 않음
// 결과(relay)는 뒤따르는 실제 녹화가 보여주므로 여기서는 설명까지만.
const ASSETS = [
  ['pod', '../../assets/kubernetes community main icons-svg/resources/unlabeled/pod.svg'],
];
const SUBS = [
  [0.20, 1.80, '두 번째 공격은 공격자가,', 'norm'],
  [2.08, 4.71, 'frontend가 사용자에게 내보내는 첫 화면에', 'norm'],
  [5.02, 7.12, '악성 스크립트 한 줄을 몰래 끼워 넣는', 'norm'],
  [7.12, 9.23, '크로스 사이트 스크립트 공격입니다.', 'norm'],
  [9.63, 11.46, '화면을 연 사용자의 브라우저에서', 'norm'],
  [11.46, 13.28, '실행되는 악성 스크립트입니다.', 'norm'],
];

// ── 배치 (월드 좌표) ──
const POD = { x: 110, y: 300, w: 360, h: 300 };
const HK = [290, 500];
const CARD = { cx: 950, cy: 440, w: 700 };
const BR = { x: 1400, y: 250, w: 460, h: 400 };        // 사용자 브라우저 창
const LH = 40;                                          // 코드 줄 간격
// index.html 코드 조각 (붉게 강조되는 넷째 줄이 몰래 끼워 넣어진 한 줄)
const LINES = [
  ['<!doctype html>', C.sub],
  ['<html>', C.sub],
  ['  <body>', C.sub],
  ['  <!-- 몰래 끼워 넣어진 한 줄 -->', C.red],
  ['  <script src="…"></' + 'script>', C.red],
  ['  <h1>게시판</h1>', C.sub],
  ['  </body>', C.sub],
  ['</html>', C.sub],
];

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
function mono(s, x, y, sz, col, a=1){
  withAlpha(a, () => { ctx.font = `600 ${sz}px Consolas, monospace`; ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); });
}

// 코드 카드 (frontend 가 내보내는 첫 화면 index.html)
function codeCard(t){
  const a = eo(P(t, 1.9, 2.6));
  if (a <= 0) return;
  const w = CARD.w, lh = LH, pad = 34;
  const h = pad*2 + 60 + LINES.length*lh;
  const x = CARD.cx - w/2, y = CARD.cy - h/2;
  withAlpha(a, () => {
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.18)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12;
    rr(x, y, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.edge; ctx.stroke();
    // 창 헤더
    rr(x, y, w, 52, 16); ctx.fillStyle = C.panel; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y + 40, w, 12);
    for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(x + 26 + i*22, y + 26, 6, 0, Math.PI*2); ctx.fillStyle = C.dim; ctx.fill(); }
    text('index.html', CARD.cx, y + 26, 24, C.sub, 'center', 1, 700);
    // 코드 줄
    const inj = 3, injLine = 4;                          // 강조되는 두 줄(주석+스크립트)
    LINES.forEach(([s, col], i) => {
      const ly = y + 78 + i*lh;
      const isInj = i === inj || i === injLine;
      const reveal = isInj ? eo(P(t, 5.0, 6.0)) : a;      // 끼워 넣어지는 줄은 나중에 나타남
      if (reveal <= 0) return;
      if (isInj){
        const hl = win(t, 5.0, 5.5, 12.6, 13.3);
        withAlpha(hl, () => { rr(x + 16, ly - lh/2, w - 32, lh, 6); ctx.fillStyle = 'rgba(220,38,38,0.10)'; ctx.fill(); });
      }
      mono(String(i + 1).padStart(2, ' '), x + 24, ly, 26, C.dim, reveal*0.7);
      mono(s, x + 72, ly, 26, col, reveal);
    });
    // "한 줄" 화살표 + 라벨 — 사용자 브라우저가 등장(9.5s)할 때 fade out
    const pt = win(t, 5.6, 6.1, 9.4, 10.3);
    if (pt > 0){
      const ay = y + 78 + injLine*lh;
      withAlpha(pt, () => {
        ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.beginPath();
        ctx.moveTo(x + w + 8, ay); ctx.lineTo(x + w - 6, ay); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + w - 6, ay); ctx.lineTo(x + w + 4, ay - 7); ctx.lineTo(x + w + 4, ay + 7); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill();
      });
      punch('악성 스크립트 한 줄', x + w + 40, ay, 30, C.red, pt, t - 5.6);
    }
  });
}

function scene(t){
  // frontend pod (왼쪽)
  const pa = eo(P(t, 0.0, 0.7));
  withAlpha(pa, () => {
    box(POD.x, POD.y, POD.w, POD.h, 0);
    imgFit('pod', POD.x + 48, POD.y + 48, 56);
    text('frontend pod', POD.x + 88, POD.y + 48, 32, C.text, 'left');
    hacker(HK[0], HK[1], 0.95, eo(P(t, 0.4, 1.0)));
    pill('공격자', HK[0] + 130, HK[1] - 40, 24, C.red, eo(P(t, 0.6, 1.1)), 0.5);
  });

  codeCard(t);

  // frontend → 코드카드 로 나가는 첫 화면 (평소 흐름)
  const f1 = eo(P(t, 2.2, 2.8));
  flowLine(POD.x + POD.w, POD.y + POD.h/2, CARD.cx - CARD.w/2 - 8, CARD.cy, t, C.green, f1*(1 - 0.5*eo(P(t, 5.0, 5.6))), 4);

  // 사용자 브라우저 (오른쪽) — 그 첫 화면이 전달되어 열린다
  const ba = eo(P(t, 9.5, 10.2));
  if (ba > 0) withAlpha(ba, () => {
    const dx = 40*(1 - ba);
    ctx.translate(dx, 0);
    box(BR.x, BR.y, BR.w, BR.h, 0, '#fff');
    rr(BR.x, BR.y, BR.w, 50, 18); ctx.fillStyle = C.panel; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(BR.x, BR.y + 38, BR.w, 12);
    for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(BR.x + 24 + i*20, BR.y + 25, 5, 0, Math.PI*2); ctx.fillStyle = C.dim; ctx.fill(); }
    rr(BR.x + 84, BR.y + 13, BR.w - 108, 24, 12); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = C.edge; ctx.stroke();
    text('사용자 브라우저', BR.x + BR.w/2, BR.y - 34, 28, C.sub, 'center');
    // 페이지 본문
    text('게시판', BR.x + 40, BR.y + 110, 40, C.text, 'left');
    rr(BR.x + 40, BR.y + 150, BR.w - 80, 16, 6); ctx.fillStyle = C.grid; ctx.fill();
    rr(BR.x + 40, BR.y + 180, BR.w - 140, 16, 6); ctx.fillStyle = C.grid; ctx.fill();
    // 스크립트가 실행되는 순간 (빨간 경보)
    const run = eo(P(t, 11.4, 12.1));
    if (run > 0){
      const pulse = 0.6 + 0.4*Math.sin(t*8);
      ctx.save(); ctx.globalAlpha *= run;
      rr(BR.x + 6, BR.y + 56, BR.w - 12, BR.h - 62, 12);
      ctx.strokeStyle = C.red; ctx.lineWidth = 4 + 3*pulse; ctx.stroke();
      const g = ctx.createRadialGradient(BR.x + BR.w/2, BR.y + BR.h*0.62, 20, BR.x + BR.w/2, BR.y + BR.h*0.62, 240);
      g.addColorStop(0, `rgba(220,38,38,${0.28*pulse})`); g.addColorStop(1, 'rgba(220,38,38,0)');
      ctx.fillStyle = g; ctx.fillRect(BR.x, BR.y + 52, BR.w, BR.h - 56);
      ctx.restore();
      punch('스크립트 실행', BR.x + BR.w/2, BR.y + BR.h*0.62, 34, C.red, run, t - 11.4);
    }
  });

  // 코드카드 → 사용자 브라우저 (변조된 첫 화면이 전달됨)
  const f2 = eo(P(t, 9.8, 10.5));
  flowLine(CARD.cx + CARD.w/2 + 8, CARD.cy, BR.x - 8, BR.y + BR.h/2, t, C.red, f2, 4);
}

function draw(t){
  background(true);
  const c = camAt(t, [[0, 620, 460, 0.95], [2.0, 900, 450, 0.98], [5.0, 950, 440, 1.12], [7.5, 960, 440, 1.14],
                      [9.4, 980, 470, 1.0], [10.5, 1120, 480, 1.02], [12.0, 1180, 500, 1.08], [13.3, 1190, 500, 1.1]]);
  withCam(c, 0, 0, () => scene(t));
  chip('시나리오 2', t);
  guard(1);
  drawSubs(t, SUBS);
}
