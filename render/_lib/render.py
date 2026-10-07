# -*- coding: utf-8 -*-
"""렌더 단위 하나를 MP4로 만든다.

  python render/_lib/render.py render/01_hook                 # 전체 렌더 (음성 포함)
  python render/_lib/render.py render/01_hook --stills 1 6.5  # 정지 화면만 (unit 폴더에 still_*.png)

unit 폴더에는 scene.js 와 unit.json 이 있어야 한다.
unit.json: {"audio": "edit/tts/TTS_01_훅.WAV", "start": 0.0, "duration": 19.0, "out": "01_hook_v1.mp4"}
"""
import argparse, json, subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

LIB = Path(__file__).resolve().parent
ROOT = LIB.parents[1]
FFMPEG = r"C:\Users\UICHEOL\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe"
FPS = 30


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("unit")
    ap.add_argument("--stills", nargs="*", type=float)
    a = ap.parse_args()
    unit = Path(a.unit).resolve()
    cfg = json.loads((unit / "unit.json").read_text(encoding="utf-8"))
    rel = "../" + unit.name
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(args=["--allow-file-access-from-files"])
        except Exception:
            browser = p.chromium.launch(channel="msedge", args=["--allow-file-access-from-files"])
        page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        page.goto((LIB / "frame.html").as_uri() + "?unit=" + rel)
        page.wait_for_function("window.ready === true || window.loadError", timeout=30000)
        err = page.evaluate("window.loadError || null")
        if err:
            sys.exit("load error: " + err)
        if a.stills:
            for t in a.stills:
                page.evaluate(f"draw({t})")
                page.screenshot(path=str(unit / f"still_{t:05.2f}.png"))
            browser.close()
            return
        dur, n = cfg["duration"], round(cfg["duration"] * FPS)
        out = unit / cfg["out"]
        cmd = [FFMPEG, "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-i", "-"]
        if cfg.get("audio"):
            cmd += ["-ss", str(cfg.get("start", 0)), "-t", str(dur), "-i", str(ROOT / cfg["audio"]),
                    "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-af", "apad"]
        cmd += ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-t", str(dur), str(out)]
        ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for i in range(n):
            page.evaluate(f"draw({i / FPS})")
            ff.stdin.write(page.screenshot(type="png"))
            if i % 150 == 0:
                print(f"  {i}/{n}", flush=True)
        ff.stdin.close(); ff.wait(); browser.close()
        print("완료:", out)


if __name__ == "__main__":
    main()
