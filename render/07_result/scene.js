// ⑦ 결과 — TTS_07_결과.WAV 전체 (0~43.47s, 정상 속도 재녹음). 숫자는 REPORT_FACTS 기준만.  (v3)
// 문장 경계 (silencedetect 실측, noise=-33dB:d=0.28)
// S1 이제 성능을 숫자로 정리해 보겠습니다 0.05-2.39
// S2 저희는 쿠버네티스 클러스터를 직접 구성하고, / 정상, 공격 트래픽을…모델을 학습했습니다  2.90-10.98 (내부 쉼 5.85-6.25)
// S3 정상 트래픽만으로 학습한 이 모델은 / 측면이동 공격을 각각 재현율 86.7~100퍼센트로 탐지  11.59-19.85 (내부 쉼 13.75-14.10)
// S4 정상을 공격으로 잘못 본 오탐 비율은 20.50-22.83 / 1.3퍼센트 이하였습니다 23.11-24.93 (호흡 22.83-23.11)
// S5 그리고 지식증류를 이용해, 25.44-27.08 / 모델의 파라미터 크기를 31만 개에서…경량화했습니다 27.34-33.05 (호흡 27.08-27.34)
// S6 덕분에 GPU 없이 CPU만으로도 / 모델 판정에 약 1ms 안팎이 걸렸습니다. 33.87-39.29
// S7 이제 처음의 그 장면으로 다시 돌아가 보겠습니다 40.29-43.47 → 되감기, 흰 화면 (⑧로)
const ASSETS = [];

// REPORT_FACTS §3: 배포 모델 재현율 / FPR / 파라미터(K) / CPU 지연(ms)
const SVC = [
  { nm: 'auth',     recall: 86.67,  fpr: 0.32, param: 12.64, lat: 0.3831 },
  { nm: 'post',     recall: 96.29,  fpr: 0.00, param: 1.23,  lat: 0.3615 },
  { nm: 'comment',  recall: 95.54,  fpr: 1.30, param: 5.69,  lat: 1.1294 },
  { nm: 'frontend', recall: 100.00, fpr: 0.93, param: 5.69,  lat: 0.8049 },
];

// silencedetect 실측(−30/−34/−38dB 교차 확정). 자막 1줄 = 무음으로 구분된 발화 세그먼트 1개.
// 인위 분할(무음 없음)이던 9.56·16.12·21.88·30.46은 합쳤고, 실측 내부 호흡(17.99·27.08·36.13)에서만 분할.
const SUBS = [
  [0.05, 2.39, '이제 성능을 숫자로 정리해 보겠습니다.', 'norm'],
  [2.90, 5.85, '저희는 쿠버네티스 클러스터를 직접 구성하고,', 'norm'],
  [6.25, 10.98, '정상, 공격 트래픽을 자체 게시판 환경에서 수집해 모델을 학습했습니다.', 'norm'],
  [11.59, 13.75, '정상 트래픽만으로 학습한 이 모델은', 'norm'],
  [14.10, 17.99, '측면이동 공격을 각각 재현율 86.7퍼센트에서', 'norm'],
  [18.24, 19.85, '100퍼센트로 탐지했습니다.', 'norm'],
  [20.50, 22.83, '정상을 공격으로 잘못 본 오탐 비율은', 'norm'],
  [23.11, 24.93, '1.3퍼센트 이하였습니다.', 'norm'],
  [25.44, 27.15, '그리고 지식증류를 이용해,', 'norm'],
  [27.34, 33.05, '모델의 파라미터 크기를 31만 개에서 약 천에서 만 개의 파라미터 크기로 경량화했습니다.', 'norm'],
  [33.87, 36.13, '덕분에 GPU 없이 CPU만으로도', 'norm'],
  [36.30, 39.29, '모델 판정에 약 1ms 안팎이 걸렸습니다.', 'norm'],
  [40.29, 43.30, '이제 처음의 그 장면으로 다시 돌아가 보겠습니다.', 'norm'],
];

