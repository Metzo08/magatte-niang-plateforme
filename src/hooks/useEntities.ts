'use client';

import { useQuery } from '@tanstack/react-query';
import { entitiesAPI } from '@/lib/api';
import { ENTITIES } from '@/data/initialData';

export function useEntities() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['entities'],
    queryFn: () => entitiesAPI.getAll(),
    initialData: ENTITIES,
    staleTime: 1000 * 60 * 30, // 30 minutes de cache
  });

  const entities = ENTITIES.map((staticItem) => {
    const apiItem = data?.find((d) => d.id === staticItem.id);
    return apiItem ? { ...apiItem, ...staticItem } : staticItem;
  });

  return {
    entities,
    loading: false, // Données statiques garanties immédiatement disponibles
    error: isError && entities.length === 0 ? (error as Error).message : null,
  };
}

export function useEntity(id: string | null) {
  const staticEntity = id ? ENTITIES.find((e) => e.id === id) || null : null;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['entity', id],
    queryFn: () => entitiesAPI.getById(id as string),
    enabled: !!id,
    initialData: staticEntity || undefined,
    staleTime: 1000 * 60 * 30, // 30 minutes de cache
  });

  const entity = staticEntity ? { ...(data || {}), ...staticEntity } : data;

  return {
    entity,
    loading: entity ? false : (id ? isPending : false),
    error: isError && !entity ? (error as Error).message : null,
  };
}
