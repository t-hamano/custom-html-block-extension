"""Assemble PNG frames into a GIF with one shared palette and no dithering.

usage: make_gif.py frames_dir durations.json out.gif [x,y,w,h]
Frames are frames_dir/0000.png, 0001.png, ... and durations.json is a list of ms.
"""
import json
import os
import sys
from pathlib import Path

from PIL import Image

frames_dir, durs_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
durs = json.loads(Path(durs_path).read_text())
frames = [Image.open(Path(frames_dir) / f'{i:04d}.png').convert('RGB') for i in range(len(durs))]
if len(sys.argv) > 4:
    x, y, cw, ch = map(int, sys.argv[4].split(','))
    frames = [f.crop((x, y, x + cw, y + ch)) for f in frames]

# Build one palette from every frame so colors stay stable between frames.
w, h = frames[0].size
montage = Image.new('RGB', (w, h * len(frames)))
for i, f in enumerate(frames):
    montage.paste(f, (0, h * i))
# 64 colors keeps anti-aliased text smooth at about half the size of 256.
colors = int(os.environ.get('GIF_COLORS', '64'))
# Keep black and white, e.g. for the mouse I-beam that inverts the pixels below it:
# a few pixels don't get their own color and map to a different one in each GIF.
quantized = montage.quantize(colors=colors - 2, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
rgb = quantized.getpalette()[: 3 * len(quantized.getcolors())]
for c in ([0, 0, 0], [255, 255, 255]):
    if not any(rgb[i : i + 3] == c for i in range(0, len(rgb), 3)):
        rgb += c
palette = Image.new('P', (1, 1))
palette.putpalette(rgb)

pal_frames = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in frames]
pal_frames[0].save(
    out,
    save_all=True,
    append_images=pal_frames[1:],
    duration=durs,
    loop=0,
    disposal=1,
)
print(out, Path(out).stat().st_size, 'bytes')
