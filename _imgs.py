import os, io

out = io.StringIO()
out.write('AVAILABLE IMAGES under public/images\n')
out.write('=' * 70 + '\n')
for root, dirs, files in os.walk('public/images'):
    imgs = sorted(f for f in files
                  if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif')))
    if not imgs:
        continue
    out.write('\n%s   (%d)\n' % (root.replace('\\', '/'), len(imgs)))
    for f in imgs:
        out.write('    %-56s %9d\n' % (f, os.path.getsize(os.path.join(root, f))))
open('_imgs.txt', 'w', encoding='utf-8').write(out.getvalue())
print('done')