// ── 장면 전환: 이전 장면이 왼쪽으로 밀려나고 다음 장면이 오른쪽에서 들어온다 ──
// [들어오기 시작, 다 들어옴, 나가기 시작, 다 나감]
const SLOT = {
  A: [-1, 0, 2.4, 2.9],
  B: [2.4, 2.9, 10.9, 11.5],
  C: [10.9, 11.5, 19.9, 20.5],
  D: [19.9, 20.5, 24.6, 25.1],
  E: [24.6, 25.1, 33.1, 33.7],
  F: [33.1, 33.7, 39.4, 40.0],
};
function slide(t, key, fn){
  const [a0, a1, b0, b1] = SLOT[key];
  if (t < a0 || t > b1) return;
  const dx = W*(1 - eio(P(t, a0, a1))) - W*eio(P(t, b0, b1));
  ctx.save(); ctx.translate(dx, 0); fn(); ctx.restore();
}
function arrowR(x1, y, x2, col, w=5){
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2 - 16, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2 - 22, y - 13); ctx.lineTo(x2 - 22, y + 13); ctx.closePath(); ctx.fill();
}
// 세로 막대 4개 (자막 위 영역 중앙 정렬). o = {y0, hMax, bw, gp, max, col, t0, step, fmt, labSz}
function bars4(t, valOf, o){
  const tot = 4*o.bw + 3*o.gp, bx = 960 - tot/2;
  ctx.strokeStyle = C.edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(bx - 50, o.y0); ctx.lineTo(bx + tot + 50, o.y0); ctx.stroke();
  SVC.forEach((s, i) => {
    const x = bx + i*(o.bw + o.gp), tv = o.t0 + i*o.step;
    const gr = eo(P(t, tv, tv + 0.6)), h = (valOf(s)/o.max)*o.hMax*gr;
    if (h > 0){ rr(x, o.y0 - h, o.bw, h, [8, 8, 0, 0]); ctx.fillStyle = o.col; ctx.fill(); }
    text(s.nm, x + o.bw/2, o.y0 + 36, 32, C.sub, 'center', eo(P(t, tv - 0.2, tv + 0.2)));
    const pa = eo(P(t, tv + 0.4, tv + 0.75));
    if (pa > 0) punch(o.fmt(valOf(s)), x + o.bw/2, o.y0 - h - 40, o.labSz || 48, C.gold, pa, t - (tv + 0.4));
  });
  return bx;
}

// ── A. 도입: 성능을 숫자로 (0~2.9) ──
function partA(t){
  slide(t, 'A', () => {
    const a = eo(P(t, 0.0, 0.4));
    punch('성능을 숫자로', 960, 440, 150, C.pnu, a, t - 0.1);
    // 아래에 숫자 자리(막대 실루엣)가 차오르는 예고
    withAlpha(a*0.9, () => {
      for (let i = 0; i < 4; i++){
        const h = 30 + 50*eo(P(t, 0.5 + i*0.32, 1.5 + i*0.32))*(0.7 + 0.3*((i*37) % 10)/10);
        rr(810 + i*80, 640 - h, 56, h, [6, 6, 0, 0]); ctx.fillStyle = [C.pnuGreen, C.pnu, C.gold, C.pnu][i]; ctx.fill();
      }
      ctx.strokeStyle = C.edge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(780, 640); ctx.lineTo(1140, 640); ctx.stroke();
    });
  });
}

// ── B. 클러스터 구성 → 트래픽 수집 → 모델 학습 (2.9~11.0) ──
function partB(t){
  slide(t, 'B', () => {
    // 클러스터 경계
    const ca = eo(P(t, 3.3, 3.8));
    withAlpha(ca, () => {
      ctx.save(); ctx.setLineDash([14, 10]); ctx.lineWidth = 2.5; ctx.strokeStyle = C.dim;
      rr(250, 150, 1420, 330, 24); ctx.stroke(); ctx.restore();
      text('쿠버네티스 클러스터', 960, 190, 36, C.text, 'center');
    });
    const bw = 300, gap = 30, bx = 960 - (4*bw + 3*gap)/2, y = 240, bh = 190;
    SVC.forEach((s, i) => {
      const ba = eo(P(t, 3.8 + i*0.3, 4.2 + i*0.3)), x = bx + i*(bw + gap);
      withAlpha(ba, () => {
        ctx.translate(0, 26*(1 - ba));
        rr(x, y, bw, bh, 16); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
        text(s.nm, x + bw/2, y + bh/2, 44, C.text, 'center');
      });
    });
    // 트래픽 수집 (정상 초록, 공격 빨강) → 모델
    const MX = 960, MY = 700;
    const fa = eo(P(t, 6.3, 6.9));
    withAlpha(fa, () => {
      SVC.forEach((s, i) => {
        const x = bx + i*(bw + gap) + bw/2;
        flowLine(x - 30, y + bh + 6, MX - 60 + i*40, MY - 70, t, C.green, 1, 4);
        flowLine(x + 30, y + bh + 6, MX - 50 + i*40, MY - 70, t, C.red, 1, 4);
      });
      pill('정상 트래픽', 420, 560, 30, C.green, 1);
      pill('공격 트래픽', 1500, 560, 30, C.red, 1);
    });
    const ma = eo(P(t, 9.5, 10.0));
    withAlpha(ma, () => {
      const pulse = 1 + 0.03*Math.sin(t*6);
      ctx.translate(MX, MY + 50); ctx.scale(pulse, pulse);
      rr(-300, -70, 600, 140, 20); ctx.fillStyle = '#EAF1FA'; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = C.pnu; ctx.stroke();
      text('모델 학습', 0, 0, 60, C.pnu, 'center');
    });
  });
}

