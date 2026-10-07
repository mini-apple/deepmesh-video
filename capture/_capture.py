# -*- coding: utf-8 -*-
"""② 에 쓸 기사·보고서 캡처 (CAPTURE_LIST.md C1~C5).

웹 페이지: 1920×1080 화면 전체 + 핵심 문장 블록 확대 캡처, 핵심 문장 위치(bbox)를 JSON으로 기록.
PDF: 해당 쪽을 고해상도로 렌더링하고 핵심 문장 주변을 잘라 저장.
쿠키 배너는 동의하지 않고 CSS로 숨긴다.
"""
import json, re, sys, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright
import pypdfium2 as pdfium

HERE = Path(__file__).resolve().parent
SRC = HERE / "_src"; SRC.mkdir(exist_ok=True)
META = {}

HIDE_CSS = """
[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],
#onetrust-banner-sdk,#onetrust-consent-sdk,.osano-cm-window,[aria-label*="cookie" i]{display:none!important}
"""

WEB = [
    ("C1_anthropic_headline", "https://www.anthropic.com/news/disrupting-AI-espionage", r"Disrupting the first reported AI-orchestrated"),
    ("C3_lateral_movement", "https://www.lowenstein.com/news-insights/publications/client-alerts/anthropic-reports-first-known-ai-orchestrated-cyber-espionage-campaign-raising-stakes-for-data-security-data-privacy", r"lateral movement"),
    ("C4_glasswing_10000", "https://www.anthropic.com/research/glasswing-initial-update", r"After one month"),
]

PDF = [
    ("C2_anthropic_8090", "https://assets.anthropic.com/m/ec212e6566a0d47/original/Disrupting-the-first-reported-AI-orchestrated-cyber-espionage-campaign.pdf",
     SRC / "anthropic_ai_espionage_report.pdf", [r"80.{0,3}90"]),
    ("C5_gcloud_threat", None,
     Path(r"C:\Users\UICHEOL\.claude\projects\D--Capstone-deepmesh-video\6f816502-635e-4f42-963b-707538d29d82\tool-results\webfetch-1789739919516-s01hp4.pdf"),
     [r"Distribution of Initial Access Vectors", r"44\.5%"]),
]


def capture_web(p):
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1.5,
                              locale="en-US", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36")
    for name, url, key in WEB:
        page = ctx.new_page()
        try:
            page.goto(url, wait_until="networkidle", timeout=60000)
        except Exception as e:
            print("  load warn", name, e)
        page.add_style_tag(content=HIDE_CSS)
        page.wait_for_timeout(1500)
        page.screenshot(path=str(HERE / f"{name}_page.png"))
        loc = page.get_by_text(re.compile(key, re.I)).first
        try:
            loc.scroll_into_view_if_needed(timeout=10000)
            page.wait_for_timeout(600)
            block = loc.locator("xpath=ancestor-or-self::*[self::p or self::h1 or self::h2 or self::li or self::div][1]")
            block.screenshot(path=str(HERE / f"{name}_crop.png"))
            page.screenshot(path=str(HERE / f"{name}_view.png"))
            META[name] = {"url": url, "key": key, "key_bbox_in_view": loc.bounding_box(), "block_bbox_in_view": block.bounding_box()}
            print("  ok", name)
        except Exception as e:
            META[name] = {"url": url, "key": key, "error": str(e)}
            print("  key not found", name, e)
        page.close()
    browser.close()


def capture_pdf():
    for name, url, path, keys in PDF:
        if url and not path.exists():
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            path.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        doc = pdfium.PdfDocument(str(path))
        hit = None
        for k in keys:
            for i in range(len(doc)):
                txt = doc[i].get_textpage().get_text_range()
                m = re.search(k, txt)
                if m:
                    hit = (i, k, m.start(), m.end() - m.start()); break
            if hit: break
        if not hit:
            print("  pdf key not found", name); continue
        i, k, start, n = hit
        page = doc[i]
        scale = 3
        img = page.render(scale=scale).to_pil()
        img.save(HERE / f"{name}_page.png")
        tp = page.get_textpage()
        boxes = [tp.get_charbox(start + j) for j in range(n)]
        l = min(b[0] for b in boxes); r = max(b[2] for b in boxes); b_ = min(b[1] for b in boxes); t = max(b[3] for b in boxes)
        W, H = page.get_size()
        bbox = [l * scale, (H - t) * scale, r * scale, (H - b_) * scale]           # 좌상단 원점 픽셀
        pad_y = 520
        crop = img.crop((0, max(0, bbox[1] - pad_y), img.width, min(img.height, bbox[3] + pad_y)))
        crop.save(HERE / f"{name}_crop.png")
        META[name] = {"url": url or "local copy of Google Cloud Threat Horizons Report H1 2026 PDF", "pdf_page_index": i, "print_page": i + 1,
                      "key": k, "key_bbox_px_scale3": bbox, "page_px": [img.width, img.height]}
        print("  ok", name, "page", i + 1)


if __name__ == "__main__":
    only = set(sys.argv[1:])
    if only:
        WEB[:] = [w for w in WEB if w[0] in only]
        PDF[:] = [x for x in PDF if x[0] in only]
        old = HERE / "_capture_meta.json"
        if old.exists(): META.update(json.loads(old.read_text(encoding="utf-8")))
    with sync_playwright() as p:
        capture_web(p)
    capture_pdf()
    (HERE / "_capture_meta.json").write_text(json.dumps(META, ensure_ascii=False, indent=2), encoding="utf-8")
    print("done")
