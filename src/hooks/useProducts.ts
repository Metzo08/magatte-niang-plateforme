'use client';

import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { PRODUCTS_P2M } from '@/data/initialData';

export function useProducts(params?: { category?: string; availability?: string }) {
  const getStaticProducts = () => {
    let list = PRODUCTS_P2M;
    if (params?.category) list = list.filter((p: any) => p.category === params.category);
    if (params?.availability) list = list.filter((p: any) => p.availability === params.availability);
    return list;
  };
  const initial = getStaticProducts();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['products', params?.category ?? null, params?.availability ?? null],
    queryFn: () => productsAPI.getAll(params),
    initialData: initial.length > 0 ? initial : undefined,
    staleTime: 1000 * 60 * 30,
  });

  const products = data ?? initial;

  return {
    products,
    loading: products.length > 0 ? false : isPending,
    error: isError && products.length === 0 ? (error as Error).message : null,
  };
}

export function useProduct(id: string | null) {
  const staticProduct = id ? PRODUCTS_P2M.find((p: any) => p.id === id) || null : null;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id as string),
    enabled: !!id,
    initialData: staticProduct || undefined,
    staleTime: 1000 * 60 * 30,
  });

  const product = data ?? staticProduct;

  return {
    product,
    loading: product ? false : (id ? isPending : false),
    error: isError && !product ? (error as Error).message : null,
  };
}
