"""Track the Windows mouse cursor (arrow, hand, I-beam) and click marks in a GIF.

usage: track.py original.gif <cursors dir> > track.json
Output: [{"i", "dur", "kind", "x", "y", "score", "click"?}], (x, y) is the hotspot.

Pixels that differ from the median frame form a binary mask, which is matched
against the cursor shapes. On a dark background the cursor brightens pixels
(white fill), on a light one it darkens them (black outline).
"""
import json
import sys

import numpy as np
from PIL import Image, ImageSequence

CURSORS = sys.argv[2]
meta = json.load(open(f'{CURSORS}/cursors.json'))

im = Image.open(sys.argv[1])
frames, rgbs, durs = [], [], []
for f in ImageSequence.Iterator(im):
    rgb = np.asarray(f.convert('RGB')).astype(np.float64)
    rgbs.append(rgb)
    frames.append(rgb.mean(axis=2))
    durs.append(f.info.get('duration', 0))
H, W = frames[0].shape
bg = np.median(np.stack(frames), axis=0)


def corr(a, b):
    sh = (H + b.shape[0], W + b.shape[1])
    c = np.fft.irfft2(np.fft.rfft2(a, sh) * np.fft.rfft2(b[::-1, ::-1], sh), sh)
    return c[b.shape[0] - 1:H, b.shape[1] - 1:W]


def shape_from_png(name, dark):
    a = np.asarray(Image.open(f'{CURSORS}/{name}.png').convert('RGBA')).astype(np.float64)
    opaque = a[..., 3] > 200
    lum = a[..., :3].mean(axis=2)
    shape = opaque & (lum > 128) if dark else opaque & (lum < 128)
    return shape, meta[name]['hx'], meta[name]['hy']


ibeam = np.zeros((16, 7), bool)
ibeam[0, [0, 1, 2, 4, 5, 6]] = True
ibeam[15, [0, 1, 2, 4, 5, 6]] = True
ibeam[1:15, 3] = True
# On a dark background the cursor brightens pixels, on a light one it darkens them.
variants = []
for dark in (True, False):
    variants.append((dark, {
        'default': shape_from_png('aero_arrow', dark),
        'pointer': shape_from_png('aero_link', dark),
        'text': (ibeam, 3, 8),
    }))

out = []
cands_all = []
for i, img in enumerate(frames):
    cands = []
    for dark, shapes in variants:
        changed = ((img - bg) > 50) if dark else ((bg - img) > 50)
        # Tolerate 1px differences between the template and the original cursor.
        near = changed.copy()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                near |= np.roll(np.roll(changed, dy, 0), dx, 1)
        for kind, (shape, hx, hy) in shapes.items():
            rows, cols = np.where(shape)
            shape = shape[: rows.max() + 1, : cols.max() + 1]
            box = np.ones_like(shape, dtype=np.float64)
            # The 1px I-beam is matched strictly, the arrow and hand loosely.
            src = changed if kind == 'text' else near
            hits = corr(src.astype(np.float64), shape.astype(np.float64))
            total = corr(changed.astype(np.float64), box)
            score = (hits - 0.5 * np.maximum(total - shape.sum(), 0)) / shape.sum()
            y, x = np.unravel_index(np.argmax(score), score.shape)
            cands.append((float(score[y, x]), kind, int(x + hx), int(y + hy)))
    cands_all.append(cands)
    rec = {'i': i, 'dur': durs[i]}
    out.append(rec)

# Pick one candidate per frame: high scores and smooth movement (Viterbi).
cost = [[-c[0] * 100 for c in cands_all[0]]]
back = [[None] * len(cands_all[0])]
for i in range(1, len(cands_all)):
    row, brow = [], []
    for c in cands_all[i]:
        opts = [cost[i - 1][j] + np.hypot(c[2] - p[2], c[3] - p[3]) / 4 for j, p in enumerate(cands_all[i - 1])]
        j = int(np.argmin(opts))
        row.append(opts[j] - c[0] * 100)
        brow.append(j)
    cost.append(row)
    back.append(brow)
k = int(np.argmin(cost[-1]))
for i in range(len(cands_all) - 1, -1, -1):
    score, kind, x, y = cands_all[i][k]
    out[i].update({'kind': kind if score > 0.55 else None, 'x': x, 'y': y, 'score': round(score, 2)})
    k = back[i][k] if back[i][k] is not None else k
# Click marks: a yellow disc (ScreenToGif's click highlight) around the cursor.
for rec, rgb in zip(out, rgbs):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    yellow = (r > 110) & (g > 100) & (r - b > 60) & (g - b > 50) & (np.abs(r - g) < 70)
    yy, xx = np.ogrid[: yellow.shape[0], : yellow.shape[1]]
    near = (yy - rec['y']) ** 2 + (xx - rec['x']) ** 2 <= 20 ** 2
    n = int((yellow & near).sum())
    if n > 150:
        rec['click'] = n
print(json.dumps(out))
