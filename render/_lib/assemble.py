# -*- coding: utf-8 -*-
"""렌더 단위들을 하나의 영상으로 잇는다.

  python render/_lib/assemble.py              → edit/DeepMesh_full_preview.mp4

- 각 단위 폴더에서 가장 높은 버전(_vN.mp4)을 자동으로 고른다.
- 화면은 xfade(기본 0.5초 디졸브)로 잇는다. 소리는 겹쳐 흐리지 않고 각 단위 음성을 제자리에 놓는다
  (단위 끝에 0.3초 이상 무음 꼬리가 있어 겹치는 구간에 말소리가 없다).
- 큰 장면 전환에는 합성 효과음 whoosh.wav 를 작게 깐다.
- ⑥ 시연 녹화가 아직 없으면 회색 자리표시 화면을 넣는다 (SEGMENTS 의 'hold').
"""
import json, re, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

LIB = Path(__file__).resolve().parent
ROOT = LIB.parents[1]
FF = r"C:\Users\UICHEOL\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin"
FFMPEG, FFPROBE = FF + r"\ffmpeg.exe", FF + r"\ffprobe.exe"
WHOOSH = LIB / "sfx" / "whoosh.wav"
OUT = ROOT / "edit" / "DeepMesh_full_preview.mp4"

# (종류, 대상, 다음 단위로 넘어가는 전환 초, 전환에 휙 소리)
SEGMENTS = [
    ("unit", "01_hook", 0.5, True),
    ("unit", "02_why", 0.5, True),
    ("unit", "03_basics", 0.5, True),
    ("unit", "04_lateral", 0.5, True),
    ("unit", "05_how", 0.5, True),
    ("unit", "06a_normal", 0.3, False),       # ⑥ 시연 자리표시 (녹화 후 실제 영상으로 교체)
    ("unit", "06_k1", 0.3, False),
    ("unit", "06b_k1demo", 0.3, False),
    ("unit", "06_r1", 0.3, False),
    ("unit", "06c_r1demo", 0.5, True),
    ("unit", "07_result", 0.3, False),
    ("unit", "08_ending", 0.15, False),
    ("unit", "09_outro", 0, False),
]
# 구간이 바뀔 때 숨 쉴 틈: 단위 끝 화면을 멈춘 채 무음을 덧붙이는 초 (말소리 꼬리가 짧은 단위만)
PAD = {"02_why": 0.4, "03_basics": 0.5, "04_lateral": 0.4, "05_how": 0.4, "06c_r1demo": 0.9, "07_result": 0.4}
HOLD_SEC = 3.0


def latest(unit):
    d = ROOT / "render" / unit
    vs = sorted(d.glob(f"{unit}_v*.mp4"), key=lambda p: int(re.search(r"_v(\d+)\.mp4$", p.name).group(1)))
    for v in reversed(vs):              # 렌더 중이라 아직 읽을 수 없는 파일은 건너뛴다
        if dur(v) > 0: return v
    sys.exit(f"영상 없음: {d}")


def dur(p):
    r = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "json", str(p)], capture_output=True, text=True)
    try: return float(json.loads(r.stdout)["format"]["duration"])
    except (KeyError, ValueError): return 0.0


def hold_clip(label, i):
    """시연 자리표시: 회색 화면 + 안내 글씨 (소리 없음)."""
    png = ROOT / "edit" / f"_hold_{i}.png"; mp4 = ROOT / "edit" / f"_hold_{i}.mp4"
    im = Image.new("RGB", (1920, 1080), (228, 231, 236)); dr = ImageDraw.Draw(im)
    f = ImageFont.truetype(r"C:\Windows\Fonts\NotoSansKR-Bold.ttf", 56)
    w = dr.textlength(label, font=f); dr.text(((1920 - w) / 2, 500), label, font=f, fill=(90, 98, 112))
    im.save(png)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-loop", "1", "-i", str(png), "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                    "-t", str(HOLD_SEC), "-r", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(mp4)], check=True)
    return mp4


def main():
    (ROOT / "edit").mkdir(exist_ok=True)
    clips = []
    for i, (kind, target, xd, wh) in enumerate(SEGMENTS):
        p = latest(target) if kind == "unit" else hold_clip(target, i)
        pad = PAD.get(target, 0.0) if kind == "unit" else 0.0
        clips.append((p, dur(p) + pad, xd, wh, pad))
        print(f"{p.relative_to(ROOT)}  {clips[-1][1]:.2f}s")

    inputs, vf, af, t = [], [], [], 0.0
    for p, d, _, _, _ in clips: inputs += ["-i", str(p)]
    n = len(clips)
    # 화면: xfade 사슬
    offsets = []
    for i, c in enumerate(clips):             # 끝 멈춤(PAD)
        vf.append(f"[{i}:v]tpad=stop_mode=clone:stop_duration={c[4]}[p{i}]" if c[4] else f"[{i}:v]null[p{i}]")
    prev = "[p0]"
    for i in range(1, n):
        xd = clips[i-1][2]
        t += clips[i-1][1] - xd
        offsets.append((t, xd, clips[i-1][3]))
        lab = f"[v{i}]"
        if xd > 0:
            vf.append(f"{prev}[p{i}]xfade=transition=fade:duration={xd}:offset={t:.3f}{lab}")
        else:
            vf.append(f"{prev}[p{i}]concat=n=2:v=1:a=0{lab}")
        prev = lab
    total = t + clips[-1][1]
    # 소리: 각 단위 음성을 시작 위치에 놓고 합침
    starts = [0.0] + [o[0] for o in offsets]
    for i, s in enumerate(starts):
        af.append(f"[{i}:a]aresample=44100,adelay={int(s*1000)}|{int(s*1000)}[a{i}]")
    mix = "".join(f"[a{i}]" for i in range(n))
    wh_idx = n
    extra = []
    k = 0
    for (s, xd, wh) in offsets:
        if not wh: continue
        extra += ["-i", str(WHOOSH)]
        af.append(f"[{wh_idx}:a]adelay={int(max(0, s - 0.05)*1000)}|{int(max(0, s - 0.05)*1000)}[w{k}]")
        mix += f"[w{k}]"; wh_idx += 1; k += 1
    af.append(f"{mix}amix=inputs={n + k}:normalize=0:dropout_transition=0,alimiter=limit=0.94:level=disabled,atrim=0:{total:.3f}[aout]")
    fc = ";".join(vf + af)
    cmd = [FFMPEG, "-y", "-loglevel", "error"] + inputs + extra + ["-filter_complex", fc, "-map", prev, "-map", "[aout]",
           "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", str(OUT)]
    subprocess.run(cmd, check=True)
    print(f"완료: {OUT}  ({total:.1f}s = {int(total//60)}분 {total%60:.1f}초)")


if __name__ == "__main__":
    main()