// ── C. 재현율 86.7~100% (10.9~20.5) ──
function partC(t){
  slide(t, 'C', () => {
    text('측면이동 공격 재현율 (Recall)', 960, 190, 40, C.text, 'center', 1 - eo(P(t, 18.2, 18.6)));
    bars4(t, s => s.recall, { y0: 800, hMax: 480, bw: 190, gp: 110, max: 100, col: C.pnuGreen, t0: 15.6, step: 0.6,
                              fmt: v => v.toFixed(v % 1 ? 1 : 0) });
    const ra = eo(P(t, 18.4, 18.9));
    if (ra > 0) punch('86.7 ~ 100 %', 960, 190, 72, C.pnuGreen, ra, t - 18.4);
  });
}

// ── D. 오탐률 1.3% 이하 (19.9~23.1) ──
function partD(t){
  slide(t, 'D', () => {
    text('정상을 공격으로 잘못 본 비율 (오탐률)', 960, 170, 40, C.text, 'center');
    const y0 = 810, hMax = 340, max = 1.5;
    const bx = bars4(t, s => s.fpr, { y0, hMax, bw: 170, gp: 110, max, col: '#6B7280', t0: 20.8, step: 0.3,
                                      fmt: v => v.toFixed(2), labSz: 42 });
    // 1.3% 기준선 — "1.3퍼센트 이하였습니다" 발화(23.11~24.93)에 맞춤
    const la = eo(P(t, 23.2, 23.7)), ly = y0 - (1.3/max)*hMax, tot = 4*170 + 3*110;
    withAlpha(la, () => {
      ctx.save(); ctx.strokeStyle = C.pnu; ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
      ctx.beginPath(); ctx.moveTo(bx - 50, ly); ctx.lineTo(bx - 50 + (tot + 100)*la, ly); ctx.stroke(); ctx.restore();
      text('1.3%', bx + tot + 64, ly, 30, C.pnu, 'left');
    });
    const na = eo(P(t, 23.2, 23.75));
    if (na > 0){
      punch('1.3% 이하', 960, 300, 130, C.pnu, na, t - 23.2);
    }
  });
}

// ── E. 파라미터 축소 314.69K → 1.2K~12.6K (22.6~33.7) ──
function partE(t){
  slide(t, 'E', () => {
    text('지식증류로 경량화', 960, 170, 40, C.text, 'center');
    // 원의 넓이가 파라미터 수에 비례: 선생님 모델 314.69K → 배포 학생 모델 (최대 12.64K)
    const shrink = eio(P(t, 30.0, 32.0));
    const cx = 620, cy = 500, R0 = 270, R1 = R0*Math.sqrt(12.64/314.69);
    const R = lerp(R0, R1, shrink);
    withAlpha(0.5*shrink, () => { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R0, 0, Math.PI*2);
      ctx.strokeStyle = C.dim; ctx.lineWidth = 3; ctx.setLineDash([10, 10]); ctx.stroke(); ctx.restore(); });
    const ga = eo(P(t, 25.6, 26.6));
    withAlpha(ga, () => {
      ctx.beginPath(); ctx.arc(cx, cy, R*(0.9 + 0.1*ga), 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,91,170,0.14)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.pnu; ctx.stroke();
    });
    const bigN = win(t, 28.2, 28.8, 30.6, 31.1);
    if (bigN > 0) punch('314.69K', cx, cy, 90, C.text, bigN, t - 28.2);
    text('선생님 모델', cx, cy + R0 + 44, 32, C.sub, 'center', ga*(1 - shrink));
    text('314.69K', cx, cy - R0 - 36, 34, C.dim, 'center', eo(P(t, 31.5, 32.0)));
    // 화살표 → 배포 학생 모델
    const ar = eo(P(t, 31.0, 31.6));
    withAlpha(ar, () => arrowR(900, cy, 900 + 220*ar, C.text));
    const nn = eo(P(t, 31.6, 32.2));
    if (nn > 0){
      punch('1.2K ~ 12.6K', 1450, cy - 20, 100, C.gold, nn, t - 31.6);
      text('배포 학생 모델 파라미터', 1450, cy + 70, 34, C.sub, 'center', nn);
    }
    const lw = eo(P(t, 32.2, 32.8));
    if (lw > 0) pill('경량화', 1450, cy + 170, 40, C.pnuGreen, lw, 0.6);
  });
}

