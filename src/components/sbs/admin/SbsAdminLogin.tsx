'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SbsAdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('sbs-gestionnaire');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/sbs-industrie/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Authentification refusée.');
      } else {
        onSuccess();
      }
    } catch {
      setError('Erreur réseau lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] bg-gradient-to-br from-brand-950 via-brand-900 to-[#1f2f3d] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        <Link
          href="/entites/sbs-industries"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la page publique SBS Industrie
        </Link>

        <div className="bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 rounded-l p-7 sm:p-8 shadow-elev-3 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-900 text-amber-400 flex items-center justify-center mx-auto shadow-elev-2 border border-brand-700">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> ACCÈS EXCLUSIF SBS INDUSTRIE
            </div>
            <h1 className="text-2xl font-title font-bold text-brand-900 dark:text-white">
              Espace Gestionnaire Usine
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Portail strictement réservé au gestionnaire de <strong>SBS Industrie</strong> pour piloter la production journalière, les dimensions &amp; tarifs, les locations, les stocks et le compte de résultat.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="sbs-username"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1"
              >
                Identifiant gestionnaire
              </label>
              <input
                id="sbs-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-brand-950 border border-neutral-300 dark:border-brand-700 rounded-m text-neutral-900 dark:text-white focus:outline-none focus:border-accent-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="sbs-password"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1"
              >
                Mot de passe administrateur SBS
              </label>
              <div className="relative">
                <input
                  id="sbs-password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-neutral-50 dark:bg-brand-950 border border-neutral-300 dark:border-brand-700 rounded-m text-neutral-900 dark:text-white focus:outline-none focus:border-accent-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-m bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 px-4 rounded-m bg-brand-900 hover:bg-brand-800 dark:bg-accent-500 dark:hover:bg-accent-600 disabled:opacity-50 text-white font-bold text-sm transition-colors shadow-elev-1"
            >
              {loading ? 'Vérification sécurisée…' : 'Accéder à l’ERP SBS Industrie'}
            </button>
          </form>

          <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-brand-800">
            Session chiffrée HttpOnly (HMAC-SHA256) · Journalisation des accès active.
          </p>
        </div>
      </div>
    </div>
  );
}
