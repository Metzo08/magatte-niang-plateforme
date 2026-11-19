import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { PUBLICATIONS } from '@/data/initialData';
import {
  ENTITY_AUTH_MAP,
  getAuthenticatedEntityManager,
  getAuthenticatedSuperAdmin,
  ManagedEntityId,
} from '@/lib/entityAuth';
import { getAuthenticatedSbsManager } from '@/lib/sbsAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface PressArticleItem {
  id: string;
  title: string;
  type: 'Presse';
  date: string;
  abstract: string;
  content?: string;
  journalOrEvent: string;
  authors: string[];
  entityId?: string;
  imageUrl?: string;
  downloadUrl?: string;
  updatedAt?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'press-articles.json');
let memoryStore: PressArticleItem[] | null = null;

function initialSeed(): PressArticleItem[] {
  return PUBLICATIONS.filter((p) => p.type === 'Presse').map((p) => ({
    id: p.id,
    title: p.title,
    type: 'Presse',
    date: p.date,
    abstract: p.abstract,
    journalOrEvent: p.journalOrEvent || 'Groupe Magatte Niang',
    authors: p.authors || ['Direction Communication'],
    entityId: 'sbs-group',
    downloadUrl: p.downloadUrl,
  }));
}

async function readArticles(): Promise<PressArticleItem[]> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryStore = parsed;
      return parsed;
    }
  } catch {
    // file does not exist yet
  }
  if (!memoryStore) {
    memoryStore = initialSeed();
  }
  return memoryStore;
}

async function persistArticles(items: PressArticleItem[]): Promise<void> {
  memoryStore = items;
  try {
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
  } catch {
    // serverless read-only fallback: keep in memoryStore
  }
}

async function getAuthenticatedAuthor(): Promise<string | null> {
  const superAdmin = await getAuthenticatedSuperAdmin();
  if (superAdmin) return superAdmin.displayName;

  const sbsInd = await getAuthenticatedSbsManager();
  if (sbsInd) return sbsInd.displayName || sbsInd.username;

  for (const entityId of Object.keys(ENTITY_AUTH_MAP) as ManagedEntityId[]) {
    const mgr = await getAuthenticatedEntityManager(entityId);
    if (mgr) return mgr.displayName || mgr.username;
  }
  return null;
}

export async function GET() {
  const items = await readArticles();
  const sorted = [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return NextResponse.json({ articles: sorted });
}

export async function POST(req: NextRequest) {
  const actor = await getAuthenticatedAuthor();
  if (!actor) {
    return NextResponse.json({ error: 'Authentification administrateur requise.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = String(body.title || '').trim();
    const abstract = String(body.abstract || '').trim();
    if (!title || !abstract) {
      return NextResponse.json({ error: 'Titre et résumé obligatoires.' }, { status: 400 });
    }

    const items = await readArticles();
    const article: PressArticleItem = {
      id: `press-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      type: 'Presse',
      date: String(body.date || new Date().toISOString().slice(0, 10)),
      abstract,
      content: String(body.content || '').trim(),
      journalOrEvent: String(body.journalOrEvent || 'Communiqué officiel').trim(),
      authors: Array.isArray(body.authors)
        ? body.authors.map(String)
        : String(body.authors || actor)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      entityId: body.entityId ? String(body.entityId) : undefined,
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : '',
      updatedAt: new Date().toISOString(),
    };

    await persistArticles([article, ...items]);
    return NextResponse.json({ article }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const actor = await getAuthenticatedAuthor();
  if (!actor) {
    return NextResponse.json({ error: 'Authentification administrateur requise.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'ID article requis.' }, { status: 400 });
    }

    const items = await readArticles();
    const idx = items.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 });
    }

    const prev = items[idx];
    const updated: PressArticleItem = {
      ...prev,
      title: body.title !== undefined ? String(body.title).trim() : prev.title,
      date: body.date !== undefined ? String(body.date).trim() : prev.date,
      abstract: body.abstract !== undefined ? String(body.abstract).trim() : prev.abstract,
      content: body.content !== undefined ? String(body.content).trim() : prev.content,
      journalOrEvent:
        body.journalOrEvent !== undefined ? String(body.journalOrEvent).trim() : prev.journalOrEvent,
      authors:
        body.authors !== undefined
          ? Array.isArray(body.authors)
            ? body.authors.map(String)
            : String(body.authors)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
          : prev.authors,
      entityId: body.entityId !== undefined ? String(body.entityId) : prev.entityId,
      imageUrl: body.imageUrl !== undefined ? String(body.imageUrl).trim() : prev.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    const next = [...items];
    next[idx] = updated;
    await persistArticles(next);
    return NextResponse.json({ article: updated });
  } catch {
    return NextResponse.json({ error: 'Erreur mise à jour article.' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const actor = await getAuthenticatedAuthor();
  if (!actor) {
    return NextResponse.json({ error: 'Authentification administrateur requise.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID article requis.' }, { status: 400 });
  }

  const items = await readArticles();
  const next = items.filter((a) => a.id !== id);
  await persistArticles(next);
  return NextResponse.json({ ok: true });
}
