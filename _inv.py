import os, io

out = io.StringIO()
for d in ['public/images', 'public/images/reelles', 'public/images/engins',
          'public/images/illustrations', 'public/images/realisations']:
    if not os.path.isdir(d):
        out.write('\n### %s : ABSENT\n' % d)
        continue
    fs = sorted(os.listdir(d))
    files = [f for f in fs if os.path.isfile(os.path.join(d, f))]
    out.write('\n### %s : %d files\n' % (d, len(files)))
    for f in files:
        out.write('   %-58s %8d\n' % (f, os.path.getsize(os.path.join(d, f))))

open('_inv.txt', 'w', encoding='utf-8').write(out.getvalue())
print('written _inv.txt')