// ── F. CPU 모델 판정 약 1ms (33.1~40.0) ──
function partF(t){
  slide(t, 'F', () => {
    const y0 = 800, hMax = 460, max = 1.5;
    // GPU 없이 CPU만으로
    const ga = win(t, 34.0, 34.5, 36.2, 36.7);
    if (ga > 0) withAlpha(ga, () => {
      chipIcon(700, 470, 'GPU', C.dim);
      const st = eo(P(t, 34.6, 35.1));
      ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(610, 380); ctx.lineTo(610 + 180*st, 380 + 180*st); ctx.stroke();
      chipIcon(1220, 470, 'CPU', C.pnu, eo(P(t, 35.3, 35.8)));
    });
    const ca = eo(P(t, 36.4, 36.8));
    if (ca <= 0) return;
    withAlpha(ca, () => {
      text('CPU 모델 판정 시간 (이미지 1장당)', 960, 170, 40, C.text, 'center', 1 - eo(P(t, 38.0, 38.4)));
      const tot = 4*190 + 3*110, bx = 960 - tot/2, y1 = y0 - (1.0/max)*hMax;
      withAlpha(eo(P(t, 36.5, 36.9)), () => {
        ctx.save(); ctx.strokeStyle = C.dim; ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
        ctx.beginPath(); ctx.moveTo(bx - 50, y1); ctx.lineTo(bx + tot + 50, y1); ctx.stroke(); ctx.restore();
        text('1 ms', bx + tot + 64, y1, 32, C.sub, 'left');
      });
      bars4(t, s => s.lat, { y0, hMax, bw: 190, gp: 110, max, col: C.pnu, t0: 36.6, step: 0.28, fmt: v => v.toFixed(2) });
      const ra = eo(P(t, 37.8, 38.3));
      if (ra > 0){
        punch('약 1ms 안팎', 960, 175, 84, C.pnu, ra, t - 37.8);
        text('0.36 ~ 1.13 ms', 960, 250, 34, C.sub, 'center', ra);
      }
    });
  });
}
function chipIcon(x, y, lab, col, a=1){
  withAlpha(a, () => {
    ctx.fillStyle = col;
    for (let i = 0; i < 5; i++){
      const o = -80 + i*40;
      ctx.fillRect(x + o - 6, y - 150, 12, 30); ctx.fillRect(x + o - 6, y + 120, 12, 30);
      ctx.fillRect(x - 150, y + o - 6, 30, 12); ctx.fillRect(x + 120, y + o - 6, 30, 12);
    }
    rr(x - 122, y - 122, 244, 244, 22); ctx.fill();
    text(lab, x, y, 70, '#fff', 'center');
  });
}

// ── G. 되감기 → 흰 화면 (39.4~) ──
function partG(t){
  const a = eo(P(t, 40.0, 40.6)); if (a <= 0) return;
  withAlpha(a, () => {
    text('처음의 그 장면으로', 960, 450, 84, C.pnu, 'center', 1 - eo(P(t, 42.4, 43.0)));
    // 아래→위로 빠르게 흐르는 줄무늬 (역재생 느낌)
    ctx.save(); ctx.globalAlpha *= 0.55;
    for (let i = 0; i < 26; i++){
      const y = (i*47 + t*1400) % H;
      ctx.fillStyle = i % 2 ? 'rgba(0,91,170,0.12)' : 'rgba(0,166,81,0.09)';
      ctx.fillRect(0, H - y, W, 6 + (i % 3)*4);
    }
    ctx.restore();
  });
  const wf = eo(P(t, 41.5, 43.4));
  if (wf > 0){ ctx.fillStyle = `rgba(255,255,255,${wf})`; ctx.fillRect(0, 0, W, H); }
  glitch(0.35*win(t, 40.5, 40.8, 42.8, 43.4), Math.floor(t*30) + 0.21);
}

function draw(t){
  background(true);
  partA(t); partB(t); partC(t); partD(t); partE(t); partF(t); partG(t);
  guard(1, t < 41.2);
  drawSubs(t, SUBS);
}
