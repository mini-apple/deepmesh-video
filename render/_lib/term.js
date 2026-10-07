// 터미널 창(재현 화면) 그리기. 실제 시스템에서 캡처한 명령·출력을 그대로 보여준다.
// LINES = [[등장초, '텍스트', 색], ...]. mono 느낌으로 왼쪽 정렬.
function terminal(t, title, lines, x, y, w, h){
  ctx.save();
  ctx.shadowColor = 'rgba(17,24,39,0.22)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
  rr(x, y, w, h, 16); ctx.fillStyle = '#0b1020'; ctx.fill(); ctx.restore();
  rr(x, y, w, 46, 16); ctx.fillStyle = '#1b2233'; ctx.fill();
  ctx.fillStyle = '#1b2233'; ctx.fillRect(x, y+30, w, 16);
  for (let i=0;i<3;i++){ ctx.beginPath(); ctx.arc(x+28+i*26, y+23, 7, 0, Math.PI*2); ctx.fillStyle = ['#ff5f57','#febc2e','#28c840'][i]; ctx.fill(); }
  ctx.font = '400 22px KR'; ctx.fillStyle = '#8b95a7'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, x+w/2, y+23);
  ctx.textAlign = 'left';
  const lh = 40; let yy = y + 78;
  let lastVisible = y + 78;
  for (const [t0, s, col] of lines){
    if (t < t0) continue;
    ctx.font = '500 25px KR';
    ctx.fillStyle = col || '#d7dce6';
    ctx.fillText(s, x + 36, yy);
    lastVisible = yy; yy += lh;
  }
  // 커서 (마지막 보인 줄 아래에서 깜빡)
  if (Math.sin(t*6) > 0){ ctx.fillStyle = '#28c840'; ctx.fillRect(x + 36, yy - 12, 13, 24); }
}
