import os, io

NEEDLES = [
    'Sourcing direct usines',
    'Approvisionnement matières premières',
    'projets institutionnels',
    'Logistique lourde',
    'Préfabrication béton industrielle',
    'Fourniture de béton prêt à l',
    'convois exceptionnels',
    'Laboratoire agréé catégories',
    'Bâtir l\'avenir du Sénégal',
    'Espace Professionnel',
    '82 engins lourds',
    'éléments modulaires en béton',
]

hits = {}
for root, dirs, files in os.walk('src'):
    for f in files:
        if not f.endswith(('.ts', '.tsx')):
            continue
        p = os.path.join(root, f)
        t = open(p, encoding='utf-8', errors='replace').read()
        for nd in NEEDLES:
            if nd in t:
                hits.setdefault(nd, []).append(p)

out = io.StringIO()
for nd in NEEDLES:
    out.write('\n=== %s ===\n' % nd)
    for p in hits.get(nd, []):
        out.write('   %s\n' % p)
    if nd not in hits:
        out.write('   (not found)\n')

out.write('\n\n=== PGT / sourcing full source ===\n')
p = 'src/app/services/sourcing/page.tsx'
t = open(p, encoding='utf-8').read()
out.write('lines: %d\n' % (t.count('\n') + 1))
open('_find.txt', 'w', encoding='utf-8').write(out.getvalue())
print('written _find.txt')
