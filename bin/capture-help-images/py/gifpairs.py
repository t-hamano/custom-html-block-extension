"""Frame-by-frame original/new pairs of a GIF. usage: gifpairs.py out.png rel [scale] [step]"""
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageSequence

BASE = str(Path(__file__).resolve().parents[3] / 'assets/images/admin/editor-config') + '/'
out, rel = sys.argv[1], sys.argv[2]
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
step = int(sys.argv[4]) if len(sys.argv) > 4 else 1
stem, ext = os.path.splitext(rel)


def frames(p):
    im = Image.open(p)
    res, t = [], 0
    for f in ImageSequence.Iterator(im):
        d = f.info.get('duration', 0)
        res.append((t, f.convert('RGB').copy(), d))
        t += d
    return res


a, b = frames(BASE + rel), frames(BASE + stem + '_new' + ext)
# Pillow merges identical consecutive frames, so match the new frames by time.
def at(fr, t):
    cur = fr[0][1]
    for ft, img, _ in fr:
        if ft <= t:
            cur = img
    return cur

w, h = a[0][1].size
w2, h2 = int(w * scale), int(h * scale)
idx = list(range(0, len(a), step))
cols = max(1, 1560 // (2 * w2 + 16))
rows = (len(idx) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (2 * w2 + 16), rows * (h2 + 16)), (90, 90, 90))
d = ImageDraw.Draw(sheet)
for k, i in enumerate(idx):
    t, img, dur = a[i]
    x0, y0 = (k % cols) * (2 * w2 + 16), (k // cols) * (h2 + 16)
    d.text((x0 + 2, y0 + 2), f'#{i} {t}ms +{dur}', fill=(255, 255, 255))
    sheet.paste(img.resize((w2, h2), Image.NEAREST), (x0, y0 + 14))
    sheet.paste(at(b, t + 1).resize((w2, h2), Image.NEAREST), (x0 + w2 + 4, y0 + 14))
sheet.save(out)
print(f'{rel}: {os.path.getsize(BASE + rel)//1024}KB -> {os.path.getsize(BASE + stem + "_new" + ext)//1024}KB, frames {len(a)} -> {len(b)}')
