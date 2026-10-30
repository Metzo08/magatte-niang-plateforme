'use client';

/**
 * Devis carreaux imprimable — génère une fenêtre d'impression (PDF via Ctrl+P / Enregistrer en PDF).
 * Contenu conforme au cahier des charges §9 : en-tête entreprise, numéro/date, validité, client/chantier,
 * tableau (désignation, surface, cartons, m² livrés, prix/m², prix carton, montant), HT/TVA/TTC,
 * conditions, mention arrondi au carton entier.
 */
import { TileQuote } from '@/lib/tileStore';

export function printTileQuote(q: TileQuote) {
  const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');
  const dateStr = new Date(q.date).toLocaleDateString('fr-FR');
  const validUntil = new Date(new Date(q.date).getTime() + q.validiteJours * 86400000).toLocaleDateString('fr-FR');

  const rows = q.lignes.map((l, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${l.designation}</td>
      <td class="num">${fmt(l.surfaceM2)}</td>
      <td class="num">${l.nbCartons}</td>
      <td class="num">${fmt(l.m2Livres)}</td>
      <td class="num">${fmt(l.prixVenteM2)}</td>
      <td class="num">${fmt(l.prixVenteCarton)}</td>
      <td class="num">${fmt(l.montantLigne)}</td>
    </tr>`).join('');

  const poidsTotal = q.lignes.reduce((s, l) => s + (l.poidsLigne ?? 0), 0);

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
  <title>${q.numero}</title>
  <style>
    * { font-family: 'Segoe UI', Arial, sans-serif; box-sizing: border-box; }
    body { margin: 0; padding: 32px; color: #1a1a1a; font-size: 12px; }
    header { display: flex; justify-content: space-between; border-bottom: 3px solid #C0562F; padding-bottom: 12px; margin-bottom: 20px; }
    h1 { color: #C0562F; margin: 0; font-size: 20px; }
    .co { font-size: 10px; color: #555; line-height: 1.5; }
    .meta { text-align: right; }
    .meta .num { font-size: 16px; font-weight: 700; }
    h2 { font-size: 13px; border-left: 4px solid #C0562F; padding-left: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; }
    th { background: #f5e6de; text-align: left; font-size: 10.5px; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    .totals td { border: none; padding: 3px 0; }
    .totals .lbl { text-align: right; padding-right: 16px; }
    .totals .ttc { font-weight: 700; font-size: 14px; color: #C0562F; }
    .note { font-size: 10px; color: #555; margin-top: 18px; line-height: 1.6; }
    .client-grid { display: flex; gap: 32px; margin-bottom: 8px; }
    @media print { body { padding: 16px; } }
  </style></head><body>
  <header>
    <div>
      <h1>P2M — Polytech Matériaux &amp; Matériels</h1>
      <div class="co">Showroom Mbao Ville Neuve, Villa S04, Dakar — Sénégal<br>
      +221 78 832 12 79 / +221 78 424 64 45 — p2m.senegal@gmail.com</div>
    </div>
    <div class="meta">
      <div class="num">DEVIS ${q.numero}</div>
      <div class="co">Date : ${dateStr}<br>Validité : ${q.validiteJours} jours (jusqu'au ${validUntil})<br>Statut : ${q.statut}</div>
    </div>
  </header>

  <div class="client-grid">
    <div><h2>Client</h2>${q.clientNom || '—'}<br>${q.clientTelephone || ''}</div>
    <div><h2>Chantier</h2>${q.adresseChantier || '—'}</div>
  </div>

  <h2>Détail des carreaux</h2>
  <table>
    <thead><tr>
      <th>#</th><th>Désignation</th><th>Surface (m²)</th><th>Cartons</th>
      <th>m² livrés</th><th>Prix/m² (F)</th><th>Prix carton (F)</th><th>Montant (F)</th>
    </tr></thead>
    <tbody>${rows || '<tr><td colspan="8">Aucune ligne</td></tr>'}</tbody>
  </table>

  <table class="totals" style="width:340px; margin-left:auto;">
    <tr><td class="lbl">Total HT</td><td class="num">${fmt(q.totalHT)} FCFA</td></tr>
    <tr><td class="lbl">TVA (${Math.round(q.tauxTva * 100)} %)</td><td class="num">${fmt(q.tva)} FCFA</td></tr>
    <tr><td class="lbl ttc">TOTAL TTC</td><td class="num ttc">${fmt(q.totalTTC)} FCFA</td></tr>
  </table>

  ${poidsTotal > 0 ? `<p class="co">Poids total estimé : ${fmt(poidsTotal)} kg</p>` : ''}

  <div class="note">
    <strong>Mention : fournir le nombre de cartons arrondi au carton entier.</strong> Marge de perte de
    ${Math.round(q.tauxPerte * 100)} % incluse pour coupes et casse. Prix en FCFA hors taxes ; TVA ${Math.round(q.tauxTva * 100)} %.
    Conditions de paiement : 50 % à la commande, solde à la livraison. Livraison sous 48–72 h à Dakar
    (délais hors zone à confirmer). Devis valable ${q.validiteJours} jours.
  </div>
  <script>window.onload = () => { window.print(); }</script>
  </body></html>`;

  const w = window.open('', '_blank', 'width=900,height=1000');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
