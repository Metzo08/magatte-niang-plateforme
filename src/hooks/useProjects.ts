'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '@/lib/api';
import { PROJECTS } from '@/data/initialData';

function getStaticProjects(params?: { featured?: boolean; status?: string; entityId?: string }) {
  let list = PROJECTS.filter((p) => p.isPublished !== false);
  if (params?.featured) list = list.filter((p) => p.isFeatured);
  if (params?.status && params.status !== 'all') list = list.filter((p) => p.status === params.status);
  if (params?.entityId) {
    list = list.filter(
      (p) => p.primaryEntityId === params.entityId || p.partnerEntityIds?.includes(params.entityId as any)
    );
  }
  return list;
}

export function useProjects(params?: { featured?: boolean; status?: string; entityId?: string }) {
  const initial = getStaticProjects(params);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['projects', params?.featured ?? null, params?.status ?? null, params?.entityId ?? null],
    queryFn: () => projectsAPI.getAll(params),
    initialData: initial.length > 0 ? initial : undefined,
    staleTime: 1000 * 60 * 30,
  });

  const projects = data ?? initial;

  return {
    projects,
    loading: projects.length > 0 ? false : isPending,
    error: isError && projects.length === 0 ? (error as Error).message : null,
  };
}

export function useProject(slug: string | null) {
  const staticProject = slug ? PROJECTS.find((p) => p.slug === slug || p.id === slug) || null : null;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsAPI.getBySlug(slug as string),
    enabled: !!slug,
    initialData: staticProject || undefined,
    staleTime: 1000 * 60 * 30,
  });

  const project = data ?? staticProject;

  return {
    project,
    loading: project ? false : (slug ? isPending : false),
    error: isError && !project ? (error as Error).message : null,
  };
}
