# CLEAN_KEYFRAME_PROMPTS

Google Flow 이미지 생성용 프롬프트. **파일럿 6씬분**만 작성되어 있다.
전체 배치는 파일럿 판정 통과 후에 추가한다.

## 사용 방법

1. Google Flow에서 이미지 모드, 화면비 16:9, 출력 4장으로 설정한다.
2. 아래 회색 블록 하나를 **통째로** 복사해 프롬프트 칸에 붙여 넣고 생성한다. 블록은 모두 완성형이라 고칠 곳이 없다.
3. 4장 중 가장 좋은 1장을 지정된 파일명으로 저장해 `clean/` 폴더에 넣는다.
4. 6장이 모이면 Claude Code에 `clean 폴더 검수해`라고 요청한다.

여섯 블록의 앞부분(스타일)과 뒷부분(금지 항목)은 일부러 **글자 하나 다르지 않게 똑같이** 맞췄다.
파일럿의 목적 중 하나가 "같은 공장·조명·작업복이 여러 장에서 유지되는지" 확인하는 것이기 때문이다.

---

## P1 — 파일명: `P1_S04A_KF-04A_CLEAN_야간공장-전경`

```text
Style: photoreal cinematic 3D industrial documentary, modern automotive assembly plant interior, 16:9 horizontal, high resolution.
Consistent environment across all scenes: same plant, same polished concrete floor, same exposed steel roof trusses, same cool white overhead lighting with warm accent light from machinery, workers wearing dark navy work uniforms and light gray safety helmets.
Clear foreground, midground and background separation with open space, so the camera can later travel through the scene from a wide view toward the main subject. Keep the main subject clearly readable and the background uncluttered.
No neon, no fantasy energy, no sci-fi hologram aesthetic.

Scene: wide establishing shot of the plant interior at night. Several glass-partitioned work cells line a central aisle, each with a conveyor section and a car body panel. Far in the background, behind a large window, a production control room glows with monitor light. One work cell in the midground is lit with a faint red tint from its own ceiling indicator, subtly different from all other cells which are neutral white. A few workers stand at their stations, small in frame.

Camera: wide angle, eye level, deep perspective down the aisle, clear foreground machinery, midground work cells, background control room window.

No text, no numbers, no letters, no symbols, no dimension lines, no arrows, no callout lines, no charts, no maps, no UI, no HUD, no subtitles, no logos, no watermarks, no infographic glow.
Single continuous scene, not a collage, not a storyboard, not a split screen.
```

## P2 — 파일명: `P2_S04B_KF-04B_CLEAN_사원증-인증`

```text
Style: photoreal cinematic 3D industrial documentary, modern automotive assembly plant interior, 16:9 horizontal, high resolution.
Consistent environment across all scenes: same plant, same polished concrete floor, same exposed steel roof trusses, same cool white overhead lighting with warm accent light from machinery, workers wearing dark navy work uniforms and light gray safety helmets.
Clear foreground, midground and background separation with open space, so the camera can later travel through the scene from a wide view toward the main subject. Keep the main subject clearly readable and the background uncluttered.
No neon, no fantasy energy, no sci-fi hologram aesthetic.

Scene: close-up of a worker's hand holding an ID badge on a lanyard against a wall-mounted card reader beside a heavy steel door. The reader panel glows faintly. The steel door is ajar, and through the gap the production control room is visible with several large monitors casting blue light. The worker's navy uniform sleeve and part of the light gray helmet are in frame. The badge surface is plain with no printed text.

Camera: shallow depth of field, focus on the badge and reader, door gap and control room softly out of focus in the background, room to push in later.

No text, no numbers, no letters, no symbols, no dimension lines, no arrows, no callout lines, no charts, no maps, no UI, no HUD, no subtitles, no logos, no watermarks, no infographic glow.
Single continuous scene, not a collage, not a storyboard, not a split screen.
```

## P3 — 파일명: `P3_S04C_KF-04C_CLEAN_통로-확산`

```text
Style: photoreal cinematic 3D industrial documentary, modern automotive assembly plant interior, 16:9 horizontal, high resolution.
Consistent environment across all scenes: same plant, same polished concrete floor, same exposed steel roof trusses, same cool white overhead lighting with warm accent light from machinery, workers wearing dark navy work uniforms and light gray safety helmets.
Clear foreground, midground and background separation with open space, so the camera can later travel through the scene from a wide view toward the main subject. Keep the main subject clearly readable and the background uncluttered.
No neon, no fantasy energy, no sci-fi hologram aesthetic.

Scene: long central aisle of the plant with identical glass-partitioned work cells on both sides. Red floor indicator light spills out of the nearest work cell onto the aisle, and the next two cells down the aisle are just beginning to take on the same red tint, while cells further away remain neutral white. Conveyor lines run parallel to the aisle. Two workers in the distance continue working, unaware.

Camera: aisle-centered perspective, low eye level, strong leading lines toward the vanishing point, space in front for a tracking move.

No text, no numbers, no letters, no symbols, no dimension lines, no arrows, no callout lines, no charts, no maps, no UI, no HUD, no subtitles, no logos, no watermarks, no infographic glow.
Single continuous scene, not a collage, not a storyboard, not a split screen.
```

