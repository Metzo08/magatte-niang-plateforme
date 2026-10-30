import re, io

def ctx(path, patterns, before, after):
    t = open(path, encoding='utf-8').read()
    lines = t.split('\n')
    out = []
    for pat in patterns:
        found = False
        for m in re.finditer(re.escape(pat), t):
            found = True
            ln = t.count('\n', 0, m.start())
            lo, hi = max(0, ln - before), min(len(lines), ln + after + 1)
            out.append('===== %s | line %d | %r =====' % (path, ln + 1, pat))
            for i in range(lo, hi):
                out.append('%4d| %s' % (i + 1, lines[i]))
            out.append('')
        if not found:
            out.append('===== %s | NOT FOUND: %r =====\n' % (path, pat))
    return '\n'.join(out)

buf = io.StringIO()
buf.write(ctx('src/app/expertises/page.tsx', [
    'Sourcing direct usines',
    'Approvisionnement mati',
    'Sourcing et livraison de mat',
    'Logistique lourde',
    'Fourniture de b',
    'levage lourd',
    'image:',
    'images:',
], 10, 14))
buf.write(ctx('src/data/siteImages.ts', ['EXPERTISE_IMAGES'], 4, 40))
buf.write(ctx('src/app/profil/page.tsx', ["Bâtir l'avenir"], 12, 18))
buf.write(ctx('src/app/services/laboratoire/page.tsx', ['Laboratoire agré'], 14, 22))
buf.write(ctx('src/app/espace-pro/page.tsx', ['Espace Professionnel'], 10, 16))
buf.write('===== HEADS =====\n')
for f in ['src/lib/api.ts', 'src/lib/db.ts', 'src/lib/store.ts']:
    try:
        t = open(f, encoding='utf-8').read()
        buf.write('--- %s (first 40 lines of %d) ---\n' % (f, t.count('\n') + 1))
        buf.write('\n'.join('%4d| %s' % (i + 1, l) for i, l in enumerate(t.split('\n')[:40])) + '\n\n')
    except Exception as e:
        buf.write('--- %s : %s ---\n\n' % (f, e))
open('_ctx.txt', 'w', encoding='utf-8').write(buf.getvalue())
print('written _ctx.txt, chars:', len(buf.getvalue()))
