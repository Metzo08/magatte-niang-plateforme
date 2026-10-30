'use client';

import { useQuery } from '@tanstack/react-query';
import { entitiesAPI } from '@/lib/api';

export function useEntities() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['entities'],
    queryFn: () => entitiesAPI.getAll(),
  });

  return {
    entities: data ?? [],
    loading: isPending,
    error: isError ? (error as Error).message : null,
  };
}

export function useEntity(id: string | null) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['entity', id],
    queryFn: () => entitiesAPI.getById(id as string),
    enabled: !!id,
  });

  return {
    entity: data ?? null,
    loading: id ? isPending : false,
    error: isError ? (error as Error).message : null,
  };
}