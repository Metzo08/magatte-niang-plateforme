import os

needles = [
    "Sourcing direct usines",
    "Approvisionnement mati\u00e8res premi\u00e8res",
    "Sourcing et livraison de mat\u00e9riaux",
    "Logistique lourde & levage",
    "82 engins",
    "Pr\u00e9fabrication b\u00e9ton industrielle",
    "pr\u00e9contraint",
    "8 500 m",
    "Op\u00e9rations de levage lourd",
    "corridors miniers",
    "B\u00e2tir l'avenir du S\u00e9n\u00e9gal",
    "Espace Professionnel",
]
for root in ['src']:
    for r, d, files in os.walk(root):
        for f in files:
            if not f.endswith(('.ts', '.tsx')):
                continue
            p = os.path.join(r, f)
            t = open(p, encoding='utf-8').read()
            lines = t.split('\n')
            for n, line in enumerate(lines, 1):
                for s in needles:
                    if s in line:
                        print('%-46s L%-4d | %s' % (p, n, line.strip()[:130]))
                        break
