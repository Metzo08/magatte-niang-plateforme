import os, re, json, collections

ROOT = '.'
PUB = os.path.join(ROOT, 'public')

refs = collections.defaultdict(list)   # path -> [(file, line)]
pat = re.compile(r"""['"](/images/[^'"\s]+)['"]""")

for r, dirs, files in os.walk(os.path.join(ROOT, 'src')):
    for f in files:
        if not f.endswith(('.ts', '.tsx')):
            continue
        p = os.path.join(r, f)
        for n, line in enumerate(open(p, encoding='utf-8', errors='replace'), 1):
            for m in pat.finditer(line):
                refs[m.group(1)].append((p.replace('\\', '/'), n))

missing, ok = [], []
for path, locs in sorted(refs.items()):
    disk = os.path.join(PUB, path.lstrip('/').replace('/', os.sep))
    (ok if os.path.exists(disk) else missing).append((path, locs, disk))

print('=== TOTAL distinct image refs: %d | existing: %d | MISSING: %d ===' % (len(refs), len(ok), len(missing)))
print()
print('=== BROKEN IMAGE REFERENCES (%d) ===' % len(missing))
for path, locs, disk in missing:
    print('  MISSING %s' % path)
    for f, n in locs[:4]:
        print('            %s:%d' % (f, n))
print()
print('=== UNUSED FILES IN public/images (never referenced) ===')
used = set(p.lstrip('/').replace('/', os.sep) for p in refs)
unused = []
for r, dirs, files in os.walk(PUB):
    for f in files:
        full = os.path.join(r, f)
        rel = os.path.relpath(full, PUB)
        if rel not in used:
            unused.append(rel.replace('\\', '/'))
for u in sorted(unused):
    print('  ' + u)
print('  (total unused: %d)' % len(unused))
