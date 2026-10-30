# -*- coding: utf-8 -*-
import os, re

REPORT = []
def rep(msg): REPORT.append(str(msg))

def load(p):
    with open(p, encoding='utf-8') as f: return f.read()
def save(p, t):
    with open(p, 'w', encoding='utf-8', newline='\n') as f: f.write(t)

def exists_img(path):
    rel = path.lstrip('/').replace('/', os.sep)
    return os.path.exists(os.path.join('public', rel))

def swap_img_near(path, anchor, new_img, label, win=1100):
    t = load(path)
    i = t.find(anchor)
    if i < 0:
        rep('[FAIL %s] anchor not found: %r' % (label, anchor))
        return
    window = t[i:i+win]
    m = re.search(r"""(?:image|src|url|img)\s*:\s*['"`]([^'"`]+)['"`]""", window)
    if not m:
        m = re.search(r"""['"`](/images/[^'"`]+)['"`]""", window)
    if not m:
        # fallback: card references EXPERTISE_IMAGES.key -> patch that key in siteImages.ts
        m2 = re.search(r"EXPERTISE_IMAGES\.(\w+)", window)
        if m2:
            key = m2.group(1)
            si = load('src/data/siteImages.ts')
            ms = re.search(r"%s\s*:\s*'([^']+)'" % key, si)
            if ms:
                old = ms.group(1)
                if exists_img(new_img):
                    si = si[:ms.start(1)] + new_img + si[ms.end(1):]
                    save('src/data/siteImages.ts', si)
                    rep('[OK %s] via EXPERTISE_IMAGES.%s : %s -> %s' % (label, key, old, new_img))
                else:
                    rep('[WARN %s] target missing on disk: %s' % (label, new_img))
            else:
                rep('[FAIL %s] key %s not found in siteImages.ts' % (label, key))
            return
        rep('[FAIL %s] no image in window. WINDOW=%r' % (label, window[:600]))
        return
    old = m.group(1)
    if not exists_img(new_img):
        rep('[WARN %s] target missing on disk: %s (swap aborted)' % (label, new_img))
        return
    a, b = i + m.start(1), i + m.end(1)
    t = t[:a] + new_img + t[b:]
    save(path, t)
    rep('[OK %s] %s -> %s' % (label, old, new_img))

EXP = 'src/app/expertises/page.tsx'
SOU = 'src/app/services/sourcing/page.tsx'
SI  = 'src/data/siteImages.ts'

# ---- A) cartes expertises ----
swap_img_near(EXP, 'Sourcing direct usines', '/images/illustrations/sourcing-fret.svg', 'EXP-sourcing')
swap_img_near(EXP, 'Logistique lourde', '/images/reelles/logistik-002.jpg', 'EXP-logistique')
swap_img_near(EXP, 'Préfabrication béton industrielle', '/images/reelles/logistik-016.jpg', 'EXP-prefab')
swap_img_near(EXP, 'Fourniture de béton prêt', '/images/reelles/logistik-018.jpg', 'EXP-BPE')
swap_img_near(EXP, 'Opérations de levage lourd', '/images/engins/grue-mobile-50t.jpg', 'EXP-levage')

# ---- A2) cartes services sourcing (PGT) ----
swap_img_near(SOU, 'Sourcing direct usines', '/images/illustrations/sourcing-fret.svg', 'SOU-sourcing')
swap_img_near(SOU, 'Approvisionnement matières premières', '/images/reelles/logistik-019.jpg', 'SOU-matieres')
swap_img_near(SOU, 'Sourcing et livraison de matériaux', '/images/reelles/projet-oim-societe-generale-01.jpg', 'SOU-institutionnel')

# ---- B) galerie PGT dans siteImages.ts -> contenu sourcing/fret ----
t = load(SI)
m = re.search(r"pgt: \[(.*?)\],\s*\};", t, re.S)
entries = [
    ('/images/illustrations/sourcing-fret.svg', 'Sourcing international & fret maritime — PGT'),
    ('/images/reelles/projet-oim-societe-generale-01.jpg', 'Livraison de matériaux pour projets institutionnels (OIM)'),
    ('/images/reelles/projet-oim-societe-generale-02.jpg', 'Distribution & approvisionnement chantiers institutionnels'),
    ('/images/reelles/logistik-019.jpg', 'Stockage & manutention des matériaux importés'),
]
ok = [e for e in entries if exists_img(e[0])]
if m:
    body = ''.join("    { src: '%s', caption: '%s' },\n" % e for e in ok)
    t = t[:m.start()] + 'pgt: [\n' + body + '  ],\n};' + t[m.end():]
    save(SI, t)
    rep('[OK PGT gallery] %d entrees (sur %d proposees)' % (len(ok), len(entries)))
    rep('  fichiers manquants: %s' % [e[0] for e in entries if e not in ok])
else:
    rep('[FAIL PGT gallery] bloc pgt introuvable')

# ---- C) contextes exacts pour les modifications structurelles ----
def ctx(path, anchor, before, after, label):
    t = load(path)
    i = t.find(anchor)
    if i < 0:
        rep('[CTX MISS %s] %r' % (label, anchor)); return
    rep('=== CTX %s ===' % label)
    rep(t[max(0, i-before):i+after])

ctx('src/app/profil/page.tsx', 'Bâtir l', 800, 1000, 'profil-hero')
ctx('src/app/page.tsx', 'Laboratoire agréé catégories', 900, 1500, 'home-labo')

rep('=== CTX espace-pro (debut) ===')
rep(load('src/app/espace-pro/page.tsx')[:2800])

lab = load('src/app/services/laboratoire/page.tsx')
rep('=== CTX labo (fin de fichier, point d insertion) ===')
rep(lab[-1600:])
im = list(re.finditer(r'[Rr]éalisations?', lab))
rep('=== labo: occurrences "réalisation" ===')
for mm in im[:6]:
    rep('  @%d ...%s...' % (mm.start(), lab[max(0,mm.start()-80):mm.start()+120].replace('\n',' | ')))

# ---- D) revue galeries entites (serma / industries) ----
ms = re.search(r"'serma-btp': \[(.*?)\],", t, re.S)
mi = re.search(r"'sbs-industries': \[(.*?)\],", t, re.S)
rep('=== CTX galerie serma-btp ===')
rep(ms.group(0)[:1400] if ms else 'INTROUVABLE')
rep('=== CTX galerie sbs-industries ===')
rep(mi.group(0)[:1400] if mi else 'INTROUVABLE')

open('_edits_report.txt', 'w', encoding='utf-8').write('\n'.join(REPORT))
print('report written, %d lines' % len(REPORT))
