'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, BookOpen, History, KeyRound } from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type { SbsFactoryConfigData } from '@/lib/sbsErpDefaults';
import { fmtFCFA, fmtNum } from './sbsFormat';

export default function SbsParametresTab({
  config,
  computed,
  auditLogs,
  onChangeConfig,
  onChangePassword,
}: {
  config: SbsFactoryConfigData;
  computed: SbsErpComputedReport;
  auditLogs: { id: string; action: string; actor: string; createdAt: string; details?: any }[];
  onChangeConfig: (next: SbsFactoryConfigData) => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}) {
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  const updateRawMaterial = (idx: number, patch: any) => {
    const next = config.rawMaterials.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    onChangeConfig({ ...config, rawMaterials: next });
  };

  const updateDepreciation = (idx: number, patch: any) => {
    const next = config.depreciations.map((d, i) => (i === idx ? { ...d, ...patch } : d));
    onChangeConfig({ ...config, depreciations: next });
  };

  const updatePayroll = (idx: number, patch: any) => {
    const next = config.fixedPayroll.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    onChangeConfig({ ...config, fixedPayroll: next });
  };

  const submitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdErr('');
    try {
      await onChangePassword(curPwd, newPwd);
      setPwdMsg('Mot de passe mis à jour avec succès.');
      setCurPwd('');
      setNewPwd('');
    } catch (err: any) {
      setPwdErr(err?.message || 'Erreur lors du changement de mot de passe.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Informations Usine & Coordonnées */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-4">
        <h2 className="font-title font-bold text-lg text-brand-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent-500" />
          Paramètres Généraux de l&apos;Usine SBS Industrie
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block font-semibold mb-1">Nom affiché</label>
            <input
              type="text"
              value={config.companyName}
              onChange={(e) => onChangeConfig({ ...config, companyName: e.target.value })}
              className="w-full px-3 py-2 rounded border border-amber-300 bg-amber-50/50 dark:bg-brand-950"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Téléphone</label>
            <input
              type="text"
              value={config.phone}
              onChange={(e) => onChangeConfig({ ...config, phone: e.target.value })}
              className="w-full px-3 py-2 rounded border border-amber-300 bg-amber-50/50 dark:bg-brand-950 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Adresse usine / dépôt</label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => onChangeConfig({ ...config, address: e.target.value })}
              className="w-full px-3 py-2 rounded border border-amber-300 bg-amber-50/50 dark:bg-brand-950"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Zone de livraison</label>
            <input
              type="text"
              value={config.deliveryZone}
              onChange={(e) => onChangeConfig({ ...config, deliveryZone: e.target.value })}
              className="w-full px-3 py-2 rounded border border-amber-300 bg-amber-50/50 dark:bg-brand-950"
            />
          </div>
        </div>
      </div>

      {/* A. Matières Premières */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
        <h3 className="font-title font-bold text-base text-brand-900 dark:text-white">
          A. Matières Premières &amp; Constantes Béton
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-900 text-white text-left">
              <tr>
                <th className="py-2 px-3">Matière</th>
                <th className="py-2 px-3 text-right">Prix (F CFA)</th>
                <th className="py-2 px-3">Unité</th>
                <th className="py-2 px-3 text-right">Densité (kg/m³ ou kg)</th>
                <th className="py-2 px-3 text-right">Qté/livraison</th>
                <th className="py-2 px-3 text-right">Prix au kg ou L (F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {config.rawMaterials.map((m, i) => {
                const rate = computed.rawMaterialRates.find((r) => r.code === m.code);
                return (
                  <tr key={m.code}>
                    <td className="py-2 px-3 font-semibold">{m.name}</td>
                    <td className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={m.priceFCFA}
                        onChange={(e) => updateRawMaterial(i, { priceFCFA: Number(e.target.value) || 0 })}
                        className="w-28 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                      />
                    </td>
                    <td className="py-2 px-3">{m.unit}</td>
                    <td className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        value={m.densityKgM3}
                        onChange={(e) => updateRawMaterial(i, { densityKgM3: Number(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                      />
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        value={m.qtyPerDelivery}
                        onChange={(e) => updateRawMaterial(i, { qtyPerDelivery: Number(e.target.value) || 0 })}
                        className="w-20 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                      {fmtNum(rate?.pricePerKgOrL ?? 0, 2)} F
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div>
            <label className="block font-semibold mb-1">Volume brouette (L)</label>
            <input
              type="number"
              value={config.wheelbarrowVolumeL}
              onChange={(e) => onChangeConfig({ ...config, wheelbarrowVolumeL: Number(e.target.value) || 60 })}
              className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Masse vol. béton frais (kg/m³)</label>
            <input
              type="number"
              value={config.freshConcreteDensityKgM3}
              onChange={(e) =>
                onChangeConfig({ ...config, freshConcreteDensityKgM3: Number(e.target.value) || 2300 })
              }
              className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tarif MOD (F/tonne ciment)</label>
            <input
              type="number"
              value={config.modPerCementTonFCFA}
              onChange={(e) =>
                onChangeConfig({ ...config, modPerCementTonFCFA: Number(e.target.value) || 0 })
              }
              className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Forfait Électricité (%)</label>
            <input
              type="number"
              step="0.5"
              value={config.electricityRatePercent}
              onChange={(e) =>
                onChangeConfig({ ...config, electricityRatePercent: Number(e.target.value) || 0 })
              }
              className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">TVA Sénégal (%)</label>
            <input
              type="number"
              step="1"
              value={config.tvaRatePercent}
              onChange={(e) => onChangeConfig({ ...config, tvaRatePercent: Number(e.target.value) || 18 })}
              className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* C, D, E : Charges Fixes, Amortissements & Main d'oeuvre fixe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-title font-bold text-sm">C. Charges Fixes Mensuelles</h3>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {fmtFCFA(computed.totalChargesFixesBase)}
            </span>
          </div>
          {[
            { key: 'loyer', label: 'Loyer / terrain' },
            { key: 'assurances', label: 'Assurances' },
            { key: 'impots', label: 'Impôts et taxes' },
            { key: 'entretien', label: 'Entretien' },
            { key: 'transport', label: 'Transport / carburant' },
            { key: 'fraisAdmin', label: 'Frais administratifs' },
            { key: 'gardiennage', label: 'Gardiennage' },
            { key: 'autres', label: 'Autres' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-2">
              <span className="text-neutral-700 dark:text-neutral-300">{item.label}</span>
              <input
                type="number"
                value={(config.fixedCharges as any)[item.key] ?? 0}
                onChange={(e) =>
                  onChangeConfig({
                    ...config,
                    fixedCharges: {
                      ...config.fixedCharges,
                      [item.key]: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-28 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
              />
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-title font-bold text-sm">D. Amortissements</h3>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {fmtFCFA(computed.totalAmortissementsMensuels, 2)}/m
            </span>
          </div>
          {config.depreciations.map((d, i) => (
            <div key={d.id} className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-5 font-medium truncate">{d.equipment}</span>
              <input
                type="number"
                value={d.valueFCFA}
                onChange={(e) => updateDepreciation(i, { valueFCFA: Number(e.target.value) || 0 })}
                className="col-span-4 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
              />
              <input
                type="number"
                min={1}
                value={d.durationYears}
                onChange={(e) => updateDepreciation(i, { durationYears: Math.max(1, Number(e.target.value) || 1) })}
                title="Durée (ans)"
                className="col-span-3 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
              />
            </div>
          ))}
          <div className="pt-2 border-t border-neutral-200 dark:border-brand-700 flex justify-between font-bold">
            <span>TOTAL FRAIS FIXES MENSUELS</span>
            <span className="font-mono text-brand-900 dark:text-white">
              {fmtFCFA(computed.totalFraisFixesMensuels, 2)}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-title font-bold text-sm">E. Main d&apos;œuvre fixe</h3>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {fmtFCFA(computed.totalMainOeuvreFixe)}/m
            </span>
          </div>
          {config.fixedPayroll.map((p, i) => (
            <div key={p.id} className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-5 font-medium truncate" title={p.role}>{p.role}</span>
              <input
                type="number"
                min={0}
                value={p.headcount}
                onChange={(e) => updatePayroll(i, { headcount: Math.max(0, Number(e.target.value) || 0) })}
                className="col-span-3 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
              />
              <input
                type="number"
                min={0}
                value={p.monthlySalaryFCFA}
                onChange={(e) => updatePayroll(i, { monthlySalaryFCFA: Math.max(0, Number(e.target.value) || 0) })}
                className="col-span-4 px-2 py-1 text-right rounded border border-amber-300 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
              />
            </div>
          ))}
          <p className="text-[11px] text-neutral-500">
            Note : les ouvriers payés à la tonne de ciment ({fmtFCFA(config.modPerCementTonFCFA)}/t) sont imputés directement dans la colonne MOD du prix de revient.
          </p>
        </div>
      </div>

      {/* Mode d'emploi & Sécurité + Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sécurité Compte Gestionnaire */}
        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-4">
          <h3 className="font-title font-bold text-base text-brand-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-accent-500" />
            Sécurité — Mot de passe Gestionnaire SBS Industrie
          </h3>
          <form onSubmit={submitPwd} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                required
                placeholder="Mot de passe actuel"
                value={curPwd}
                onChange={(e) => setCurPwd(e.target.value)}
                className="px-3 py-2 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
              />
              <input
                type="password"
                required
                minLength={10}
                placeholder="Nouveau mot de passe (min 10 car.)"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="px-3 py-2 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
              />
            </div>
            {pwdMsg && <p className="text-emerald-600 font-semibold">{pwdMsg}</p>}
            {pwdErr && <p className="text-red-600 font-semibold">{pwdErr}</p>}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-m bg-brand-900 text-white font-bold"
            >
              <ShieldCheck className="w-4 h-4" /> Mettre à jour le mot de passe
            </button>
          </form>

          <div className="pt-3 border-t border-neutral-200 dark:border-brand-700 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-neutral-700 dark:text-neutral-200">
              <History className="w-4 h-4 text-accent-500" /> Dernières opérations journalisées
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 text-[11px]">
              {auditLogs.slice(0, 12).map((log) => (
                <div key={log.id} className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>
                    <strong className="text-brand-900 dark:text-white">{log.action}</strong> par {log.actor}
                  </span>
                  <span className="font-mono">{new Date(log.createdAt).toLocaleString('fr-FR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notice Interactive issue d'Excel */}
        <div className="bg-brand-50 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-700 rounded-l p-5 space-y-2.5">
          <h3 className="font-title font-bold text-base text-brand-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            Mode d&apos;emploi de l&apos;ERP SBS Industrie
          </h3>
          <p>• <strong>Zones ambre/jaunes</strong> : champs à saisir par le gestionnaire (dimensions, prix, production, consommations réelles, stocks début, charges).</p>
          <p>• <strong>Zones vertes</strong> : indicateurs calculés automatiquement sans aucune référence circulaire (Coût matières, Prix de revient, Compacité, MCV, Seuil, Résultat net).</p>
          <p>• <strong>Synchronisation boutique publique</strong> : modifier un prix ou une dimension dans l&apos;onglet Catalogue met immédiatement à jour la page publique <code>/entites/sbs-industries</code>.</p>
          <p>• <strong>Export Excel</strong> : le bouton « Export Excel (.xls) » en haut génère à tout moment un classeur complet à jour pour vos archives comptables.</p>
        </div>
      </div>
    </div>
  );
}
