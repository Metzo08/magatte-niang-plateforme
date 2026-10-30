'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '@/lib/api';

export function useProjects(params?: { featured?: boolean; status?: string; entityId?: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['projects', params?.featured ?? null, params?.status ?? null, params?.entityId ?? null],
    queryFn: () => projectsAPI.getAll(params),
  });

  return {
    projects: data ?? [],
    loading: isPending,
    error: isError ? (error as Error).message : null,
  };
}

export function useProject(slug: string | null) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsAPI.getBySlug(slug as string),
    enabled: !!slug,
  });

  return {
    project: data ?? null,
    loading: slug ? isPending : false,
    error: isError ? (error as Error).message : null,
  };
}
