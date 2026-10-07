# -*- coding: utf-8 -*-
"""시연 실촬영(대시보드 webm)·터미널 클립·자막·TTS_06 음성을 합쳐 ⑥ 단위 mp4를 만든다.
결과는 각 폴더의 <name>_v2.mp4 로 저장 → assemble.py 가 자동으로 최신 버전을 고른다.

  python render/_lib/build_demo.py
"""
import subprocess, textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

LIB = Path(__file__).resolve().parent
ROOT = LIB.parents[1]
SCR = Path(r"C:\Users\UICHEOL\AppData\Local\Temp\claude\D--Capstone-deepmesh-video\4fc4066c-732a-4766-9721-a0da57593b32\scratchpad")
RAW = SCR / "demo_raw"
TMP = SCR / "demo_build"; TMP.mkdir(exist_ok=True)
FF = r"C:\Users\UICHEOL\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin"
FFMPEG = FF + r"\ffmpeg.exe"
GUARD = LIB / "guard_overlay.png"
DEMO = LIB / "guard_logo_only.png"   # 시연 구간: 상단 가드 바 없이 로고만
AUDIO = ROOT / "edit/tts/TTS_06_시연.WAV"
FONT = r"C:\Windows\Fonts\NotoSansKR-Bold.ttf"


def run(args):
    subprocess.run(args, check=True)


def sub_png(text, path):
    """어두운 반투명 박스 + 흰 글씨 (본편 자막과 같은 스타일). 한 줄."""
    f = ImageFont.truetype(FONT, 44)
    dummy = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    tw = dummy.textlength(text, font=f); pad = 26
    W, H = int(tw + pad * 2), 78
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    dr.rounded_rectangle([0, 0, W - 1, H - 1], radius=8, fill=(17, 17, 17, 184))
    dr.text((pad, H / 2), text, font=f, fill=(255, 255, 255, 255), anchor="lm")
    im.save(path)
    return W, H


def dash_part(name, src, ss, dur):
    """대시보드 webm 창을 잘라 1920x1080 + 가드 오버레이 mp4(무음)로."""
    out = TMP / f"{name}_dash.mp4"
    run([FFMPEG, "-y", "-loglevel", "error", "-ss", str(ss), "-t", str(dur), "-i", str(RAW / src),
         "-i", str(DEMO), "-filter_complex",
         "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[b];[b][1:v]overlay=0:0,fps=30[v]",
         "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", str(out)])
    return out



def proof_png(path):
    """F12 개발자 도구 Network 패널 스타일 — 공격자 서버로 나간 실제 요청."""
    from PIL import Image, ImageDraw, ImageFont
    W, H = 1200, 230
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    dr.rounded_rectangle([0, 0, W-1, H-1], radius=12, fill=(24, 26, 32, 240), outline=(90, 96, 108, 255), width=2)
    mono = r"C:\Windows\Fonts\consola.ttf"
    fh = ImageFont.truetype(FONT, 26); fc = ImageFont.truetype(mono, 24) if Path(mono).exists() else ImageFont.truetype(FONT, 22)
    fs = ImageFont.truetype(FONT, 22)
    dr.text((24, 18), "F12 개발자 도구 · Network", font=fh, fill=(220, 224, 232, 255))
    dr.line([24, 60, W-24, 60], fill=(70, 74, 84, 255), width=1)
    cols = [(30, "Name"), (620, "Status"), (760, "Type"), (860, "Initiator")]
    for x, t in cols: dr.text((x, 72), t, font=fs, fill=(140, 146, 158, 255))
    dr.line([24, 104, W-24, 104], fill=(70, 74, 84, 255), width=1)
    row = [(30, "c?SESSION=eyJ1c2VyIjoi...", (255,255,255)), (620, "(failed)", (255,110,110)),
           (760, "img", (200,205,214)), (860, "(index):1", (150,180,235))]
    for x, t, col in row: dr.text((x, 116), t, font=fc, fill=col+(255,))
    dr.text((30, 168), "공격자 서버(attacker.test)로 세션 쿠키가 전송됨", font=fs, fill=(255,120,120,255))
    im.save(path); return W, H


