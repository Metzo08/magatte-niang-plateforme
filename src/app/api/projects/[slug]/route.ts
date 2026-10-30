import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { PROJECTS } from '@/data/initialData';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (project) {
      return NextResponse.json(project);
    }
  } catch (error) {
    console.warn('Database error, falling back to PROJECTS:', error);
  }

  // Fallback to static PROJECTS
  const fallbackProject = PROJECTS.find((p) => p.slug === slug);
  if (fallbackProject) {
    return NextResponse.json(fallbackProject);
  }

  return NextResponse.json(
    { error: 'Project not found' },
    { status: 404 }
  );
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  try {
    const body = await request.json();
    const project = await prisma.project.update({
      where: { slug },
      data: body,
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  try {
    await prisma.project.delete({
      where: { slug },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
