'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { EntityAdminLogin } from './EntityAdminLogin';
import { SpecializedEntityAdminWorkspace } from './SpecializedEntityAdminWorkspace';
import type { ManagedEntityId } from '@/lib/entityAuth';

interface EntityAdminGateProps {
  entityId: Extract<ManagedEntityId, 'sbs-labo' | 'serma-btp' | 'sbs-group' | 'pgt'>;
  label: string;
}

export function EntityAdminGate({ entityId, label }: EntityAdminGateProps) {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/entity-admin/${entityId}/auth`, { cache: 'no-store' });
      const data = await res.json();
      setAuthenticated(Boolean(data?.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setChecked(true);
    }
  }, [entityId]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">
        Vérification de session {label}...
      </div>
    );
  }

  if (!authenticated) {
    return <EntityAdminLogin entityId={entityId} onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <SpecializedEntityAdminWorkspace
      entityId={entityId}
      onLogout={() => setAuthenticated(false)}
    />
  );
}