def browser_part(name, src, dur, panel_from):
    """실제 브라우저 webm + 가드 + 쿠키 유출 증거 패널(panel_from초부터). dur 로 맞춤(모자라면 마지막 프레임 유지)."""
    pp = TMP / f"{name}_proof.png"; pw, ph = proof_png(pp)
    out = TMP / f"{name}_browser.mp4"
    px = int((1920 - pw) / 2); py = 96
    run([FFMPEG, "-y", "-loglevel", "error", "-i", str(RAW / src), "-i", str(GUARD), "-i", str(pp),
         "-filter_complex",
         f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,"
         f"tpad=stop_mode=clone:stop_duration=6,trim=0:{dur},setpts=PTS-STARTPTS[b];"
         f"[b][1:v]overlay=0:0[c];"
         f"[c][2:v]overlay={px}:{py}:enable='gte(t,{panel_from})',fps=30[v]",
         "-map", "[v]", "-an", "-t", str(dur),
         "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", str(out)])
    return out



def _caption_banner(dr, cx, top, text, w_pad=20, h=56):
    """빨간 배너(텍스트 수직 가운데). cx=중심x, top=배너 상단y. 반환: 배너 하단y."""
    from PIL import ImageFont
    f=ImageFont.truetype(FONT,34); tw=dr.textlength(text,font=f)
    x0=cx-tw/2-w_pad; x1=cx+tw/2+w_pad
    dr.rounded_rectangle([x0,top,x1,top+h],radius=8,fill=(220,38,38))
    dr.text((cx,top+h/2),text,font=f,fill=(255,255,255),anchor="mm")
    return top+h

def _draw_lines(dr, x, cy, lines, lh=44):
    """side 텍스트. '#'=굵은 헤더(짙은 파랑), '>'=빨강, 그 외=본문. cy=세로 중앙."""
    from PIL import ImageFont
    fb=ImageFont.truetype(FONT,31); fh=ImageFont.truetype(FONT,34); fr=ImageFont.truetype(FONT,33)
    total=len(lines)*lh; y=cy-total/2
    for ln in lines:
        if ln.startswith('#'): dr.text((x,y),ln[1:],font=fh,fill=(0,91,170))
        elif ln.startswith('>'): dr.text((x,y),ln[1:],font=fr,fill=(220,38,38))
        elif ln: dr.text((x,y),ln,font=fb,fill=(45,55,72))
        y+=lh

