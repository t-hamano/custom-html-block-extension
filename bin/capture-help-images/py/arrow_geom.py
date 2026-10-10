"""Measure red annotation arrows in an image.

usage: arrow_geom.py image [frame]
Prints JSON list: {dir, tip: [x, y], headHalfWidth, headHeight, shaftHalfWidth, length}
Coordinates are measured on the red fill; the black outline adds ~1px around it.
"""
import json
import sys

import numpy as np
from PIL import Image

im = Image.open(sys.argv[1])
if getattr(im, 'n_frames', 1) > 1:
    im.seek(int(sys.argv[2]) if len(sys.argv) > 2 else 0)
a = np.asarray(im.convert('RGB')).astype(int)
red = (a[..., 0] > 150) & (a[..., 1] < 110) & (a[..., 2] < 110)

# Connected components (4-neighbour flood fill).
seen = np.zeros_like(red)
comps = []
for y, x in zip(*np.where(red)):
    if seen[y, x]:
        continue
    stack, pts = [(y, x)], []
    seen[y, x] = True
    while stack:
        cy, cx = stack.pop()
        pts.append((cy, cx))
        for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
            if 0 <= ny < red.shape[0] and 0 <= nx < red.shape[1] and red[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                stack.append((ny, nx))
    if len(pts) > 40:
        comps.append(np.array(pts))

out = []
for pts in comps:
    ys, xs = pts[:, 0].astype(float), pts[:, 1].astype(float)
    cx, cy = xs.mean(), ys.mean()
    # Principal axis of the arrow.
    cov = np.cov(np.vstack([xs - cx, ys - cy]))
    evals, evecs = np.linalg.eigh(cov)
    ax = evecs[:, np.argmax(evals)]
    u = (xs - cx) * ax[0] + (ys - cy) * ax[1]
    v = -(xs - cx) * ax[1] + (ys - cy) * ax[0]
    lo, hi = int(np.floor(u.min())), int(np.ceil(u.max()))
    prof = np.array([np.ptp(v[(u >= k) & (u < k + 1)]) + 1 if ((u >= k) & (u < k + 1)).any() else 0 for k in range(lo, hi + 1)])
    n = len(prof)
    head_at_lo = prof[: n // 3].max() >= prof[-(n // 3):].max()
    if not head_at_lo:
        ax = -ax
        u = -u
        prof = prof[::-1]
        lo, hi = -hi, -lo
    # Pointing direction is -ax (towards the head end at the low u side).
    head_h = int(np.where(prof >= prof.max() - 1.5)[0].max()) + 1
    shaft = prof[head_h + 2:]
    tip_u = u.min() - 1.5
    tip = [cx + ax[0] * tip_u, cy + ax[1] * tip_u]
    angle = float(np.degrees(np.arctan2(-ax[1], -ax[0])))  # direction the arrow points to
    snap = round(angle / 45) * 45
    if abs(angle - snap) < 5:
        angle = snap
    out.append({
        'angle': round(angle, 1),
        'tip': [round(float(tip[0]), 1), round(float(tip[1]), 1)],
        'headHalfWidth': float(prof.max()) / 2,
        'headHeight': head_h + 1.5,
        'shaftHalfWidth': float(np.median(shaft)) / 2 if len(shaft) else 3.0,
        'length': n + 2,
    })
print(json.dumps(out))
