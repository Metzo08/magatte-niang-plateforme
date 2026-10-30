/* eslint-disable @next/next/no-img-element */

const REALISATIONS = [
  {
    src: '/images/reelles/sbs-labo-reel-001.jpg',
    title: 'Études de sol G2AVP — tour R+16, Dakar Plateau',
    desc: "Campagne complète de reconnaissance géotechnique : sondages carottés à 45 m, essais pressiométriques et recommandations de fondations profondes (pieux forés 800 mm) validées par le bureau de contrôle.",
    tag: 'Géotechnique · 2024',
  },
  {
    src: '/images/reelles/sbs-labo-reel-002.jpg',
    title: 'Essais de portance — plateformes & couches de forme',
    desc: "Essais Proctor, CBR et compacité in-situ pour la validation continue des plateformes des chantiers SB-S Group (VRD, voiries et zones industrielles).",
    tag: 'Contrôle in-situ · continu',
  },
  {
    src: '/images/reelles/sbs-labo-reel-003.jpg',
    title: "Analyses béton frais & durci — centrale 60 m³/h",
    desc: "Écrasement d'éprouvettes, slump et suivi de formulation pour la certification continue des bétons préfabriqués SB-S Industries et des BPE livrés sur chantiers.",
    tag: 'Laboratoire béton · agréé C2',
  },
  {
    src: '/images/reelles/sbs-labo-reel-004.jpg',
    title: "Contrôle qualité — usine d'oxygène PSA, Mako (Kédougou)",
    desc: "Études de sol préalables et contrôle qualité du génie civil pour l'implantation de l'usine d'oxygène PSA 6 T/j en région isolée (2023).",
    tag: 'Industrie · 2023',
  },
  {
    src: '/images/reelles/sbs-labo-reel-006.jpg',
    title: 'Auscultation & essais — dallage Gorée Offshore',
    desc: "Validation de la formulation béton et contrôle du dallage industriel soumis aux charges roulantes lourdes et à l'exposition aux hydrocarbures (2025).",
    tag: 'Infrastructures · 2025',
  },
];

export default function LaboRealizations() {
  return (
    <section className="py-16 bg-neutral-50 dark:bg-brand-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Références réalisées
          </p>
          <h2 className="mt-2 text-3xl font-bold text-brand-900 dark:text-white">
            Nos réalisations SB-S Labo
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-neutral-600 dark:text-neutral-300">
            Agréé catégories C2 et A2 dans le cadre du référentiel LNR-BTP (loi n° 2023-12, décret n° 2023-1780),
            SB-S Labo intervient sur les études de sol, les essais sur roches et les analyses béton de tous les
            projets structurants du groupe. Chaque mission débouche sur un procès-verbal traçable.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REALISATIONS.map((r) => (
            <article
              key={r.src}
              className="group overflow-hidden rounded-l border border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-800 shadow-elev-2 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] bg-neutral-200 dark:bg-brand-700">
                <img
                  src={r.src}
                  alt={r.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 bg-brand-900/90 text-white text-xs px-2.5 py-1 rounded">
                  {r.tag}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-brand-900 dark:text-white">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{r.desc}</p>
              </div>
            </article>
          ))}

          <article className="rounded-l border border-brand-600 dark:border-brand-500 bg-brand-900 text-white p-6 flex flex-col justify-center shadow-elev-2">
            <h3 className="text-xl font-bold">Un essai à réaliser ?</h3>
            <p className="mt-3 text-sm text-neutral-100">
              Études de sol (G2AVP), essais sur sols et roches, analyses béton frais et durci, levés topographiques.
              PV émis sous 48 heures.
            </p>
            <a
              href="/contact"
              className="mt-5 inline-block rounded-l bg-white text-brand-900 font-semibold text-sm px-5 py-2.5 text-center hover:bg-neutral-100 transition-colors"
            >
              Demander un essai
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