def image_part(name, src, dur, fit_w=1720, fit_h=780, mode="center", boxes=None,
               top_caption=None, side_lines=None, oy_fixed=None, raise_px=90, gap=70, overlay=None):
    """정지 이미지를 흰 배경에 배치. overlay=GUARD 면 상단 파란 가드 바, 기본(DEMO)은 로고만.
    (대시보드가 아닌 캡처·설명 화면은 overlay=GUARD 로 상단 가드를 넣는다.)
    mode='center': 이미지 가로 중앙, top_caption은 이미지 위 여백에 배너.
    mode='group': 이미지+오른쪽 side_lines 를 한 덩어리로 가로 중앙 정렬."""
    from PIL import Image, ImageDraw, ImageFont
    im = Image.open(src); iw, ih = im.size
    sc = min(fit_w/iw, fit_h/ih); dw, dh = int(iw*sc), int(ih*sc)
    oy = oy_fixed if oy_fixed is not None else max(60, (1080 - dh)//2 - raise_px)
    bg = Image.new("RGB", (1920,1080), (255,255,255)); dr = ImageDraw.Draw(bg)
    if mode == "group" and side_lines:
        fb=ImageFont.truetype(FONT,31); fh=ImageFont.truetype(FONT,34)
        tw=max((dr.textlength(l[1:] if l[:1] in '#>' else l, font=(fh if l.startswith('#') else fb)) for l in side_lines if l), default=0)
        gw=dw+gap+tw; ox=int((1920-gw)/2)
        bg.paste(im.convert("RGB").resize((dw,dh)),(ox,oy))
        _draw_lines(dr, ox+dw+gap, oy+dh/2, side_lines)
    else:
        ox=(1920-dw)//2
        bg.paste(im.convert("RGB").resize((dw,dh)),(ox,oy))
    for (bx,by,bw,bh) in (boxes or []):
        x0=ox+int(bx*sc); y0=oy+int(by*sc); x1=ox+int((bx+bw)*sc); y1=oy+int((by+bh)*sc)
        for w in range(5): dr.rectangle([x0-w,y0-w,x1+w,y1+w], outline=(220,38,38))
    if top_caption:
        _caption_banner(dr, ox+dw/2 if mode!="group" else 960, max(18, oy-70), top_caption)
    canvas = TMP / f"{name}_base.png"; bg.save(canvas)
    out = TMP / f"{name}_img.mp4"
    run([FFMPEG, "-y", "-loglevel", "error", "-loop", "1", "-t", str(dur), "-i", str(canvas), "-i", str(overlay or DEMO),
         "-filter_complex", "[0:v]scale=1920:1080,fps=30[z];[z][1:v]overlay=0:0[v]", "-map", "[v]", "-t", str(dur),
         "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", str(out)])
    return out

def xfade_two(name, a, b, da, db, xf=0.5):
    """두 정지/영상 클립을 xf초 디졸브로 잇는다. da/db=각 클립 길이. 반환 mp4(길이 da+db-xf)."""
    out = TMP / f"{name}_xf.mp4"
    run([FFMPEG, "-y", "-loglevel", "error", "-i", str(a), "-i", str(b), "-filter_complex",
         f"[0:v][1:v]xfade=transition=fade:duration={xf}:offset={da-xf:.3f},fps=30[v]",
         "-map", "[v]", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", str(out)])
    return out

def concat(parts, out):
    lst = TMP / (out.stem + "_list.txt")
    lst.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
    run([FFMPEG, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
         "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", "30", str(out)])


def finalize(name, folder, video, subs, astart, adur):
    """video(무음) 위에 자막 PNG 오버레이 + TTS_06 음성 슬라이스 → 최종 mp4."""
    pngs, filt, inp = [], "", ["-i", str(video)]
    base = "[0:v]"
    for i, (t0, t1, txt) in enumerate(subs):
        p = TMP / f"{name}_s{i}.png"; w, h = sub_png(txt, p)
        inp += ["-i", str(p)]
        x = int((1920 - w) / 2); y = 1002 - h
        nxt = f"[v{i}]"
        filt += f"{base}[{i+1}:v]overlay={x}:{y}:enable='between(t,{t0},{t1})'{nxt};"
        base = nxt
    aidx = len(subs) + 1
    inp += ["-ss", str(astart), "-t", str(adur), "-i", str(AUDIO)]   # audio = 마지막 입력
    filt = filt.rstrip(";")
    out = ROOT / "render" / folder / f"{folder}_v3.mp4"
    run([FFMPEG, "-y", "-loglevel", "error", *inp, "-filter_complex", filt,
         "-map", base, "-map", f"{aidx}:a", "-c:v", "libx264", "-crf", "18", "-preset", "medium",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-t", str(adur), str(out)])
    print("완료:", out)


SUBS_A = [(0.28,4.90,"그럼 이제 이상 트래픽이 정말 막히는지 실제 시스템에서 확인해보겠습니다."),
          (5.38,9.92,"버추얼머신 네 대로 쿠버네티스 클러스터를 세우고 저희 게시판을 올렸습니다."),
          (10.44,12.75,"네 개의 서비스가 각각 pod로 돌아가고,"),
          (13.06,15.84,"모든 pod에는 사이드카 프록시가 붙어 있습니다."),
          (16.35,20.31,"이 화면은 관리자가 전체 클러스터 현황을 볼 수 있는 대시보드입니다."),
          (20.85,23.22,"지금은 정상적인 트래픽 부하를 주고 있고,"),
          (23.53,27.33,"트래픽이 모두 초록색 포워드 간선으로 보이는 것을 확인할 수 있습니다.")]
SUBS_B = [(0.82,2.86,"먼저 사이드카 프록시를 끈 상태입니다."),
          (3.50,6.16,"auth는 평소 API 서버를 호출할 일이 없지만,"),
          (6.52,10.77,"감시하는 장치가 없으면 이 요청은 그대로 API 서버까지 도달합니다."),
          (11.84,13.58,"이제 사이드카 프록시를 켭니다."),
          (14.38,16.53,"auth pod가 한 번도 보낸 적 없는 방향,"),
          (16.83,18.87,"즉 API 서버로 나가는 요청을"),
          (19.12,21.04,"곧바로 이상 트래픽으로 잡아냅니다."),
          (21.85,23.49,"대시보드에 빨간 drop이 뜨고,"),
          (23.77,25.99,"요청은 API 서버에 닿지 못합니다.")]
SUBS_C = [(0.89,2.63,"사이드카 프록시가 꺼져 있으면,"),
          (2.99,5.58,"변조된 화면이 그대로 사용자에게 전달되고"),
          (5.58,8.22,"스크립트가 사용자 브라우저에서 실행됩니다."),
          (8.68,10.71,"사용자는 아무것도 모른 채 당합니다."),
          (11.89,13.36,"사이드카 프록시를 켜면,"),
          (13.61,16.59,"frontend의 응답이 평소와 다르다는 걸 탐지합니다."),
          (17.27,20.03,"그리고 똑같이 떠 있는 두 번째 replica에"),
          (20.03,21.98,"같은 화면을 요청해 비교하고,"),
          (21.98,24.66,"변조된 쪽 대신 정상 응답을 내보냅니다."),
          (25.49,27.98,"대시보드에는 주황색 relay가 뜨고,"),
          (27.98,31.58,"사용자에게는 스크립트가 빠진 정상 화면이 표시됩니다.")]

# 06a — 대시보드 정상 (28.1s)
a = dash_part("06a", "normal.webm", 8.0, 28.1)
finalize("06a", "06a_normal", a, SUBS_A, 0.0, 28.1)

# 06b — k1 리포트(OFF): 리포트 왼쪽 축소 + 오른쪽 설명(SA/RBAC) + drop(ON) (27.17s)
b_off = image_part("06b", str(ROOT/"capture/k1-off-report.jpeg"), 11.6, fit_w=1150, fit_h=820, mode="group",
                   overlay=GUARD,
                   boxes=[(24, 280, 380, 30), (8, 398, 515, 292)],
                   side_lines=["#어떻게 조회하나",
                               "탈취한 pod의 ServiceAccount 토큰으로",
                               "쿠버네티스 API 서버에 인증한다.",
                               "",
                               "#빨간 박스의 의미",
                               "위: /version 요청이 200으로 성공",
                               "아래: 반환된 클러스터 버전 정보",
                               "",
                               "#공격이 어떻게 확장되나",
                               "클러스터 구조를 파악해",
                               ">다음 공격 대상을 넓혀 간다"])
b_dash = dash_part("06b", "k1_on.webm", 18.0, 15.57)
b_all = TMP / "06b_all.mp4"; concat([b_off, b_dash], b_all)
finalize("06b", "06b_k1demo", b_all, SUBS_B, 40.9, 27.17)

# 06c — OFF: HTML(변조 강조)→네트워크(요청 강조) / ON: 대시보드 relay→정상·변조 HTML 비교 (31.95s)
c_html = image_part("06c_h", str(ROOT/"capture/r1_html_tampered.png"), 5.8, fit_w=1560, fit_h=680,
                    mode="center", top_caption="frontend 응답에 XSS 스크립트가 주입됨", oy_fixed=170, overlay=GUARD)
c_net = image_part("06c_n", str(ROOT/"capture/r1-off-네트워크.png"), 5.9, fit_w=1560, fit_h=720,
                   mode="center", boxes=[(1385, 588, 285, 44), (1975, 566, 430, 50)],
                   top_caption="실행되어 attacker.test로 요청 발생 = XSS 실행", oy_fixed=180, overlay=GUARD)
c_dash = dash_part("06c", "r1_on.webm", 17.0, 17.2)   # 전환 디졸브(0.4×3)로 줄어든 만큼 길이 보정
c_cmp = image_part("06c_c", str(ROOT/"capture/r1_html_compare.png"), 4.25, mode="center", fit_h=850, oy_fixed=40, overlay=GUARD)
# 화면 전환을 디졸브로 부드럽게: html→net(악성 스크립트 한 줄이 fade out)→대시보드→비교. 총 길이 31.95 유지.
s1 = xfade_two("06c_s1", c_html, c_net, 5.8, 5.9, xf=0.4)      # -> 11.3
s2 = xfade_two("06c_s2", s1, c_dash, 11.3, 17.2, xf=0.4)       # -> 28.1
c_all = xfade_two("06c_all", s2, c_cmp, 28.1, 4.25, xf=0.4)    # -> 31.95
finalize("06c", "06c_r1demo", c_all, SUBS_C, 81.57, 31.95)
