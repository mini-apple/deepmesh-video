# VIDEO_GENERATION_PROMPTS

CLEAN을 시작 프레임으로, INFO를 최종 그래픽 상태의 목표로 삼아 4초 클립을 만든다.
**INFO를 첫 프레임으로 쓰지 않는다. INFO 이미지를 평면으로 움직이지 않는다.**

## 사용 방법

1. Google Flow에서 프레임 투 비디오 모드를 연다.
2. 시작 프레임으로 해당 **CLEAN 이미지**를 넣는다.
3. 아래 프롬프트를 붙여 넣는다. (INFO 이미지는 최종 상태 참조용으로만 함께 첨부)
4. 결과를 지정 파일명으로 `video/` 폴더에 저장한다.
5. Claude Code에 `video 폴더 검수해`라고 요청한다.

## 공통 타이밍 블록 (모든 프롬프트에 포함)

```text
Duration exactly 4.0 seconds, 16:9 horizontal, single continuous shot, no cuts.
0.0-0.4s  CLEAN state only. Camera move begins, natural environment motion continues.
0.4-0.9s  Anchor points ignite on the real structures.
0.9-1.7s  Leader lines and arrow bodies build outward along the scene geometry.
1.7-2.6s  Short Korean label plates assemble. Arrow heads appear only after their bodies are complete.
2.6-3.4s  A flow pulse travels along the arrow path.
3.4-4.0s  Settle into the final graphic state and hold it readable.
```

## 공통 규칙 블록 (모든 프롬프트에 포함)

```text
One camera move only, 5 to 15 degrees total. Camera and graphics move independently:
graphics stay locked to their 3D anchors in the scene while the camera moves.
Graphics respect perspective, parallax and occlusion.
Do not fade in all graphics at once. Do not use a flat HUD. Do not wobble text.
Do not reverse arrow direction. No neon, no fantasy energy, no structural deformation,
no object duplication, no 360 degree rotation, no whip pan, no camera roll.
Do not generate narration, dialogue, music, extra subtitles, logos or watermarks.
```

---

## P1 — `P1_CLIP_S04A_KF-04A_야간공장-전경.mp4`

시작 프레임: `P1_S04A_KF-04A_CLEAN_야간공장-전경.png` / 목표 상태: 같은 ID의 INFO

```text
[공통 타이밍 블록]

Motion: slow left-to-right dolly along the plant aisle, about 10 degrees, revealing depth between
foreground machinery and the background control room window. Ambient plant motion continues:
conveyor rollers turning slowly, faint light flicker from machinery.
Graphic build: a red anchor dot ignites on the red-tinted work cell, a thin leader line rises,
and the Korean label plate 침해 구역 assembles above it, staying locked to the cell as the camera moves.

[공통 규칙 블록]
```

## P2 — `P2_CLIP_S04B_KF-04B_사원증-인증.mp4`

```text
[공통 타이밍 블록]

Motion: shallow push-in from the badge toward the door gap, about 8 degrees, focus gradually shifting
from the badge to the control room monitors beyond the door. The reader panel light pulses once as the badge touches it.
Graphic build: a short blue-white line forms from badge to reader, then an amber arrow body extends from the reader
through the door gap toward the monitors, its arrow head appearing last. Korean label plates 사원증 and 권한 과다
assemble beside their anchors.

[공통 규칙 블록]
```

## P3 — `P3_CLIP_S04C_KF-04C_통로-확산.mp4`

```text
[공통 타이밍 블록]

Motion: forward tracking along the aisle, about 12 degrees of parallax between near and far work cells.
The red floor light spreads a little further down the aisle during the shot.
Graphic build: red anchor dots ignite in sequence at each cell entrance from near to far, then a red flow arrow
builds along the aisle floor connecting them, passing behind foreground machinery where occluded.
Korean label plate 측면이동 assembles near the arrow start. A red flow pulse travels along the arrow at 2.6-3.4s.

[공통 규칙 블록]
```

## P4 — `P4_CLIP_S05F_KF-05F_전표-반려.mp4`

```text
[공통 타이밍 블록]

Motion: small orbit around the inspector's shoulder, about 10 degrees, so the clipboard and the raised palm
stay readable. The red ceiling indicator pulses slowly. The clipboard is pushed slightly back toward the cell.
Graphic build: a red arrow body extends from the clipboard outward, then is cut by a red X mark that snaps into
place exactly at the raised palm. Korean label plate 반려 assembles beside the X. The arrow never continues past the palm.

[공통 규칙 블록]
```

## P5 — `P5_CLIP_S05G_KF-05G_부품-교체.mp4`

```text
[공통 타이밍 블록]

Motion: side dolly across the two adjacent cells, about 12 degrees. The cross conveyor keeps moving so the
replacement panel advances toward the left outbound line while the original panel rolls further onto the reject roller.
Graphic build: an amber arrow body builds along the cross conveyor from right cell to left outbound line,
head appearing last. A small gray X marks the diverted panel. Korean label plate 교체 assembles above the arrow.
An amber flow pulse runs along the arrow at 2.6-3.4s.

[공통 규칙 블록]
```

## P6 — `P6_CLIP_S05H_KF-05H_정상-통과.mp4`

```text
[공통 타이밍 블록]

Motion: tracking along the conveyor direction, about 10 degrees, following the car body panel as it passes
under the ceiling inspection camera without stopping. The scanning light sweeps across the panel once.
Graphic build: a green anchor dot ignites where the scanning light meets the panel, then a green flow arrow
builds along the conveyor in the direction of travel. Korean label plate 통과 assembles near the arrow.
A green flow pulse travels along the arrow at 2.6-3.4s.

[공통 규칙 블록]
```
