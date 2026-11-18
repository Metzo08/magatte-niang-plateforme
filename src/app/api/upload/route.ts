import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
    }

    const mime = file.type || 'image/jpeg';
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (mime && !allowed.includes(mime)) {
      return NextResponse.json(
        { error: 'Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WEBP, GIF, SVG.' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Taille maximale dépassée (max 10 Mo).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let ext = path.extname(file.name).toLowerCase();
    if (!ext) {
      if (mime === 'image/png') ext = '.png';
      else if (mime === 'image/webp') ext = '.webp';
      else if (mime === 'image/svg+xml') ext = '.svg';
      else ext = '.jpg';
    }

    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .slice(0, 30);

    const filename = `${cleanBase || 'photo'}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}${ext}`;

    // 1. Essai d'enregistrement disque + service dynamique /api/uploads/<filename>
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      return NextResponse.json({
        success: true,
        url: `/api/uploads/${filename}`,
        filename,
        size: file.size,
      });
    } catch {
      // 2. Fallback serverless (filesystem lecture seule, ex: Vercel) -> data URI
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image trop volumineuse pour le mode cloud sans disque (max 2 Mo).' },
          { status: 400 }
        );
      }
      const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename,
        size: file.size,
      });
    }
  } catch (err: any) {
    console.error('Image upload error:', err);
    return NextResponse.json(
      { error: err.message || "Erreur interne lors de l'enregistrement de l'image." },
      { status: 500 }
    );
  }
}
