'use client';

import React, { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  onNotify?: (msg: string, err?: boolean) => void;
}

export function ImageUploadField({
  value,
  onChange,
  label = 'Photo du produit / engin',
  placeholder = 'URL de la photo ou téléverser un fichier...',
  onNotify,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement de la photo');
      onChange(data.url);
      onNotify?.('Photo téléversée avec succès !');
    } catch (err: any) {
      onNotify?.(err?.message || 'Erreur upload photo', true);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-semibold text-slate-300">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-500" />
          )}
        </div>
        <div className="flex-1 min-w-[180px] space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
          />
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Envoi...' : value ? 'Changer la photo' : 'Importer une photo'}</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/70 hover:bg-red-900 border border-red-800/60 text-red-200 text-[11px] font-semibold"
              >
                <Trash2 className="w-3 h-3" /> Supprimer photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
