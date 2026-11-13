import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
    }

    const mime = file.type || '';
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (mime && !allowed.includes(mime)) {
      return NextResponse.json(
        { error: 'Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WEBP, GIF, SVG.' },
        { status: 400 }
      );
    }

    // Limite à 10 Mo
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Taille maximale dépassée (max 10 Mo).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

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
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/images/uploads/${filename}`,
      filename,
      size: file.size,
    });
  } catch (err: any) {
    console.error('Image upload error:', err);
    return NextResponse.json(
      { error: err.message || "Erreur interne lors de l'enregistrement de l'image." },
      { status: 500 }
    );
  }
}
