'use client';

import React, { useEffect, useState } from 'react';
import { EntityAdminLogin } from '@/components/entity-admin/EntityAdminLogin';
import { P2mAdminWorkspace } from '@/components/p2m/admin/P2mAdminWorkspace';

export default function P2mAdminPage() {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/p2m/auth/login', { cache: 'no-store' });
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
        Vérification de session P2M...
      </div>
    );
  }

  if (!authenticated) {
    return <EntityAdminLogin entityId="p2m" onSuccess={() => setAuthenticated(true)} />;
  }

  return <P2mAdminWorkspace onLogout={() => setAuthenticated(false)} />;
}
