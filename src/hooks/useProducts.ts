'use client';

import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';

export function useProducts(params?: { category?: string; availability?: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['products', params?.category ?? null, params?.availability ?? null],
    queryFn: () => productsAPI.getAll(params),
  });

  return {
    products: data ?? [],
    loading: isPending,
    error: isError ? (error as Error).message : null,
  };
}

export function useProduct(id: string | null) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id as string),
    enabled: !!id,
  });

  return {
    product: data ?? null,
    loading: id ? isPending : false,
    error: isError ? (error as Error).message : null,
  };
}