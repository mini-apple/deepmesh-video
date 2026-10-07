// 모든 렌더 단위가 공유하는 색·글꼴·도형·애니메이션 도구.
// 장면 파일(scene.js)은 ASSETS(선택)와 draw(t)만 정의하면 된다.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1920, H = 1080;
// 라이트 테마 (2026-09-19). 발표 템플릿 색: 부산대 파랑 #005BAA, 부산대 초록 #00A651.
const C = {
  bg:'#FFFFFF', grid:'#EEF2F7', panel:'#F7F9FC', panel2:'#FFFFFF', edge:'#C3CEDD',
  text:'#111827', sub:'#4B5563', dim:'#9CA3AF', st:'#005BAA',
  green:'#16A34A', red:'#DC2626', amber:'#D97706', orange:'#EA580C', gold:'#B7791F', pnu:'#005BAA', pnuGreen:'#00A651',
  redTint:'rgba(220,38,38,0.10)', navy:'#1d2d52', helmet:'#cfd5de', skin:'#e9c7a3', pillBg:'rgba(255,255,255,0.96)'
};

const clamp = (x,a=0,b=1) => Math.max(a, Math.min(b, x));
const lerp = (a,b,x) => a + (b-a)*x;
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const eio = x => { x = clamp(x); return x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3)/2; };
const P = (t,a,b) => clamp((t-a)/(b-a));
const win = (t,a,b,c,d) => Math.min(eo(P(t,a,b)), 1 - eo(P(t,c,d)));

function font(sz, w=700){ ctx.font = `${w} ${sz}px KR`; }
function rr(x,y,w,h,r){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); }
function withAlpha(a, fn){ if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; fn(); ctx.restore(); }

function text(s,x,y,sz,col,align='left',alpha=1,w=700){
  withAlpha(alpha, () => { font(sz,w); ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s,x,y); });
}
function pill(s,x,y,sz,col,alpha=1,glow=0,bg=C.pillBg){
  withAlpha(alpha, () => {
    font(sz);
    const m = ctx.measureText(s).width, px = sz*0.75, ph = sz*1.75, x0 = x - m/2 - px;
    if (glow){ ctx.shadowColor = col; ctx.shadowBlur = 24*glow; }
    rr(x0, y-ph/2, m+2*px, ph, ph/2); ctx.fillStyle = bg; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = col; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(s, x0+px, y+1);
  });
}
function background(grid=false){
  ctx.fillStyle = C.bg; ctx.fillRect(0,0,W,H);
  if (!grid) return;
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
  for (let x=0;x<=W;x+=60){ ctx.beginPath(); ctx.moveTo(x+.5,0); ctx.lineTo(x+.5,H); ctx.stroke(); }
  for (let y=0;y<=H;y+=60){ ctx.beginPath(); ctx.moveTo(0,y+.5); ctx.lineTo(W,y+.5); ctx.stroke(); }
}

// ── 발표 슬라이드 틀 (deepmesh 발표 템플릿과 같은 구성) ──
const COMMON_ASSETS = [['pnuLogo', '../../assets/image/pnu_signature.png']];
function slideFrame(tag, alpha=1){
  withAlpha(alpha, () => {
    ctx.fillStyle = C.pnu; ctx.fillRect(0, 0, W, 16);
    ctx.fillStyle = C.pnuGreen; ctx.beginPath(); ctx.moveTo(1672,16); ctx.lineTo(W,16); ctx.lineTo(W,30); ctx.lineTo(1688,30); ctx.closePath(); ctx.fill();
    ctx.fillRect(94, 72, 24, 24);
    font(26); ctx.fillStyle = C.pnu; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px'; ctx.fillText(tag, 144, 85); ctx.letterSpacing = '0px';
  });
  imgFit('pnuLogo', 1792, 1040, 200, alpha);
}
function slideTitle(s, alpha=1){ text(s, 92, 168, 58, C.text, 'left', alpha); }
// 제목 바꾸기: 이전 제목은 사라지고 새 제목이 나타난다. titles = [[시작초, '제목'], ...]
function slideTitles(t, titles){
  for (let i=0;i<titles.length;i++){
    const [t0, s] = titles[i], t1 = i+1 < titles.length ? titles[i+1][0] : 1e9;
    slideTitle(s, win(t, t0, t0+0.45, t1-0.35, t1));
  }
}

