import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { PRODUCTS_P2M } from '@/data/initialData';
import { apiHandler } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return apiHandler(
    async () => {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (product) {
        return product;
      }

      // Fallback to static PRODUCTS_P2M
      const fallbackProduct = PRODUCTS_P2M.find((p) => p.id === id);
      if (fallbackProduct) {
        return fallbackProduct;
      }

      throw new Error('Product not found');
    },
    'Product GET',
    undefined,
    false
  ).catch((error) => {
    if (error.message === 'Product not found') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return apiHandler(
    async () => {
      const body = await request.json();
      const product = await prisma.product.update({
        where: { id },
        data: body,
      });
      return product;
    },
    'Product PUT'
  );
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return apiHandler(
    async () => {
      await prisma.product.delete({
        where: { id },
      });
      return { success: true };
    },
    'Product DELETE'
  );
}