## P4 — 파일명: `P4_S05F_KF-05F_CLEAN_전표-반려`

```text
Style: photoreal cinematic 3D industrial documentary, modern automotive assembly plant interior, 16:9 horizontal, high resolution.
Consistent environment across all scenes: same plant, same polished concrete floor, same exposed steel roof trusses, same cool white overhead lighting with warm accent light from machinery, workers wearing dark navy work uniforms and light gray safety helmets.
Clear foreground, midground and background separation with open space, so the camera can later travel through the scene from a wide view toward the main subject. Keep the main subject clearly readable and the background uncluttered.
No neon, no fantasy energy, no sci-fi hologram aesthetic.

Scene: the exit of a single work cell. A quality inspector in a navy uniform and light gray helmet stands at the cell exit with one palm raised, stopping a clipboard with a blank work order sheet that another worker is trying to hand outward. The clipboard is angled back toward the inside of the cell. The ceiling indicator above the exit glows red, casting red light on both figures and the floor. A ceiling-mounted inspection camera is visible above the exit.

Camera: over-the-shoulder from behind the inspector, three-quarter view of both figures, enough space around the figures for a small orbit.

No text, no numbers, no letters, no symbols, no dimension lines, no arrows, no callout lines, no charts, no maps, no UI, no HUD, no subtitles, no logos, no watermarks, no infographic glow.
Single continuous scene, not a collage, not a storyboard, not a split screen.
```

## P5 — 파일명: `P5_S05G_KF-05G_CLEAN_부품-교체`

```text
Style: photoreal cinematic 3D industrial documentary, modern automotive assembly plant interior, 16:9 horizontal, high resolution.
Consistent environment across all scenes: same plant, same polished concrete floor, same exposed steel roof trusses, same cool white overhead lighting with warm accent light from machinery, workers wearing dark navy work uniforms and light gray safety helmets.
Clear foreground, midground and background separation with open space, so the camera can later travel through the scene from a wide view toward the main subject. Keep the main subject clearly readable and the background uncluttered.
No neon, no fantasy energy, no sci-fi hologram aesthetic.

Scene: two identical adjacent work cells separated by a glass partition, each with its own conveyor producing the same car body panel. A short cross conveyor connects the right cell to the left cell's outbound line. On this cross conveyor, a car body panel from the right cell is mid-transfer toward the left outbound line, while the panel originally on the left outbound line is being diverted sideways onto a reject roller. Amber indicator light above the left cell exit.

Camera: side dolly view capturing both cells in one frame, slight high angle so both conveyors are readable.

No text, no numbers, no letters, no symbols, no dimension lines, no arrows, no callout lines, no charts, no maps, no UI, no HUD, no subtitles, no logos, no watermarks, no infographic glow.
Single continuous scene, not a collage, not a storyboard, not a split screen.
```

## P6 — 파일명: `P6_S05H_KF-05H_CLEAN_정상-통과`

```text
Style: photoreal cinematic 3D industrial documentary, modern automotive assembly plant interior, 16:9 horizontal, high resolution.
Consistent environment across all scenes: same plant, same polished concrete floor, same exposed steel roof trusses, same cool white overhead lighting with warm accent light from machinery, workers wearing dark navy work uniforms and light gray safety helmets.
Clear foreground, midground and background separation with open space, so the camera can later travel through the scene from a wide view toward the main subject. Keep the main subject clearly readable and the background uncluttered.
No neon, no fantasy energy, no sci-fi hologram aesthetic.

Scene: the exit of a work cell with a ceiling-mounted inspection camera scanning a car body panel moving on the conveyor. A thin scanning light sweeps across the panel surface as it passes without stopping. The ceiling indicator above the exit glows green, casting soft green light on the conveyor. A quality inspector stands to the side, watching, hands at rest.

Camera: tracking view along the conveyor direction, panel in midground, cell exit framing the shot, space ahead of the panel for forward motion.

No text, no numbers, no letters, no symbols, no dimension lines, no arrows, no callout lines, no charts, no maps, no UI, no HUD, no subtitles, no logos, no watermarks, no infographic glow.
Single continuous scene, not a collage, not a storyboard, not a split screen.
```
