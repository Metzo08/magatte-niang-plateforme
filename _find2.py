import os, io

NEEDLES = [
    'Sourcing direct usines',
    'Approvisionnement matières premières',
    'projets institutionnels',
    'Fourniture de béton prêt',
    'convois exceptionnels',
    'levage lourd',
]

out = io.StringIO()
for p in ['src/data/siteImages.ts', 'src/data/initialData.ts']:
    lines = open(p, encoding='utf-8').read().split('\n')
    out.write('\n############ %s (%d lines) ############\n' % (p, len(lines)))
    for nd in NEEDLES:
        out.write('\n---- "%s" ----\n' % nd)
        for i, l in enumerate(lines, 1):
            if nd in l:
                out.write('%5d: %s\n' % (i, l.strip()))

open('_find2.txt', 'w', encoding='utf-8').write(out.getvalue())
print('ok')
