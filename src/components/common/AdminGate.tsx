'use client';

import { useEffect, useState } from 'react';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('espace-pro-admin') === '1') setAuthed(true);
    setChecked(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        sessionStorage.setItem('espace-pro-admin', '1');
        setAuthed(true);
      } else {
        setErr(res.status === 401 ? 'Mot de passe incorrect.' : 'Configuration serveur manquante (ADMIN_PASSWORD).');
      }
    } catch {
      setErr('Erreur réseau.');
    }
    setLoading(false);
  };

  if (!checked) return null;

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-l border border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-800 shadow-elev-2 p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-white text-2xl">
            &#128274;
          </div>
          <h1 className="text-2xl font-bold text-brand-900 dark:text-white">Espace Professionnel</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Zone réservée à l&apos;administrateur. Veuillez vous authentifier pour accéder aux demandes de devis,
            rendez-vous confirmés, panier de matériaux et documents contractuels.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-brand-900 dark:text-neutral-200 mb-1">
              Mot de passe administrateur
            </label>
            <input
              id="admin-password"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoFocus
              className="w-full rounded-l border border-neutral-300 dark:border-brand-600 bg-neutral-50 dark:bg-brand-900 px-4 py-2.5 text-brand-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>
          {err && <p className="text-sm text-red-600 dark:text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={loading || !pwd}
            className="w-full rounded-l bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold py-2.5 transition-colors"
          >
            {loading ? 'Vérification…' : 'Se connecter'}
          </button>
        </form>
        <p className="mt-6 text-xs text-center text-neutral-500 dark:text-neutral-400">
          Accès strictement réservé — toutes les consultations sont journalisées.
        </p>
      </div>
    </div>
  );
}
