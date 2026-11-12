'use client';

import React, { useEffect, useState } from 'react';
import { EntityAdminLogin } from '@/components/entity-admin/EntityAdminLogin';
import { LogistikAdminWorkspace } from '@/components/logistik/admin/LogistikAdminWorkspace';

export default function SbsLogistikAdminPage() {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/sbs-logistik/auth/login', { cache: 'no-store' });
      const data = await res.json();
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setChecked(true);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">
        Vérification de session SB-S Logistik...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <EntityAdminLogin
        entityId="sbs-logistik"
        onSuccess={() => setAuthenticated(true)}
      />
    );
  }

  return <LogistikAdminWorkspace onLogout={() => setAuthenticated(false)} />;
}
