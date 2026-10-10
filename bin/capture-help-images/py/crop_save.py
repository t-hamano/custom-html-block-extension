"""Crop a screenshot and save it as JPEG (or PNG), optionally drawing annotations.

usage: crop_save.py src.png x,y,w,h out.(jpg|png) [annotations.json]
annotations.json: [{"type": "arrow-up", "tip": [x, y], ...}]
"""
import json
import math
import os
import sys

from PIL import Image, ImageDraw

src, box, out = sys.argv[1], sys.argv[2], sys.argv[3]
x, y, w, h = map(int, box.split(','))
im = Image.open(src).convert('RGB').crop((x, y, x + w, y + h))

if len(sys.argv) > 4:
    SS = 4  # draw supersampled for smooth edges
    for a in json.loads(open(sys.argv[4]).read()):
        if a['type'] == 'arrow':
            # Red arrow with a black outline. The shape points along +x and is
            # rotated to `angle` (degrees, the direction it points to).
            hw, hh, sw, L = a['headHalfWidth'], a['headHeight'], a['shaftHalfWidth'], a['length']
            shape = [(0, 0), (-hh, hw), (-hh, sw), (-L, sw), (-L, -sw), (-hh, -sw), (-hh, -hw)]
            t = math.radians(a['angle'])
            tx, ty = a['tip']
            pts = [((tx + u * math.cos(t) - v * math.sin(t)) * SS, (ty + u * math.sin(t) + v * math.cos(t)) * SS) for u, v in shape]
            layer = Image.new('RGBA', (w * SS, h * SS), (0, 0, 0, 0))
            d = ImageDraw.Draw(layer)
            d.polygon(pts, fill=tuple(a.get('fill', [214, 54, 56, 255])), outline=tuple(a.get('stroke', [0, 0, 0, 255])), width=SS)
            layer = layer.resize((w, h), Image.LANCZOS)
            im = im.convert('RGBA')
            im.alpha_composite(layer)
            im = im.convert('RGB')

if out.endswith('.png'):
    im.save(out, optimize=True)
else:
    quality = int(os.environ.get('JPEG_QUALITY', '92'))
    im.save(out, quality=quality, subsampling=0, optimize=True, progressive=True)
print(out, os.path.getsize(out), 'bytes')
