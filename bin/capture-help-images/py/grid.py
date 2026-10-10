"""Print text rows of an image: vertical band, left/right text edges per band.

usage: grid.py image [frame] [xmin]
Bands are groups of rows containing pixels far from the dominant background color.
"""
import sys
import numpy as np
from PIL import Image

im = Image.open(sys.argv[1])
frame = int(sys.argv[2]) if len(sys.argv) > 2 else 0
xmin = int(sys.argv[3]) if len(sys.argv) > 3 else 0
if getattr(im, 'n_frames', 1) > 1:
    im.seek(frame)
a = np.asarray(im.convert('RGB')).astype(int)
flat = a.reshape(-1, 3) // 8 * 8
vals, counts = np.unique(flat, axis=0, return_counts=True)
bg = vals[np.argmax(counts)]
mask = (np.abs(a - bg) > 70).any(axis=2)
mask[:, :xmin] = False
rows = mask.any(axis=1)
bands, start = [], None
for y, r in enumerate(list(rows) + [False]):
    if r and start is None:
        start = y
    if not r and start is not None:
        bands.append((start, y - 1))
        start = None
print('bg', bg.tolist(), 'size', a.shape[1], a.shape[0])
for y0, y1 in bands:
    cols = np.where(mask[y0:y1 + 1].any(axis=0))[0]
    print(f'rows {y0}-{y1} (h={y1-y0+1}, mid={(y0+y1)/2:.1f}) x {cols.min()}-{cols.max()}')