// ── 캡처 카드: 원본 이미지 일부(src)를 흰 카드로 띄우고, 문구에 형광펜을 순서대로 긋는다 ──
// hl = [{rects:[[x0,y0,x1,y1],...] (원본 픽셀), prog:0~1, color}]
function capCard(k, src, x, y, w, alpha=1, hl=[], caption=null){
  const im = IMG[k]; if (!im) return 0;
  const [sx, sy, sw, sh] = src || [0, 0, im.width, im.height];
  const sc = w/sw, h = sh*sc;
  withAlpha(alpha, () => {
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.16)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#fff'; ctx.fillRect(x-14, y-14, w+28, h+28); ctx.restore();
    ctx.drawImage(im, sx, sy, sw, sh, x, y, w, h);
    ctx.strokeStyle = C.edge; ctx.lineWidth = 1.5; ctx.strokeRect(x-14, y-14, w+28, h+28);
    for (const {rects, prog, color} of hl){
      const total = rects.reduce((a, r) => a + (r[2]-r[0]), 0); let acc = 0; const lim = clamp(prog)*total;
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = color || 'rgba(255,214,10,0.85)';
      for (const r of rects){
        const len = r[2]-r[0], vis = Math.max(0, Math.min(len, lim-acc)); acc += len;
        if (vis > 0) ctx.fillRect(x+(r[0]-sx)*sc-4, y+(r[1]-sy)*sc-3, vis*sc+8, (r[3]-r[1])*sc+6);
      }
      ctx.restore();
    }
  });
  if (caption) text(caption, x+w+14, y-42, 22, C.sub, 'right', alpha, 400);
  return h;
}
function sectionTag(s, alpha=1){ text(s, 72, 64, 28, C.sub, 'left', alpha); }
// 화면 구석 상시 표기 ("가상 상황 연출", "재현 화면" 등)
function cornerTag(s, alpha=1){
  withAlpha(alpha, () => {
    font(24); const m = ctx.measureText(s).width;
    rr(W-60-m-28, H-78, m+28, 42, 8); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = C.dim; ctx.stroke();
    ctx.fillStyle = C.sub; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, W-60-m-14, H-56);
  });
}

// ── 인물 (코드로 직접 그림: 외부 아이콘 라이선스 부담 없음) ──
function person(x,y,s,alpha=1,vest=null){
  withAlpha(alpha, () => {
    ctx.translate(x,y); ctx.scale(s,s);
    rr(-34,-10,68,92,24); ctx.fillStyle = C.navy; ctx.fill();
    if (vest){ ctx.fillStyle = vest; ctx.fillRect(-34,20,68,11); }
    ctx.beginPath(); ctx.arc(0,-36,22,0,Math.PI*2); ctx.fillStyle = C.skin; ctx.fill();
    ctx.beginPath(); ctx.arc(0,-42,25,Math.PI,0); ctx.fillStyle = C.helmet; ctx.fill();
    ctx.fillRect(-31,-44,62,7);
  });
}
function hacker(x,y,s,alpha=1){
  withAlpha(alpha, () => {
    ctx.translate(x,y); ctx.scale(s,s);
    rr(-36,-6,72,88,26); ctx.fillStyle = '#1b1f2a'; ctx.fill();           // 몸
    ctx.beginPath(); ctx.moveTo(-34,-4); ctx.quadraticCurveTo(-36,-74,0,-78); ctx.quadraticCurveTo(36,-74,34,-4); ctx.closePath();
    ctx.fillStyle = '#262c3a'; ctx.fill();                                   // 후드
    ctx.beginPath(); ctx.ellipse(0,-34,20,24,0,0,Math.PI*2); ctx.fillStyle = '#07090f'; ctx.fill();  // 얼굴 그림자
    ctx.fillStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 12;
    ctx.fillRect(-11,-40,8,4); ctx.fillRect(3,-40,8,4);                     // 눈
  });
}
function userIcon(x,y,s,alpha=1){
  withAlpha(alpha, () => {
    ctx.translate(x,y); ctx.scale(s,s);
    ctx.beginPath(); ctx.arc(0,-34,20,0,Math.PI*2); ctx.fillStyle = C.sub; ctx.fill();
    rr(-32,-6,64,70,28); ctx.fill();
  });
}
function packet(x,y,alpha,col=C.st,w=76,h=46){
  withAlpha(alpha, () => {
    rr(x-w/2,y-h/2,w,h,9); ctx.fillStyle = '#EAF1FA'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
    ctx.fillStyle = col; ctx.globalAlpha *= 0.85;
    for (let i=0;i<3;i++) ctx.fillRect(x-w/2+13, y-h/2+11+i*10, (w-26)*(i==2?0.55:1), 4);
  });
}

