'use client';

import React, { useMemo, useState } from 'react';
import {
  Users,
  Wrench,
  Truck,
  Plus,
  Search,
  Edit3,
  Trash2,
  Check,
  Clock,
  Upload,
  ImageIcon,
} from 'lucide-react';
import type { LogistikClientRow, LogistikEquipmentRow, LogistikSavRow } from './types';

interface Props {
  activeSubTab: 'clients' | 'sav' | 'fleet';
  clients: LogistikClientRow[];
  afterSalesLogs: LogistikSavRow[];
  equipment: LogistikEquipmentRow[];
  onRefresh: () => Promise<void>;
  notify: (msg: string, err?: boolean) => void;
}


const LOGISTIK_PRESET_IMAGES = [
  { label: '★ Mbao Usine — Stock & Parc matériel lourd', url: '/images/sbs-industries/sbs-mbao-agglos-creux-parc.jpg' },
  { label: '★ Mbao Usine — Pondeuse automatique QT40-3A', url: '/images/sbs-logistik/logistik-equip-068.jpg' },
  { label: '★ Mbao Usine — Centrale à béton 60 m³/h', url: '/images/sbs-logistik/logistik-equip-070.jpg' },
  { label: 'Grue mobile télescopique 50T Samsung', url: '/images/sbs-presentation/sbs-page06-img02.jpeg' },
  { label: 'Grue mobile 50T & nacelle télescopique', url: '/images/sbs-presentation/sbs-page06-img03.jpeg' },
  { label: 'Nacelle télescopique 30m Aichi', url: '/images/sbs-presentation/sbs-page06-img04.jpeg' },
  { label: 'Chargeuse sur pneus Caterpillar 950G', url: '/images/sbs-presentation/sbs-page06-img01.jpeg' },
  { label: 'Bétonnière hydraulique 1 000 L', url: '/images/sbs-presentation/sbs-page07-img01.jpeg' },
  { label: 'Dumper articulé tout-terrain FCY30R (3 tonnes)', url: '/images/sbs-presentation/sbs-page07-img02.jpeg' },
  { label: 'Camion benne 40T HOWO', url: '/images/sbs-presentation/sbs-page08-img01.jpeg' },
  { label: 'Camion plateau porte-engins 50T', url: '/images/sbs-presentation/sbs-page08-img02.jpeg' },
  { label: 'Camion grue 6T tout-terrain', url: '/images/sbs-presentation/sbs-page09-img01.jpeg' },
  { label: 'Camion toupie 10 m³ HOWO', url: '/images/sbs-logistik/logistik-equip-010.jpg' },
  { label: 'Pompe stationnaire Aquarius', url: '/images/sbs-logistik/logistik-equip-011.jpg' },
  { label: 'Tractopelle & rétrochargeuse', url: '/images/sbs-logistik/logistik-equip-002.jpg' },
  { label: 'Compacteur rouleau vibrant', url: '/images/sbs-logistik/logistik-equip-005.jpg' },
];

const AVAILABILITY_OPTIONS = [
  'Disponible',
  'En location',
  'Réservé',
  'En maintenance',
  'Hors service',
];

