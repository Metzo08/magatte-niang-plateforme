'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, Eye, EyeOff, Truck, Layers } from 'lucide-react';

interface EntityAdminLoginProps {
  entityId: 'p2m' | 'sbs-logistik';
  onSuccess: () => void;
}

const META = {
  p2m: {
    title: 'Espace Gestionnaire P2M Showroom',
    subtitle: 'Pilotage catalogue carrelages & sanitaires, devis, factures, clients & besoins',
    loginEndpoint: '/api/p2m/auth/login',
    defaultUserPlaceholder: 'p2m-gestionnaire',
    backHref: '/entites/p2m',
    backLabel: 'Retour à P2M Showroom',
    accentBg: 'from-sky-500 to-accent-600',
    accentFocus: 'focus:border-sky-400',
    badgeText: 'ACCÈS ISOLÉ · P2M SHOWROOM',
    icon: Layers,
  },
  'sbs-logistik': {
    title: 'Espace Gestionnaire SB-S Logistik',
    subtitle:
      'Exploitation parc engins, expressions de besoins, devis, factures, paiement en ligne, clients & suivi SAV',
    loginEndpoint: '/api/sbs-logistik/auth/login',
    defaultUserPlaceholder: 'logistik-gestionnaire',
    backHref: '/entites/sbs-logistik',
    backLabel: 'Retour à SB-S Logistik',
    accentBg: 'from-amber-500 to-orange-600',
    accentFocus: 'focus:border-amber-400',
    badgeText: 'ACCÈS ISOLÉ · SB-S LOGISTIK',
    icon: Truck,
  },
};

export function EntityAdminLogin({ entityId, onSuccess }: EntityAdminLoginProps) {
  const cfg = META[entityId];
  const IconComp = cfg.icon;

  const [username, setUsername] = useState(cfg.defaultUserPlaceholder);
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(cfg.loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Échec de connexion.');
        return;
      }
      onSuccess();
    } catch {
      setError('Impossible de joindre le serveur d’authentification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        <Link
          href={cfg.backHref}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{cfg.backLabel}</span>
        </Link>

        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {cfg.badgeText}
              </span>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.accentBg} flex items-center justify-center text-white shadow-lg`}
              >
                <IconComp className="w-5 h-5" />
              </div>
            </div>

            <h1 className="text-xl font-title font-bold text-white">{cfg.title}</h1>
            <p className="text-xs text-slate-400 leading-relaxed">{cfg.subtitle}</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Identifiant gestionnaire
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700 text-sm text-white font-mono focus:outline-none ${cfg.accentFocus}`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Mot de passe sécurisé
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700 text-sm text-white font-mono focus:outline-none ${cfg.accentFocus}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${cfg.accentBg} text-white font-bold text-sm shadow-lg hover:opacity-95 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2`}
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Vérification...' : 'Ouvrir l’espace dédié'}</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center">
            Session HttpOnly signée HMAC-SHA256 · Strictement isolée des autres entités du groupe.
          </p>
        </div>
      </div>
    </div>
  );
}
