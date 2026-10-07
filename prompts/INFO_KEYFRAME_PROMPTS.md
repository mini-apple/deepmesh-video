# INFO_KEYFRAME_PROMPTS

INFO는 **새 장면 생성이 아니라 해당 CLEAN 이미지의 2차 편집**이다.
Google Flow에서 CLEAN 이미지를 불러온 뒤 편집 모드에서 아래 프롬프트를 적용한다.

## 사용 방법

1. Flow에서 해당 CLEAN 이미지를 편집 대상으로 연다.
2. 아래 프롬프트를 붙여 넣는다.
3. 결과를 같은 ID의 INFO 파일명으로 저장해 `info/` 폴더에 넣는다.
4. Claude Code에 `info 폴더 검수해`라고 요청한다. CLEAN과 1:1로 대조한다.

## 공통 보존 블록 (모든 프롬프트에 포함)

```text
Preserve the base image exactly: same camera, same crop, same lens, same geometry, same machinery,
same people and poses, same physical state, same lighting, same materials, same textures, same background.
Do not redraw, rotate, reposition, zoom, replace or redesign the base scene.
Add graphic overlays only.
```

## 공통 오버레이 규칙

```text
Overlays must be anchored to real structures in the scene and must respect perspective, parallax and occlusion.
They must not look like a flat HUD floating on the lens.
Color rules: green = normal flow or pass, red = block or danger, amber = replacement or suspicion,
restrained blue-white = structural guide lines. Keep overlays minimal and readable.
No large headline text, no paragraphs, no logos, no watermarks, no UI panels.
```

## 한글 라벨 주의

라벨은 2~6글자, 씬당 최대 3개. 글자가 깨지면 그 사실을 `manifests/PROJECT_STATUS.md`의 파일럿 판정표에 기록하고,
이후 모든 INFO에서 한글을 제거한 뒤 CapCut 자막으로 대체한다.

---

## P1 — `P1_S04A_KF-04A_INFO_야간공장-전경.png`

기반 이미지: `P1_S04A_KF-04A_CLEAN_야간공장-전경.png`

```text
[공통 보존 블록]

Add: a single small red anchor dot placed exactly on the red-tinted work cell in the midground,
with a thin restrained leader line rising from the anchor to a compact Korean label plate.
Korean label text: 침해 구역
The label plate sits in empty air above the cell, small, high contrast, sharply rendered.
No other graphics anywhere in the frame.

[공통 오버레이 규칙]
```

## P2 — `P2_S04B_KF-04B_INFO_사원증-인증.png`

기반 이미지: `P2_S04B_KF-04B_CLEAN_사원증-인증.png`

```text
[공통 보존 블록]

Add: a short restrained blue-white line from the ID badge to the card reader panel,
and one amber arrow that starts at the card reader and points through the door gap toward the control room monitors.
Two compact Korean label plates:
- 사원증  placed next to the badge
- 권한 과다  placed next to the amber arrow
Arrow head appears only at the end of the arrow body, pointing into the control room.

[공통 오버레이 규칙]
```

## P3 — `P3_S04C_KF-04C_INFO_통로-확산.png`

기반 이미지: `P3_S04C_KF-04C_CLEAN_통로-확산.png`

```text
[공통 보존 블록]

Add: one red flow arrow that follows the aisle floor from the nearest red-lit work cell toward the cells
further down the aisle, hugging the floor perspective and passing behind foreground machinery where occluded.
Small red anchor dots at each cell entrance the arrow passes.
One compact Korean label plate near the arrow start.
Korean label text: 측면이동

[공통 오버레이 규칙]
```

## P4 — `P4_S05F_KF-05F_INFO_전표-반려.png`

기반 이미지: `P4_S05F_KF-05F_CLEAN_전표-반려.png`

```text
[공통 보존 블록]

Add: one red arrow that starts at the clipboard and heads outward past the inspector,
then is cut by a clear red X mark placed exactly at the inspector's raised palm.
One compact Korean label plate beside the X mark.
Korean label text: 반려
The arrow must be blocked at the palm, not continue past it.

[공통 오버레이 규칙]
```

## P5 — `P5_S05G_KF-05G_INFO_부품-교체.png`

기반 이미지: `P5_S05G_KF-05G_CLEAN_부품-교체.png`

```text
[공통 보존 블록]

Add: one amber flow arrow that follows the cross conveyor from the right cell's panel to the left cell's
outbound line, matching the conveyor perspective. A small gray X mark on the diverted panel on the reject roller.
One compact Korean label plate above the amber arrow.
Korean label text: 교체

[공통 오버레이 규칙]
```

## P6 — `P6_S05H_KF-05H_INFO_정상-통과.png`

기반 이미지: `P6_S05H_KF-05H_CLEAN_정상-통과.png`

```text
[공통 보존 블록]

Add: one green flow arrow along the conveyor in the direction of travel, starting under the ceiling
inspection camera and continuing past the cell exit, following the conveyor perspective.
A small green anchor dot where the scanning light meets the panel surface.
One compact Korean label plate near the arrow.
Korean label text: 통과

[공통 오버레이 규칙]
```