// ── 이미지 자산 ──
const IMG = {};
function loadAssets(list){
  return Promise.all((list||[]).map(([k, url]) => new Promise((res, rej) => {
    const im = new Image(); im.onload = () => { IMG[k] = im; res(); }; im.onerror = () => rej(new Error('asset ' + url)); im.src = url;
  })));
}
function img(k, x, y, w, h, alpha=1){ const im = IMG[k]; if (!im) return; withAlpha(alpha, () => ctx.drawImage(im, x, y, w, h)); }
function imgFit(k, cx, cy, w, alpha=1){ const im = IMG[k]; if (!im) return; const h = w*im.height/im.width; img(k, cx-w/2, cy-h/2, w, h, alpha); return h; }

// 선을 따라 움직이는 점 (0~1)
function along(x1,y1,x2,y2,u){ return [lerp(x1,x2,u), lerp(y1,y2,u)]; }

// 글리치: 현재 화면을 가로 띠로 밀어내고 색 분리
const _gl = document.createElement('canvas'); _gl.width = W; _gl.height = H; const _gx = _gl.getContext('2d');
function glitch(strength, seed){
  if (strength <= 0) return;
  _gx.clearRect(0,0,W,H); _gx.drawImage(cv,0,0);
  let r = seed*9301 % 1;
  const rnd = () => (r = (r*9301 + 49297) % 233280) / 233280;
  for (let i=0;i<14;i++){
    const y = rnd()*H, h = 8 + rnd()*60, dx = (rnd()-0.5)*160*strength;
    ctx.drawImage(_gl, 0, y, W, h, dx, y, W, h);
  }
  ctx.save(); ctx.globalAlpha = 0.28*strength; ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(_gl, 12*strength, 0); ctx.restore();
}


// ── 화면 가드: 위 파랑·초록 띠 + 아래 부산대 로고 (정형 슬라이드 요소 없이) ──
function guard(alpha=1, logo=true){
  withAlpha(alpha, () => {
    ctx.fillStyle = C.pnu; ctx.fillRect(0, 0, W, 14);
    ctx.fillStyle = C.pnuGreen; ctx.beginPath(); ctx.moveTo(1672,14); ctx.lineTo(W,14); ctx.lineTo(W,27); ctx.lineTo(1688,27); ctx.closePath(); ctx.fill();
  });
  if (logo) imgFit('pnuLogo', 1792, 1040, 200, alpha);
}

// ── 자막 ──
// subs = [[시작, 끝, '문장', 'norm'|'hype'], ...]. 'norm' 은 흰 글씨 + 검은 테두리(쇼츠 기본 자막),
// 'hype' 는 훅 강조(불꽃색, 발광, 흔들림). 같은 배열로 나중에 SRT를 만든다.
function wrapLines(s, maxW){
  const words = s.split(' '), lines = []; let cur = '';
  for (const w of words){ const tryS = cur ? cur + ' ' + w : w; if (ctx.measureText(tryS).width > maxW && cur){ lines.push(cur); cur = w; } else cur = tryS; }
  if (cur) lines.push(cur); return lines;
}
function subNorm(s, a){
  // 기본 자막: 반투명 어두운 박스 + 흰 글씨 한 겹 (테두리 없음)
  withAlpha(a, () => {
    ctx.font = '500 44px KRH'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lines = wrapLines(s, 1640), lh = 64, cy0 = 990 - (lines.length-1)*lh;
    lines.forEach((ln, i) => {
      const m = ctx.measureText(ln).width, y = cy0 + i*lh;
      rr(W/2 - m/2 - 24, y - 30, m + 48, 60, 6); ctx.fillStyle = 'rgba(17,17,17,0.72)'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(ln, W/2, y + 1);
    });
  });
}
function subHype(s, a, age, cy=360){
  withAlpha(a, () => {
    const pop = 1 + 0.35*Math.exp(-age*14);
    const jx = Math.sin(age*97)*3.5, jy = Math.cos(age*83)*2.5;
    ctx.translate(W/2 + jx, cy + jy); ctx.scale(pop, pop);
    ctx.font = '900 118px KRH'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const g = ctx.createLinearGradient(0, -60, 0, 60);
    g.addColorStop(0, '#FFF36B'); g.addColorStop(0.45, '#FF9A1F'); g.addColorStop(1, '#E8231A');
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(255,110,0,0.85)'; ctx.shadowBlur = 38;
    ctx.lineWidth = 20; ctx.strokeStyle = '#2a0a00'; ctx.strokeText(s, 0, 0);
    ctx.shadowBlur = 0; ctx.lineWidth = 8; ctx.strokeStyle = '#000'; ctx.strokeText(s, 0, 0);
    ctx.fillStyle = g; ctx.fillText(s, 0, 0);
  });
}
function drawSubs(t, subs, hypeY=360){
  for (const [t0, t1, s, st] of subs){
    if (st === 'srt' || t < t0 - 0.05 || t > t1 + 0.12) continue;   // 'srt' = SRT 파일에만
    const a = Math.min(P(t, t0 - 0.05, t0 + 0.05), 1 - P(t, t1 + 0.02, t1 + 0.12));
    if (st === 'hype') subHype(s, a, t - t0, hypeY); else subNorm(s, a);
  }
}


