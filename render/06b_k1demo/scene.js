// ⑥ 06b_k1demo — TTS_06 40.9~68.07s
const START = 40.9;
const SUBS = [
  [41.72, 43.76, "먼저 사이드카 프록시를 끈 상태입니다.", 'norm'],
  [44.4, 47.06, "auth는 평소 API 서버를 호출할 일이 없지만,", 'norm'],
  [47.42, 51.67, "감시하는 장치가 없으면 이 요청은 그대로 API 서버까지 도달합니다.", 'norm'],
  [52.74, 54.48, "이제 사이드카 프록시를 켭니다.", 'norm'],
  [55.28, 57.43, "auth pod가 한 번도 보낸 적 없는 방향,", 'norm'],
  [57.73, 59.77, "즉 API 서버로 나가는 요청을", 'norm'],
  [60.02, 61.94, "곧바로 이상 트래픽으로 잡아냅니다.", 'norm'],
  [62.75, 64.39, "대시보드에 빨간 drop이 뜨고,", 'norm'],
  [64.67, 66.89, "요청은 API 서버에 닿지 못합니다.", 'norm'],
];
const CUES = [
  [0, "탐지 OFF · 터미널", "auth pod → API 서버 요청이 그대로 성공", null],
  [52.5, "탐지 ON · 대시보드", "drop 0→1 · auth → API 서버 빨간 간선 · 터미널 연결 실패", C.red],
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
