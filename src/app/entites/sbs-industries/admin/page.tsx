'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import SbsAdminLogin from '@/components/sbs/admin/SbsAdminLogin';
import SbsAdminErpWorkspace from '@/components/sbs/admin/SbsAdminErpWorkspace';

export default function SbsIndustriesAdminPage() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkSession = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/sbs-industrie/auth/login', { cache: 'no-store' });
      const data = await res.json();
      setAuthenticated(Boolean(res.ok && data?.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (checking) {
    return (
      <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center p-6 text-white">
        <RefreshCw className="w-7 h-7 text-accent-400 animate-spin mb-3" />
        <p className="text-xs font-semibold text-neutral-300">
          Vérification de session SBS Industrie...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return <SbsAdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <SbsAdminErpWorkspace onLoggedOut={() => setAuthenticated(false)} />;
}