export function LogistikFleetSavTab({
  activeSubTab,
  clients,
  afterSalesLogs,
  equipment,
  onRefresh,
  notify,
}: Props) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Toutes');
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement');
      setEquipForm((p) => ({ ...p, imageUrl: data.url }));
      notify('Photo uploadée et associée avec succès !');
    } catch (err: any) {
      notify(err?.message || 'Erreur upload', true);
    } finally {
      setUploadingImage(false);
    }
  };


  // --- CLIENTS FORM ---
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientForm, setClientForm] = useState({
    identifier: '',
    fullName: '',
    company: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: 'Dakar',
    category: 'Entreprise BTP',
    notes: '',
  });

  // --- SAV FORM ---
  const [showSavForm, setShowSavForm] = useState(false);
  const [savForm, setSavForm] = useState({
    equipmentId: '',
    equipmentCode: '',
    equipmentTitle: '',
    equipmentBrand: '',
    clientId: '',
    clientName: '',
    clientPhone: '',
    type: 'Location active',
    priority: 'Normale',
    siteLocation: 'Dakar',
    operatorName: '',
    startDate: new Date().toISOString().slice(0, 10),
    expectedReturnDate: '',
    meterOut: '',
    conditionNotes: 'RAS — contrôle pré-départ validé',
    costFCFA: 0,
  });

  // --- FLEET (ENGIN) FORM ---
  const [showEquipForm, setShowEquipForm] = useState(false);
  const [editingEquip, setEditingEquip] = useState<LogistikEquipmentRow | null>(null);
  const [equipForm, setEquipForm] = useState({
    code: '',
    title: '',
    category: 'Terrassement & manutention',
    brand: 'Caterpillar',
    description: '',
    specs: '',
    usage: '',
    dailyRateFCFA: 120000,
    isPriceVisible: true,
    availability: 'Disponible',
    imageUrl: '/images/sbs-logistik/slides/page-01.jpg',
  });

  const callOp = async (entity: string, action: string, payload: Record<string, unknown>) => {
    const res = await fetch('/api/sbs-logistik/admin/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity, action, payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur opérationnelle');
    return data;
  };

  // ==================== 1. CLIENTS LOGISTIK ====================
  if (activeSubTab === 'clients') {
    const filteredClients = clients.filter((c) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.identifier.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    });

    const handleSaveClient = async (e: React.FormEvent) => {
      e.preventDefault();
      setBusy(true);
      try {
        const res = await callOp('client', 'create', clientForm);
        setShowClientForm(false);
        setClientForm({
          identifier: '',
          fullName: '',
          company: '',
          phone: '',
          whatsapp: '',
          email: '',
          address: '',
          city: 'Dakar',
          category: 'Entreprise BTP',
          notes: '',
        });
        await onRefresh();
        notify(`Client ${res.client?.code} créé.`);
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Erreur', true);
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              Fichier Clients SB-S Logistik (Codes, Identifiants & Coordonnées)
            </h2>
            <p className="text-xs text-slate-400">
              Codes clients séquentiels (`CLI-LOG-0001`), NINEA/RC, contacts directs et adresses
              chantier.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowClientForm((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau client</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher code client, NINEA/RC, nom, société ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
          />
        </div>

        {showClientForm && (
          <form
            onSubmit={handleSaveClient}
            className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
          >
            <input
              type="text"
              placeholder="Identifiant fiscal (NINEA / RC / CNI)"
              value={clientForm.identifier}
              onChange={(e) => setClientForm((p) => ({ ...p, identifier: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            />
            <input
              type="text"
              required
              placeholder="Nom & Prénom du contact *"
              value={clientForm.fullName}
              onChange={(e) => setClientForm((p) => ({ ...p, fullName: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Société / Maître d'ouvrage"
              value={clientForm.company}
              onChange={(e) => setClientForm((p) => ({ ...p, company: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="tel"
              required
              placeholder="Téléphone *"
              value={clientForm.phone}
              onChange={(e) => setClientForm((p) => ({ ...p, phone: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            />
            <input
              type="tel"
              placeholder="WhatsApp"
              value={clientForm.whatsapp}
              onChange={(e) => setClientForm((p) => ({ ...p, whatsapp: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            />
            <input
              type="email"
              placeholder="Email"
              value={clientForm.email}
              onChange={(e) => setClientForm((p) => ({ ...p, email: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Adresse / Coordonnées chantier"
              value={clientForm.address}
              onChange={(e) => setClientForm((p) => ({ ...p, address: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Ville / Zone"
              value={clientForm.city}
              onChange={(e) => setClientForm((p) => ({ ...p, city: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Créer fiche client (code auto)
            </button>
          </form>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Identifiant (NINEA/RC)</th>
                <th className="p-3">Nom & Société</th>
                <th className="p-3">Contacts (Tél / Email)</th>
                <th className="p-3">Coordonnées / Adresse</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-amber-400">{c.code}</td>
                  <td className="p-3 font-mono text-slate-300">{c.identifier || '—'}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{c.fullName}</div>
                    <div className="text-[11px] text-slate-400">{c.company || c.category}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-300">
                    <div>{c.phone}</div>
                    <div className="text-[11px] text-slate-400">{c.email || c.whatsapp}</div>
                  </td>
                  <td className="p-3 text-slate-300">
                    {c.address} {c.city ? `(${c.city})` : ''}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        await callOp('client', 'delete', { id: c.id });
                        await onRefresh();
                        notify('Client supprimé.');
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-rose-600/30 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ==================== 2. SUIVI : SERVICE APRÈS-VENTE / LOCATION ====================
  if (activeSubTab === 'sav') {
    const handleCreateSav = async (e: React.FormEvent) => {
      e.preventDefault();
      setBusy(true);
      try {
        const res = await callOp('sav', 'create', savForm);
        setShowSavForm(false);
        await onRefresh();
        notify(`Dossier suivi ${res.sav?.ticketNumber} ouvert.`);
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Erreur', true);
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              Suivi : Service Après-Vente / Location sur chantier
            </h2>
            <p className="text-xs text-slate-400">
              Traçabilité des sorties & retours d&apos;engins, compteurs horaires/km, maintenance
              préventive et incidents chantier.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSavForm((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Ouvrir fiche location / SAV</span>
          </button>
        </div>

        {showSavForm && (
          <form
            onSubmit={handleCreateSav}
            className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
          >
            <select
              required
              value={savForm.equipmentId}
              onChange={(e) => {
                const eq = equipment.find((x) => x.id === e.target.value);
                if (eq) {
                  setSavForm((p) => ({
                    ...p,
                    equipmentId: eq.id,
                    equipmentCode: eq.code,
                    equipmentTitle: eq.title,
                    equipmentBrand: eq.brand,
                  }));
                }
              }}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            >
              <option value="">-- Équipement / Engin concerné * --</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  [{eq.code}] {eq.title} ({eq.brand})
                </option>
              ))}
            </select>

            <select
              value={savForm.clientId}
              onChange={(e) => {
                const c = clients.find((x) => x.id === e.target.value);
                if (c) {
                  setSavForm((p) => ({
                    ...p,
                    clientId: c.id,
                    clientName: c.fullName,
                    clientPhone: c.phone,
                  }));
                }
              }}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            >
              <option value="">-- Client (ou saisie libre) --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.fullName}
                </option>
              ))}
            </select>

            <input
              type="text"
              required
              placeholder="Nom Client / Chantier *"
              value={savForm.clientName}
              onChange={(e) => setSavForm((p) => ({ ...p, clientName: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />

            <select
              value={savForm.type}
              onChange={(e) => setSavForm((p) => ({ ...p, type: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            >
              <option value="Location active">Location active (Départ chantier)</option>
              <option value="Retour matériel">Retour matériel & contrôle</option>
              <option value="Maintenance préventive">Maintenance préventive</option>
              <option value="Panne chantier">Panne / Dépannage chantier</option>
              <option value="Réclamation SAV">Réclamation SAV</option>
            </select>

            <input
              type="text"
              placeholder="Chauffeur / Opérateur affecté"
              value={savForm.operatorName}
              onChange={(e) => setSavForm((p) => ({ ...p, operatorName: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Lieu du chantier"
              value={savForm.siteLocation}
              onChange={(e) => setSavForm((p) => ({ ...p, siteLocation: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Compteur départ (heures / km)"
              value={savForm.meterOut}
              onChange={(e) => setSavForm((p) => ({ ...p, meterOut: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            />
            <input
              type="date"
              value={savForm.expectedReturnDate}
              onChange={(e) => setSavForm((p) => ({ ...p, expectedReturnDate: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Enregistrer suivi SAV / Location
            </button>
          </form>
        )}

        <div className="space-y-3">
          {afterSalesLogs.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                    {s.ticketNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[11px] font-bold">
                    {s.type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-semibold">
                    {s.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  [{s.equipmentCode}] {s.equipmentTitle} ({s.equipmentBrand})
                </div>
                <div className="text-xs text-slate-400">
                  Client : <strong className="text-slate-200">{s.clientName}</strong> · Chantier :{' '}
                  {s.siteLocation} · Opérateur : {s.operatorName || '—'} · Compteur départ :{' '}
                  {s.meterOut || '—'}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={s.status}
                  onChange={async (e) => {
                    await callOp('sav', 'update', { id: s.id, status: e.target.value });
                    await onRefresh();
                    notify('Statut SAV mis à jour.');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="En cours">En cours</option>
                  <option value="Planifié">Planifié</option>
                  <option value="Résolu">Résolu</option>
                  <option value="Clôturé">Clôturé</option>
                </select>
                <button
                  type="button"
                  onClick={async () => {
                    await callOp('sav', 'delete', { id: s.id });
                    await onRefresh();
                    notify('Fiche SAV supprimée.');
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {afterSalesLogs.length === 0 && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400">
              Aucune fiche SAV ou location active enregistrée.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 3. PARC ENGINS & MATÉRIELS (CATÉGORIE, DESCRIPTION, MARQUE, DISPO, MAJ) ====================
  const categories = useMemo(
    () => Array.from(new Set(equipment.map((e) => e.category))),
    [equipment]
  );

  const filteredFleet = equipment.filter((eq) => {
    const matchCat = catFilter === 'Toutes' || eq.category === catFilter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      eq.code.toLowerCase().includes(q) ||
      eq.title.toLowerCase().includes(q) ||
      eq.brand.toLowerCase().includes(q) ||
      eq.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleSaveEquip = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const method = editingEquip ? 'PUT' : 'POST';
      const body = editingEquip ? { id: editingEquip.id, ...equipForm } : equipForm;
      const res = await fetch('/api/sbs-logistik/admin/equipment', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur enregistrement matériel');
      setShowEquipForm(false);
      setEditingEquip(null);
      await onRefresh();
      notify(editingEquip ? 'Équipement mis à jour (synchronisé sur la vitrine) !' : 'Nouvel équipement ajouté.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    } finally {
      setBusy(false);
    }
  };

  const quickUpdateAvailability = async (id: string, availability: string) => {
    try {
      const res = await fetch('/api/sbs-logistik/admin/equipment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, availability }),
      });
      if (!res.ok) throw new Error('Mise à jour échouée');
      await onRefresh();
      notify(`Disponibilité mise à jour : ${availability}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            Parc Engins & Matériels (Catégorie, Description, Marque, Disponibilité, Mis à jour)
          </h2>
          <p className="text-xs text-slate-400">
            Toute modification (marque, tarif/j, description, disponibilité) met à jour la page
            publique `/entites/sbs-logistik` instantanément.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingEquip(null);
            setEquipForm({
              code: `MAT-${String(equipment.length + 1).padStart(3, '0')}`,
              title: '',
              category: categories[0] || 'Terrassement & manutention',
              brand: 'Caterpillar',
              description: '',
              specs: '',
              usage: '',
              dailyRateFCFA: 120000,
              isPriceVisible: true,
              availability: 'Disponible',
              imageUrl: '/images/sbs-logistik/slides/page-01.jpg',
            });
            setShowEquipForm((v) => !v);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un engin / matériel</span>
        </button>
      </div>

      {showEquipForm && (
        <form
          onSubmit={handleSaveEquip}
          className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
        >
          <input
            type="text"
            required
            placeholder="Code matériel (ex: ENG-069) *"
            value={equipForm.code}
            onChange={(e) => setEquipForm((p) => ({ ...p, code: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
          />
          <input
            type="text"
            required
            placeholder="Désignation engin / matériel *"
            value={equipForm.title}
            onChange={(e) => setEquipForm((p) => ({ ...p, title: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            type="text"
            required
            placeholder="Marque (Caterpillar, HOWO, Samsung...) *"
            value={equipForm.brand}
            onChange={(e) => setEquipForm((p) => ({ ...p, brand: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            type="text"
            required
            list="logistik-cats-list"
            placeholder="Catégorie d'engins / Matériels *"
            value={equipForm.category}
            onChange={(e) => setEquipForm((p) => ({ ...p, category: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <datalist id="logistik-cats-list">
            {categories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          <select
            value={equipForm.availability}
            onChange={(e) => setEquipForm((p) => ({ ...p, availability: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          >
            {AVAILABILITY_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            placeholder="Tarif / jour FCFA"
            value={equipForm.dailyRateFCFA}
            onChange={(e) =>
              setEquipForm((p) => ({ ...p, dailyRateFCFA: Number(e.target.value) || 0 }))
            }
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
          />
          <textarea
            rows={2}
            placeholder="Description détaillée de l'engin / matériel..."
            value={equipForm.description}
            onChange={(e) => setEquipForm((p) => ({ ...p, description: e.target.value }))}
            className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <input
            type="text"
            placeholder="Spécifications techniques"
            value={equipForm.specs}
            onChange={(e) => setEquipForm((p) => ({ ...p, specs: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          />
          <div className="md:col-span-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowEquipForm(false);
                setEditingEquip(null);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingEquip ? 'Mettre à jour' : 'Créer dans le parc'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer par code, engin, marque ou description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
        >
          <option value="Toutes">Toutes catégories ({categories.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Désignation & Description</th>
              <th className="p-3">Marque</th>
              <th className="p-3">Disponibilité</th>
              <th className="p-3 text-right">Tarif/j</th>
              <th className="p-3">Mis à jour</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredFleet.map((eq) => (
              <tr key={eq.id} className="hover:bg-slate-800/40 align-top">
                <td className="p-3 font-mono font-bold text-amber-400">
                  <div className="flex items-center gap-2">
                    {eq.imageUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={eq.imageUrl}
                        alt={eq.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-950"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span>{eq.code}</span>
                  </div>
                </td>
                <td className="p-3 text-slate-300 font-medium">{eq.category}</td>
                <td className="p-3 max-w-xs">
                  <div className="font-bold text-white">{eq.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {eq.description}
                  </div>
                </td>
                <td className="p-3 font-semibold text-sky-300">{eq.brand}</td>
                <td className="p-3">
                  <select
                    value={eq.availability}
                    onChange={(e) => quickUpdateAvailability(eq.id, e.target.value)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border bg-slate-950 ${
                      eq.availability === 'Disponible'
                        ? 'border-emerald-500/50 text-emerald-300'
                        : eq.availability === 'En location'
                          ? 'border-amber-500/50 text-amber-300'
                          : 'border-rose-500/50 text-rose-300'
                    }`}
                  >
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-right font-mono text-white">
                  {eq.dailyRateFCFA > 0 ? `${eq.dailyRateFCFA.toLocaleString('fr-FR')} F` : 'Devis'}
                </td>
                <td className="p-3 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(eq.updatedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{eq.updatedBy}</div>
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEquip(eq);
                        setEquipForm({
                          code: eq.code,
                          title: eq.title,
                          category: eq.category,
                          brand: eq.brand,
                          description: eq.description,
                          specs: eq.specs,
                          usage: eq.usage,
                          dailyRateFCFA: eq.dailyRateFCFA,
                          isPriceVisible: eq.isPriceVisible,
                          availability: eq.availability,
                          imageUrl: eq.imageUrl,
                        });
                        setShowEquipForm(true);
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300"
                      title="Modifier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch(`/api/sbs-logistik/admin/equipment?id=${encodeURIComponent(eq.id)}`, {
                          method: 'DELETE',
                        });
                        await onRefresh();
                        notify(`Équipement ${eq.code} supprimé.`);
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-rose-600/30 text-rose-400"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
