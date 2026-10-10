"""Contact sheet of every frame of a GIF, with the tracked mouse position.

usage: sheet.py image.gif out.png [scale] [track.json]
Each frame is labeled with its index, duration and, with a track, the cursor
kind and position (a red cross) and CLICK for frames with a click mark.
"""
import json
import sys

from PIL import Image, ImageDraw, ImageSequence

src, out = sys.argv[1], sys.argv[2]
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
track = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else None

frames = [(f.convert('RGB').copy(), f.info.get('duration', 0)) for f in ImageSequence.Iterator(Image.open(src))]
w, h = frames[0][0].size
w2, h2 = int(w * scale), int(h * scale)
cols = max(1, min(len(frames), 1500 // (w2 + 6)))
rows = (len(frames) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w2 + 6), rows * (h2 + 20)), (255, 0, 255))
d = ImageDraw.Draw(sheet)
for i, (f, dur) in enumerate(frames):
    x0, y0 = (i % cols) * (w2 + 6), (i // cols) * (h2 + 20)
    label = f'#{i} {dur}ms'
    r = track[i] if track else None
    if r:
        label += f" {r.get('kind')} ({r['x']},{r['y']})" + (' CLICK' if 'click' in r else '')
    d.rectangle([x0, y0, x0 + w2, y0 + 14], fill=(255, 255, 255))
    d.text((x0 + 2, y0 + 1), label, fill=(200, 0, 0) if r and 'click' in r else (0, 0, 0))
    sheet.paste(f.resize((w2, h2), Image.NEAREST), (x0, y0 + 14))
    if r:
        cx, cy = x0 + r['x'] * scale, y0 + 14 + r['y'] * scale
        d.line([cx - 5, cy, cx + 5, cy], fill=(255, 0, 0))
        d.line([cx, cy - 5, cx, cy + 5], fill=(255, 0, 0))
sheet.save(out)
print(f'{src}: {w}x{h}, {len(frames)} frames, {sum(dur for _, dur in frames)}ms')
