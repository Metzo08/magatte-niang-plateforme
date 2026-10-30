import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { PROJECTS } from '@/data/initialData';
import { apiHandler } from '@/lib/utils';

export async function GET(request: NextRequest) {
  return apiHandler(
    async () => {
      const { searchParams } = new URL(request.url);
      const featured = searchParams.get('featured');
      const status = searchParams.get('status');
      const entityId = searchParams.get('entityId');

      const where: any = {};

      if (featured === 'true') {
        where.isFeatured = true;
      }

      if (status && status !== 'all') {
        where.status = status;
      }

      if (entityId) {
        where.primaryEntityId = entityId;
      }

      where.isPublished = true;

      let staticProjects = PROJECTS.filter(p => p.isPublished);

      if (featured === 'true') {
        staticProjects = staticProjects.filter(p => p.isFeatured);
      }

      if (status && status !== 'all') {
        staticProjects = staticProjects.filter(p => p.status === status);
      }

      if (entityId) {
        staticProjects = staticProjects.filter(p => p.primaryEntityId === entityId);
      }

      try {
        const dbProjects = await prisma.project.findMany({
          where,
          orderBy: { year: 'desc' },
        });

        if (dbProjects && dbProjects.length > 0) {
          // Déduplique sur id ET slug : la base seedée contient les mêmes
          // projets que les données statiques — un slug légèrement différent
          // ne doit jamais produire deux cartes avec la même clé `id`.
          const seenIds = new Set(staticProjects.map(p => p.id));
          const seenSlugs = new Set(staticProjects.map(p => p.slug));
          const extras = dbProjects.filter(
            (p: any) => !seenIds.has(p.id) && !seenSlugs.has(p.slug)
          );
          return [...staticProjects, ...extras];
        }
        return staticProjects;
      } catch {
        // En cas d'erreur DB, renvoyer la liste FILTRÉE par entité,
        // jamais la liste complète non filtrée.
        return staticProjects;
      }
    },
    'Projects GET'
  );
}

export async function POST(request: NextRequest) {
  return apiHandler(
    async () => {
      const body = await request.json();
      const project = await prisma.project.create({
        data: body,
      });
      return project;
    },
    'Projects POST'
  );
}