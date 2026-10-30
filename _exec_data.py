# -*- coding: utf-8 -*-
# EXECUTION: fix wrong images on service/expertise cards (idempotent) + dump page regions
import re, io, os

out = io.StringIO()
def w(s=''):
    out.write(s + '\n')

DATA = 'src/data/initialData.ts'
t = open(DATA, encoding='utf-8').read()
orig = t

# (anchor, new_image_path)
fixes = [
    ("Sourcing direct usines & chaîne logistique maritime internationale", '/images/illustrations/sourcing-fret.svg'),
    ("Approvisionnement matières premières pour grands projets", '/images/illustrations/sourcing-fret.svg'),
    ("Sourcing et livraison de matériaux pour projets institutionnels", '/images/illustrations/sourcing-fret.svg'),
    ("Logistique lourde & levage BTP", '/images/engins/grue-mobile-50t.jpg'),
    ("Préfabrication béton industrielle", '/images/beton-prefabrique.jpg'),
    ("Opérations de levage lourd, manutention & convois exceptionnels de chantier", '/images/engins/grue-mobile-50t.jpg'),
    ("prêt à l\\'emploi & préfabrication — Voiries & plateformes", '/images/beton-prefabrique.jpg'),
]

for anchor, newpath in fixes:
    positions = [m.start() for m in re.finditer(re.escape(anchor), t)]
    w('[%s] occurrences: %d' % (anchor[:60], len(positions)))
    # patch from the end so offsets stay valid
    for pos in reversed(positions):
        win = t[pos:pos + 1500]
        m = re.search(r"(image(?:Url)?\s*:\s*')([^']+)(')", win)
        if not m:
            w('   !! no image field found after anchor')
            continue
        cur = m.group(2)
        if cur == newpath:
            w('   = already set (%s)' % cur)
            continue
        s = pos + m.start(2)
        e = pos + m.end(2)
        t = t[:s] + newpath + t[e:]
        w('   %s -> %s' % (cur, newpath))

if t != orig:
    open(DATA, 'w', encoding='utf-8', newline='\n').write(t)
    w('initialData.ts WRITTEN')
else:
    w('initialData.ts unchanged')

# --- dump regions needed for page edits ---
si = open('src/data/siteImages.ts', encoding='utf-8').read()
i = si.find('export const EXPERTISE_IMAGES')
j = si.find('export type', i)
w('\n===== EXPERTISE_IMAGES (siteImages.ts) =====')
w(si[i:j if j > 0 else i + 1800])

w('===== labo page (hero, 1-70) =====')
w('\n'.join(open('src/app/services/laboratoire/page.tsx', encoding='utf-8').read().split('\n')[:70]))
w('===== labo page (last 40 lines) =====')
w('\n'.join(open('src/app/services/laboratoire/page.tsx', encoding='utf-8').read().split('\n')[-40:]))

w('===== profil page (1-120) =====')
w('\n'.join(open('src/app/profil/page.tsx', encoding='utf-8').read().split('\n')[:120]))

w('===== espace-pro page (1-90) =====')
w('\n'.join(open('src/app/espace-pro/page.tsx', encoding='utf-8').read().split('\n')[:90]))

for comp in ['src/components/common/AdminGate.tsx',
             'src/components/common/LaboRealizations.tsx',
             'src/app/api/admin/login/route.ts']:
    w('===== %s (exists=%s) =====' % (comp, os.path.exists(comp)))
    if os.path.exists(comp):
        w(open(comp, encoding='utf-8').read())

open('_exec_out.txt', 'w', encoding='utf-8').write(out.getvalue())
print('done -> _exec_out.txt')
