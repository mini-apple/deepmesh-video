// ⑥ 06c_r1demo — TTS_06 81.57~113.52s
const START = 81.57;
const SUBS = [
  [82.46, 84.2, "사이드카 프록시가 꺼져 있으면,", 'norm'],
  [84.56, 87.15, "변조된 화면이 그대로 사용자에게 전달되고", 'norm'],
  [87.15, 89.79, "스크립트가 사용자 브라우저에서 실행됩니다.", 'norm'],
  [90.25, 92.28, "사용자는 아무것도 모른 채 당합니다.", 'norm'],
  [93.46, 94.93, "사이드카 프록시를 켜면,", 'norm'],
  [95.18, 98.16, "frontend의 응답이 평소와 다르다는 걸 탐지합니다.", 'norm'],
  [98.84, 101.6, "그리고 똑같이 떠 있는 두 번째 replica에", 'norm'],
  [101.6, 103.55, "같은 화면을 요청해 비교하고,", 'norm'],
  [103.55, 106.23, "변조된 쪽 대신 정상 응답을 내보냅니다.", 'norm'],
  [107.06, 109.55, "대시보드에는 주황색 relay가 뜨고,", 'norm'],
  [109.55, 113.15, "사용자에게는 스크립트가 빠진 정상 화면이 표시됩니다.", 'norm'],
];
const CUES = [
  [0, "탐지 OFF · 변조된 index.html + 사용자 브라우저", "주입된 스크립트가 사용자 브라우저에서 실행", null],
  [93.3, "탐지 ON · 대시보드 + 사용자 브라우저", "relay 0→1 · 주황 간선 · 스크립트가 빠진 정상 화면", C.orange],
];

// ⑥ 시연 자리표시 (실제 녹화 전 미리보기용). 음성·자막은 최종과 같고, 화면만 녹화 안내.
// 자막·안내 시각은 TTS_06_시연.WAV 절대 시각(silencedetect -35dB 0.25s 실측) → START 를 빼서 쓴다.
function draw(t){
  background(true);
  const ta = t + START;
  // 녹화 영역
  withAlpha(1, () => {
    rr(150, 110, 1620, 760, 24); ctx.fillStyle = '#EEF1F5'; ctx.fill();
    ctx.setLineDash([18, 14]); ctx.lineWidth = 3; ctx.strokeStyle = C.dim; ctx.stroke(); ctx.setLineDash([]);
  });
  text('● REC  시연 녹화가 들어갈 자리', 200, 160, 26, C.red, 'left', 0.55 + 0.45*Math.abs(Math.sin(t*2)));
  // 현재 안내
  let cur = CUES[0];
  for (const c of CUES) if (ta >= c[0]) cur = c;
  const k = CUES.indexOf(cur), a = eo(P(ta, cur[0], cur[0] + 0.4));
  text(cur[1], 960, 420, 64, cur[3] || C.text, 'center', a);
  text(cur[2], 960, 520, 34, C.sub, 'center', a, 400);
  guard(1);
  drawSubs(ta, SUBS);
}
