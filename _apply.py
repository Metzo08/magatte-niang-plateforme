import re, os, datetime

BAK = '_bak'
os.makedirs(BAK, exist_ok=True)


def load(p):
    return open(p, encoding='utf-8').read()


def save(p, t):
    open(p, 'w', encoding='utf-8', newline='').write(t)


def backup(p):
    stamp = datetime.datetime.now().strftime('%H%M%S')
    open(os.path.join(BAK, os.path.basename(p) + '.' + stamp), 'w', encoding='utf-8').write(load(p))


IMG = re.compile(r"/images/[A-Za-z0-9/_.\-]+")


def esc_title(t):
    out = []
    for ch in t:
        if ch == "'":
            out.append(r"\\?'")
        elif ch == '&':
            out.append(r'(?:&|&amp;)')
        else:
            out.append(re.escape(ch))
    return ''.join(out)


# (texte-ancre, nouvelle image)
PAIRS = [
    ("Sourcing direct usines & chaîne logistique maritime internationale", "/images/illustrations/sourcing-fret.svg"),
    ("Approvisionnement matières premières pour grands projets", "/images/reelles/logistik-013.jpg"),
    ("Sourcing et livraison de matériaux pour projets institutionnels", "/images/reelles/projet-oim-societe-generale-02.jpg"),
    ("Logistique lourde & levage BTP", "/images/reelles/logistik-003.jpg"),
    ("Préfabrication béton industrielle", "/images/beton-prefabrique.jpg"),
    ("Fourniture de béton prêt à l'emploi & préfabrication — Voiries & plateformes", "/images/reelles/logistik-018.jpg"),
    ("Opérations de levage lourd, manutention & convois exceptionnels de chantier", "/images/engins/grue-mobile-50t.jpg"),
]

files = []
for root, dirs, fs in os.walk('src'):
    if 'node_modules' in root:
        continue
    for f in fs:
        if f.endswith(('.ts', '.tsx')):
            files.append(os.path.join(root, f))

for anchor, newimg in PAIRS:
    rx = re.compile(esc_title(anchor))
    hits = 0
    for p in files:
        t = load(p)
        changed = False
        for m in rx.finditer(t):
            win_end = min(len(t), m.end() + 700)
            im = IMG.search(t, m.end(), win_end)
            if im:
                if im.group(0) != newimg:
                    t = t[:im.start()] + newimg + t[im.end():]
                    changed = True
                    hits += 1
        if changed:
            backup(p)
            save(p, t)
    print('%-3s remplacement(s) -> %s  [%s]' % (hits, newimg, anchor[:60]))

# ---------- Arrière-plans hero (section ouverte juste avant l'ancre) ----------

def add_hero_bg(path, anchor, img):
    t = load(path)
    i = t.find(anchor)
    if i < 0:
        print('!! ancre introuvable', path, anchor)
        return
    j = max(t.rfind('<section', 0, i), t.rfind('<header', 0, i))
    if j < 0:
        print('!! pas de section', path)
        return
    tag_end = t.find('>', j)
    tag = t[j:tag_end]
    if "'/" + img.split('/')[-1] in t[:i]:
        pass
    extra = '' if 'relative' in tag else ' relative overflow-hidden'
    style = ("style={{backgroundImage:\"linear-gradient(rgba(11,42,66,0.72),rgba(11,42,66,0.72)),"
             "url('%s')\",backgroundSize:'cover',backgroundPosition:'center'}}" % img)
    newtag = tag + extra + ' ' + style + '>'
    backup(path)
    t = t[:j] + newtag + t[tag_end:]
    save(path, t)
    print('hero bg ->', path, '[', anchor[:40], ']')


add_hero_bg('src/app/profil/page.tsx', "Bâtir l'avenir du Sénégal", '/images/reelles/sbs-reel-006.jpg')
add_hero_bg('src/app/services/laboratoire/page.tsx', 'Laboratoire agréé catégories C2 & A2', '/images/reelles/sbs-labo-reel-005.jpg')
