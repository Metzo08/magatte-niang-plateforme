import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/search - Recherche globale
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q || q.length < 2) {
      return NextResponse.json({ 
        entities: [], 
        projects: [], 
        products: [],
        message: 'Minimum 2 caractères requis'
      });
    }
    
    const searchQuery = `%${q.toLowerCase()}%`;
    
    // Recherche dans les entités
    const entities = await prisma.entity.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { tagline: { contains: q, mode: 'insensitive' } },
          { mission: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 5
    });
    
    // Recherche dans les projets
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { client: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
          { summary: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 5
    });
    
    // Recherche dans les produits
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { ref: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 10
    });
    
    return NextResponse.json({
      entities: entities.map(e => ({
        id: e.id,
        name: e.name,
        tagline: e.tagline,
        colorHex: e.colorHex,
        type: 'entity'
      })),
      projects: projects.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        location: p.location,
        status: p.status,
        type: 'project'
      })),
      products: products.map(p => ({
        id: p.id,
        ref: p.ref,
        name: p.name,
        category: p.category,
        indicativePriceFCFA: p.indicativePriceFCFA,
        availability: p.availability,
        type: 'product'
      })),
      query: q
    });
  } catch (error) {
    console.error('Erreur recherche:', error);
    return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 });
  }
}