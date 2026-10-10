"""Side-by-side original/new pairs for review. usage: pairs.py out.png scale rel..."""
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw

BASE = str(Path(__file__).resolve().parents[3] / 'assets/images/admin/editor-config') + '/'
out, scale, rels = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
tiles = []
for rel in rels:
    stem, ext = os.path.splitext(rel)
    a = Image.open(BASE + rel).convert('RGB')
    b = Image.open(BASE + stem + '_new' + ext).convert('RGB')
    w, h = a.size
    t = Image.new('RGB', (w * 2 + 6, h + 14), (255, 0, 255))
    t.paste(a, (0, 14))
    t.paste(b, (w + 6, 14))
    d = ImageDraw.Draw(t)
    d.rectangle([0, 0, t.width, 13], fill=(255, 255, 255))
    d.text((2, 1), f'{rel}  {os.path.getsize(BASE + rel)//1024}KB -> {os.path.getsize(BASE + stem + "_new" + ext)//1024}KB', fill=(0, 0, 0))
    tiles.append(t.resize((int(t.width * scale), int(t.height * scale)), Image.NEAREST))
W = 1560
x = y = rowh = 0
pos = []
for t in tiles:
    if x + t.width > W and x > 0:
        x, y, rowh = 0, y + rowh + 8, 0
    pos.append((x, y))
    x += t.width + 12
    rowh = max(rowh, t.height)
sheet = Image.new('RGB', (W, y + rowh), (90, 90, 90))
for t, p in zip(tiles, pos):
    sheet.paste(t, p)
sheet.save(out)
