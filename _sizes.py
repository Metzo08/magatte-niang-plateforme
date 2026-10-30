import os

rows = []
for root, dirs, files in os.walk('public/images'):
    for f in files:
        p = os.path.join(root, f)
        rows.append((os.path.getsize(p), p.replace('\\', '/')))

rows.sort()
print('total image files:', len(rows))
print()
print('=== 40 SMALLEST (suspicious / broken) ===')
for sz, p in rows[:40]:
    print('%9d  %s' % (sz, p))

print()
print('=== files under 5 KB ===')
tiny = [(s, p) for s, p in rows if s < 5000]
print('count:', len(tiny))
for s, p in tiny:
    print('%9d  %s' % (s, p))

print()
print('=== per-directory summary ===')
from collections import defaultdict
agg = defaultdict(lambda: [0, 0])
for sz, p in rows:
    d = os.path.dirname(p)
    agg[d][0] += 1
    agg[d][1] += sz
for d in sorted(agg):
    n, s = agg[d]
    print('%-46s %4d files  %10d bytes  avg %7d' % (d, n, s, s / n))
