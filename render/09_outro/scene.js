// ⑨ 아웃트로 (대본·효과음 없음) — 왼쪽 부산대 로고, 오른쪽 학부·졸업과제가 조용히 모여들며 정리된다
const IN = 0.7;
function draw(t){
  background();
  const e = eo(P(t, 0.05, IN));
  const zoom = 1 + 0.02*eio(P(t, IN, 4.2));
  const LW = 340, im = IMG.pnuLogo, LH = LW*im.height/im.width, GAP = 48;
  font(36); const w1 = ctx.measureText('부산대학교 정보컴퓨터공학부').width;
  font(28, 400); const w2 = ctx.measureText('2026 전기 졸업과제').width;
  const TW = Math.max(w1, w2), total = LW + GAP*2 + TW, x0 = 960 - total/2, cy = 540;
  ctx.save();
  ctx.translate(960, cy); ctx.scale(zoom, zoom); ctx.translate(-960, -cy);
  img('pnuLogo', x0 - 80*(1 - e), cy - LH/2, LW, LH, e);
  const dl = eio(P(t, IN - 0.2, IN + 0.3));
  if (dl > 0){ ctx.fillStyle = C.pnu; ctx.fillRect(x0 + LW + GAP - 1.5, cy - 52*dl, 3, 104*dl); }
  const tx = x0 + LW + GAP*2 + 80*(1 - e);
  text('부산대학교 정보컴퓨터공학부', tx, cy - 16, 36, C.text, 'left', e);
  text('2026 전기 졸업과제', tx, cy + 34, 28, C.pnu, 'left', e, 400);
  ctx.restore();
  const fo = P(t, 3.7, 4.2);
  if (fo > 0){ ctx.fillStyle = `rgba(255,255,255,${fo})`; ctx.fillRect(0, 0, W, H); }
}
