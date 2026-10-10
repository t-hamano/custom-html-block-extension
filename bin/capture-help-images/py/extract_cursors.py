"""Extract the 32px Windows arrow and hand cursors as PNG.

usage: extract_cursors.py <Windows Cursors dir> <out dir>
Writes aero_arrow.png, aero_link.png and cursors.json (hotspots).
"""
import io
import json
import struct
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
meta = {}
for name in ['aero_arrow', 'aero_link']:
    data = (src / f'{name}.cur').read_bytes()
    count = struct.unpack('<H', data[4:6])[0]
    for i in range(count):
        w, h, _, _, hx, hy, size, offset = struct.unpack('<BBBBHHII', data[6 + 16 * i:22 + 16 * i])
        if w != 32:
            continue
        blob = data[offset:offset + size]
        if blob[:4] == b'\x89PNG':
            im = Image.open(io.BytesIO(blob)).convert('RGBA')
        else:
            header = struct.unpack('<I', blob[:4])[0]
            px = np.frombuffer(blob[header:header + 32 * 32 * 4], np.uint8).reshape(32, 32, 4)[::-1]
            im = Image.fromarray(px[..., [2, 1, 0, 3]].copy(), 'RGBA')
        im.save(out / f'{name}.png')
        meta[name] = {'w': 32, 'h': 32, 'hx': hx, 'hy': hy}
(out / 'cursors.json').write_text(json.dumps(meta))
