import re, os, secrets, datetime

BAK = '_bak'
os.makedirs(BAK, exist_ok=True)


def load(p):
    return open(p, encoding='utf-8').read()


def save(p, t):
    open(p, 'w', encoding='utf-8', newline='').write(t)


def backup(p):
    stamp = datetime.datetime.now().strftime('%H%M%S')
    open(os.path.join(BAK, os.path.basename(p) + '.' + stamp), 'w', encoding='utf-8').write(load(p))


# 1) .env.local : ADMIN_PASSWORD
envp = '.env.local'
env = load(envp) if os.path.exists(envp) else ''
pwd = None
if 'ADMIN_PASSWORD' not in env:
    pwd = secrets.token_urlsafe(9)
    if env and not env.endswith('\n'):
        env += '\n'
    env += 'ADMIN_PASSWORD=' + pwd + '\n'
    save(envp, env)
else:
    pwd = dict(line.split('=', 1) for line in env.splitlines() if '=' in line).get('ADMIN_PASSWORD')
print('ADMIN_PASSWORD =', pwd)

# 2) espace-pro : wrap dans AdminGate
p = 'src/app/espace-pro/page.tsx'
t = load(p)
if 'AdminGate' not in t:
    backup(p)
    t = re.sub(r"^import ", "import AdminGate from '@/components/common/AdminGate';\nimport ", t, count=1, flags=re.M)
    i = t.find('return (')
    t = t[:i + 8] + '\n    <AdminGate>\n' + t[i + 8:]
    j = t.rfind('\n  );')
    t = t[:j] + '\n    </AdminGate>' + t[j:]
    save(p, t)
    print('espace-pro wrappé dans AdminGate')
else:
    print('espace-pro: déjà wrappé')

# 3) laboratoire : import + section Réalisations
p = 'src/app/services/laboratoire/page.tsx'
t = load(p)
if 'LaboRealizations' not in t:
    backup(p)
    t = re.sub(r"^import ", "import LaboRealizations from '@/components/common/LaboRealizations';\nimport ", t, count=1, flags=re.M)
    j = t.rfind('\n  );')
    t = t[:j] + '\n    <LaboRealizations />' + t[j:]
    save(p, t)
    print('laboratoire: section Réalisations ajoutée')
else:
    print('laboratoire: déjà présent')
