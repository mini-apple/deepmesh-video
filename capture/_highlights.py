# -*- coding: utf-8 -*-
"""캡처 이미지 위에 형광펜을 그을 문구의 정확한 위치(줄 단위 사각형)를 계산해 _highlights.json 에 저장한다.
C2: PDF 글자 좌표(pypdfium2)  /  C4: 브라우저 Range 좌표(Playwright)
또 ②에서 쓸 C1 머리 부분 잘라내기(C1_head.png)를 만든다."""
import json, re
from pathlib import Path
import pypdfium2 as pdfium
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
META = json.loads((HERE / "_capture_meta.json").read_text(encoding="utf-8"))
OUT = {}


def line_rects(boxes):
    """글자 박스들을 같은 줄끼리 묶어 줄마다 하나의 사각형으로."""
    lines = []
    for b in boxes:
        for L in lines:
            if abs(L["cy"] - (b[1] + b[3]) / 2) < (b[3] - b[1]) * 0.6:
                L["b"].append(b); break
        else:
            lines.append({"cy": (b[1] + b[3]) / 2, "b": [b]})
    return [[min(x[0] for x in L["b"]), min(x[1] for x in L["b"]), max(x[2] for x in L["b"]), max(x[3] for x in L["b"])] for L in lines]


# ── C2 (PDF) ──
m = META["C2_anthropic_8090"]
doc = pdfium.PdfDocument(str(HERE / "_src" / "anthropic_ai_espionage_report.pdf"))
page = doc[m["pdf_page_index"]]; tp = page.get_textpage(); txt = tp.get_text_range()
W_, H_ = page.get_size(); S = 3
crop_top = max(0, m["key_bbox_px_scale3"][1] - 520)
anchor = txt.index("This campaign demonstrated")
res = {}
for label, phrase in [("lateral", "lateral movement"), ("8090", "80-90% of tactical operations independently")]:
    pat = re.compile(r"\s+".join(map(re.escape, phrase.split())))
    mm = pat.search(txt, anchor)
    boxes = []
    for i in range(mm.start(), mm.end()):
        l, b, r, t = tp.get_charbox(i)
        if r - l < 0.1: continue
        boxes.append([l * S, (H_ - t) * S - crop_top, r * S, (H_ - b) * S - crop_top])
    res[label] = line_rects(boxes)
OUT["C2_anthropic_8090_crop.png"] = {"size": Image.open(HERE / "C2_anthropic_8090_crop.png").size, "rects": res}

# ── C4 (웹) ──
JS = """(phrases) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node, host = null;
  while ((node = walker.nextNode())) { if (node.textContent.includes('After one month')) { host = node.parentElement; break; } }
  host.scrollIntoView({block: 'center'});
  const hb = host.getBoundingClientRect();
  const full = host.innerText;
  const out = {box: [hb.left, hb.top, hb.right, hb.bottom], rects: {}};
  const tw = document.createTreeWalker(host, NodeFilter.SHOW_TEXT); const nodes = []; let n; while ((n = tw.nextNode())) nodes.push(n);
  for (const [label, ph] of phrases) {
    for (const t of nodes) {
      const i = t.textContent.indexOf(ph); if (i < 0) continue;
      const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + ph.length);
      out.rects[label] = Array.from(r.getClientRects()).map(q => [q.left - hb.left, q.top - hb.top, q.right - hb.left, q.bottom - hb.top]);
      break;
    }
  }
  return out;
}"""
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1.5).new_page()
    pg.goto(META["C4_glasswing_10000"]["url"], wait_until="networkidle", timeout=60000)
    pg.add_style_tag(content='[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i]{display:none!important}')
    pg.wait_for_timeout(1200)
    r = pg.evaluate(JS, [["month", "After one month"], ["tenk", "more than ten thousand"]])
    x0, y0, x1, y1 = r["box"]
    pg.screenshot(path=str(HERE / "C4_glasswing_10000_crop.png"), clip={"x": x0, "y": y0, "width": x1 - x0, "height": y1 - y0})
    b.close()
DSF = 1.5
OUT["C4_glasswing_10000_crop.png"] = {"size": Image.open(HERE / "C4_glasswing_10000_crop.png").size,
                                     "rects": {k: [[v * DSF for v in q] for q in qs] for k, qs in r["rects"].items()}}

# ── C1 머리 부분 (분류 · 제목 · 날짜) ──
v = Image.open(HERE / "C1_anthropic_headline_view.png")
head = v.crop((int(v.width * 0.18), int(v.height * 0.06), int(v.width * 0.82), int(v.height * 0.40)))
head.save(HERE / "C1_head.png")
OUT["C1_head.png"] = {"size": head.size, "rects": {}}

(HERE / "_highlights.json").write_text(json.dumps(OUT, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(OUT, ensure_ascii=False)[:900])