// ── 공장 비유 공통 요소 (③~⑧에서 같은 모양으로 쓴다) ──
// 대시보드 색과 같다: forward = C.green, drop = C.red, relay = C.orange
// 공정 구역 (= Pod). label 은 구역 위 이름, k(0~1) 는 침해 정도(빨강)
function zone(x, y, w, h, label, alpha=1, k=0, labelCol=C.text){
  withAlpha(alpha, () => {
    ctx.save();
    if (k > 0){ ctx.shadowColor = C.red; ctx.shadowBlur = 28*k; }
    rr(x, y, w, h, 18); ctx.fillStyle = '#F7F9FC'; ctx.fill(); ctx.shadowBlur = 0;
    if (k > 0){ ctx.fillStyle = `rgba(220,38,38,${0.12*k})`; ctx.fill(); }
    ctx.lineWidth = 3; ctx.setLineDash([]); ctx.strokeStyle = k > 0.5 ? C.red : C.edge; ctx.stroke();
    ctx.restore();
    if (label) text(label, x + w/2, y - 28, 30, k > 0.5 ? C.red : labelCol, 'center');
  });
}
// 작업자 (= 컨테이너). tag 가 있으면 가슴에 이름표
function worker(x, y, s=1, alpha=1, tag=null, tagCol=C.pnu){
  person(x, y, s, alpha);
  if (tag) withAlpha(alpha, () => {
    font(Math.round(20*s)); const m = ctx.measureText(tag).width;
    rr(x - m/2 - 8*s, y + 28*s, m + 16*s, 30*s, 6*s); ctx.fillStyle = tagCol; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tag, x, y + 43*s);
  });
}
// 출구 검사원 (= 사이드카 프록시): 초록 조끼 + 방패 배지
function inspector(x, y, s=1, alpha=1){
  person(x, y, s, alpha, C.pnuGreen);
  withAlpha(alpha, () => {
    ctx.translate(x + 30*s, y - 2*s); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(17,-13); ctx.lineTo(15,6); ctx.quadraticCurveTo(10,18,0,24); ctx.quadraticCurveTo(-10,18,-15,6); ctx.lineTo(-17,-13); ctx.closePath();
    ctx.fillStyle = C.pnuGreen; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(-7,1); ctx.lineTo(-1,7); ctx.lineTo(8,-5); ctx.stroke();
  });
}
// 생산관리실 (= 마스터 노드). 모니터 두 대가 있는 방
function controlRoom(x, y, w, h, alpha=1, k=0, label='생산관리실'){
  zone(x, y, w, h, label, alpha, k);
  withAlpha(alpha, () => {
    const mw = Math.min(120, w*0.3), mh = mw*0.62, cy = y + h/2 - 6;
    for (const dx of [-mw*0.62, mw*0.62]){
      rr(x + w/2 + dx - mw/2, cy - mh/2, mw, mh, 8); ctx.fillStyle = C.navy; ctx.fill();
      ctx.fillStyle = k > 0.5 ? C.red : '#6EA8FE';
      for (let i = 0; i < 3; i++) ctx.fillRect(x + w/2 + dx - mw/2 + 12, cy - mh/2 + 12 + i*14, (mw - 24)*(i === 2 ? 0.5 : 1), 6);
      ctx.fillStyle = C.navy; ctx.fillRect(x + w/2 + dx - 5, cy + mh/2, 10, 14);
    }
  });
}
// 작업 요청서 (= 네트워크 트래픽 한 건). col 로 판정 색을 입힌다
function docSheet(x, y, s=1, alpha=1, col=C.pnu){
  withAlpha(alpha, () => {
    ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-22,-28); ctx.lineTo(12,-28); ctx.lineTo(22,-18); ctx.lineTo(22,28); ctx.lineTo(-22,28); ctx.closePath();
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
    ctx.fillStyle = col; for (let i = 0; i < 4; i++) ctx.fillRect(-14, -14 + i*10, i === 3 ? 18 : 28, 4);
  });
}
// 부품 상자 (= 응답 데이터)
function partBox(x, y, s=1, alpha=1, col=C.amber){
  withAlpha(alpha, () => {
    ctx.translate(x, y); ctx.scale(s, s);
    rr(-24,-20,48,40,6); ctx.fillStyle = '#FDF3E1'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-24,-6); ctx.lineTo(24,-6); ctx.moveTo(0,-20); ctx.lineTo(0,-6); ctx.stroke();
  });
}
// 사원증 (= 서비스 계정 토큰)
function idBadge(x, y, s=1, alpha=1, col=C.pnu){
  withAlpha(alpha, () => {
    ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-14,-40); ctx.lineTo(0,-24); ctx.lineTo(14,-40); ctx.stroke();
    rr(-26,-24,52,64,7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.fillRect(-26,-24,52,14);
    ctx.beginPath(); ctx.arc(0,4,9,0,Math.PI*2); ctx.fill();
    ctx.fillRect(-15,20,30,4); ctx.fillRect(-11,28,22,4);
  });
}
// 판정 표시: 'forward' 초록 체크, 'drop' 빨강 X, 'relay' 주황 교체 화살표
function verdictMark(kind, x, y, s=1, alpha=1){
  const col = kind === 'drop' ? C.red : kind === 'relay' ? C.orange : C.green;
  withAlpha(alpha, () => {
    ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI*2); ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
    if (kind === 'drop'){ ctx.moveTo(-11,-11); ctx.lineTo(11,11); ctx.moveTo(11,-11); ctx.lineTo(-11,11); }
    else if (kind === 'relay'){ ctx.moveTo(-13,-6); ctx.lineTo(12,-6); ctx.moveTo(6,-12); ctx.lineTo(12,-6); ctx.lineTo(6,0); ctx.moveTo(13,7); ctx.lineTo(-12,7); ctx.moveTo(-6,1); ctx.lineTo(-12,7); ctx.lineTo(-6,13); }   // ⇄ 교체
    else { ctx.moveTo(-12,1); ctx.lineTo(-3,10); ctx.lineTo(13,-9); }
    ctx.stroke();
  });
}
// 흐르는 점선 간선 (트래픽). col 로 forward/drop/relay 색
function flowLine(x1, y1, x2, y2, t, col=C.green, alpha=1, w=3){
  withAlpha(alpha, () => {
    ctx.lineWidth = w; ctx.setLineDash([12, 12]); ctx.lineDashOffset = -t*45; ctx.strokeStyle = col;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
  });
}
// 카메라: keys = [[t, fx, fy, z], ...]. 초점 (fx,fy) 가 화면 (960, cy) 에 온다
function camAt(t, keys){
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++){
    const a = keys[i], b = keys[i+1];
    if (t <= b[0]){ const u = eio(P(t, a[0], b[0])); return [lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; }
  }
  return keys[keys.length-1].slice(1);
}
function withCam(c, dx, dy, fn, cy=470){
  ctx.save(); ctx.translate(960 + dx, cy + dy); ctx.scale(c[2], c[2]); ctx.translate(-c[0], -c[1]); fn(); ctx.restore();
}
// 큰 숫자·단어 한 방 (팝)
function punch(s, x, y, sz, col, a, age){
  withAlpha(a, () => {
    const pop = 1 + 0.28*Math.exp(-Math.max(0, age)*12);
    ctx.translate(x, y); ctx.scale(pop, pop);
    ctx.font = `900 ${sz}px KRH`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = sz*0.09; ctx.strokeStyle = '#fff'; ctx.strokeText(s, 0, 0);
    ctx.fillStyle = col; ctx.fillText(s, 0, 0);
  });
}
// 용어 카드: 비유 → 실제 용어 (예: '공장 전체' → '클러스터')
function termCard(from, to, x, y, alpha=1, icon=null, w=420){
  withAlpha(alpha, () => {
    ctx.save(); ctx.shadowColor = 'rgba(17,24,39,0.14)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    rr(x - w/2, y - 60, w, 120, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.edge; ctx.stroke();
    const tx = icon ? x - w/2 + 110 : x;
    if (icon) imgFit(icon, x - w/2 + 56, y, 72);
    text(from, icon ? tx : x, y - 22, 24, C.sub, icon ? 'left' : 'center', 1, 400);
    text(to, icon ? tx : x, y + 20, 38, C.pnu, icon ? 'left' : 'center');
  });
}
