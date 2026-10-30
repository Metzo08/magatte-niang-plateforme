import os, re, glob

# collect every image path referenced anywhere in src
refs = {}
for root, dirs, files in os.walk('src'):
    for f in files:
        if not f.endswith(('.ts', '.tsx')):
            continue
        p = os.path.join(root, f)
        t = open(p, encoding='utf-8').read()
        for m in re.finditer(r"['\"](/images/[^'\"]+)['\"]", t):
            refs.setdefault(m.group(1), set()).add(p)

print('total distinct /images/ references:', len(refs))
missing = sorted(u for u in refs if not os.path.exists('public' + u))
print('MISSING on disk:', len(missing))
for u in missing:
    print('  MISSING %s   <- %s' % (u, ', '.join(sorted(refs[u]))))

# also every .svg referenced
svgs = sorted(u for u in refs if u.endswith('.svg'))
print()
print('SVG references:', len(svgs))
for u in svgs:
    print('  %s  exists=%s  size=%s' % (u, os.path.exists('public' + u),
          os.path.getsize('public' + u) if os.path.exists('public' + u) else '-'))
