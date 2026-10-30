import os
PATH = 'src/data/initialData.ts'
t = open(PATH, encoding='utf-8').read()
SWAPS = [
    ('Sourcing direct usines', '/images/reelles/projet-oim-societe-generale-01.jpg'),
    ('Approvisionnement mati\u00e8res premi\u00e8res', '/images/reelles/projet-oim-societe-generale-02.jpg'),
    ('Approvisionnement mati\u00e8res premi\u00e8res', '/images/reelles/projet-oim-societe-generale-03.jpg'),
    ('Sourcing et livraison de mat\u00e9riaux', '/images/reelles/projet-oim-societe-generale-04.jpg'),
    ('Sourcing et livraison de mat\u00e9riaux', '/images/reelles/projet-oim-societe-generale-05.jpg'),
    ('Logistique lourde & levage BTP', '/images/engins/grue-mobile-50t.jpg'),
    ('Pr\u00e9fabrication b\u00e9ton industrielle', '/images/reelles/logistik-018.jpg'),
    ("Fourniture de b\u00e9ton pr\u00eat \u00e0 l\\'emploi", '/images/reelles/logistik-017.jpg'),
    ('Op\u00e9rations de levage lourd', '/images/reelles/logistik-002.jpg'),
]
pos = 0
ok, fail = 0, []
for anchor, newurl in SWAPS:
    i = t.find(anchor, pos)
    if i < 0:
        fail.append((anchor, 'ANCHOR NOT FOUND after pos %d' % pos)); pos = 0; continue
    j = t.find(chr(39) + '/images', i)
    if j < 0 or j - i > 1600:
        fail.append((anchor, 'no /images url within range (found at %d, dist %d)' % (j, j - i if j >= 0 else -1))); continue
    k = t.find(chr(39), j + 1)
    old = t[j + 1:k]
    fs = 'public' + newurl
    if not os.path.exists(fs):
        fail.append((anchor, 'NEW FILE MISSING: ' + fs)); continue
    print('%-46s %s -> %s' % (anchor[:46], old.split('/')[-1], newurl.split('/')[-1]))
    t = t[:j + 1] + newurl + t[k:]
    pos = j + len(newurl)
    ok += 1
print('applied:', ok, '| failures:', len(fail))
for a, r in fail:
    print('  FAIL %-44s %s' % (a[:44], r))
if ok == len(SWAPS):
    open(PATH, 'w', encoding='utf-8', newline='\n').write(t)
    print('WRITTEN OK')
else:
    print('NOT WRITTEN - fix failures first')
