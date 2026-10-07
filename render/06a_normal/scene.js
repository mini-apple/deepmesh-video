// ⑥ 06a_normal — TTS_06 0.0~28.10s
const START = 0.0;
const SUBS = [
  [0.28, 4.9, "그럼 이제 이상 트래픽이 정말 막히는지 실제 시스템에서 확인해보겠습니다.", 'norm'],
  [5.38, 9.92, "버추얼머신 네 대로 쿠버네티스 클러스터를 세우고 저희 게시판을 올렸습니다.", 'norm'],
  [10.44, 12.75, "네 개의 서비스가 각각 pod로 돌아가고,", 'norm'],
  [13.06, 15.84, "모든 pod에는 사이드카 프록시가 붙어 있습니다.", 'norm'],
  [16.35, 20.31, "이 화면은 관리자가 전체 클러스터 현황을 볼 수 있는 대시보드입니다.", 'norm'],
  [20.85, 23.22, "지금은 정상적인 트래픽 부하를 주고 있고,", 'norm'],
  [23.53, 27.33, "트래픽이 모두 초록색 포워드 간선으로 보이는 것을 확인할 수 있습니다.", 'norm'],
];
const CUES = [
  [0, "대시보드 개요 + 게시판 화면", "정상 트래픽 부하 · 모든 간선이 초록 forward", null],
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
