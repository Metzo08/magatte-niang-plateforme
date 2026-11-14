'use client';

import { useState, type SVGProps } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, CheckCircle, Send, Loader2, Building2, Linkedin, Facebook, Youtube, Instagram, MessageCircle, Globe } from 'lucide-react';
import { SOCIAL_LINKS } from '@/data/socialLinks';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { store } from '@/lib/store';
import { SITE_IMAGES } from '@/data/siteImages';
import InteractiveLocationMap from '@/components/maps/InteractiveLocationMap';

const TikTokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const OFFICES = [
  {
    entity: 'SB-S Group · Siège & Direction Générale',
    address: 'Mbao Villeneuve, Villa S04, Route Nationale (proximité ZFI de Mbao)',
    city: 'Mbao, Dakar (Pikine)',
    phone: '+221 33 871 08 61',
    email: 'contact@magatteniang-expert.sn',
    whatsapp: '+221 77 566 48 06',
    hours: 'Lun–Sam : 08h00 – 18h00',
    color: '#D4AF37',
  },
  {
    entity: 'SBS Industrie · Usine de Préfabrication',
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    city: 'Mbao, Dakar (Pikine)',
    phone: '+221 33 871 08 61',
    email: 'industrie@sbsgroup.sn',
    whatsapp: '+221 77 566 48 06',
    hours: 'Lun–Sam : 07h30 – 18h00',
    color: '#6B7A8F',
  },
  {
    entity: 'SBS Logistik · Engins BTP & Levage',
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    city: 'Mbao, Dakar (Pikine)',
    phone: '+221 33 871 08 61',
    email: 'logistik@sbsgroup.sn',
    whatsapp: '+221 77 858 61 05',
    hours: '24h/24 – 7j/7 sur astreinte chantiers',
    color: '#D97706',
  },
  {
    entity: 'SERMA BTP · Ateliers de Charpente Métallique',
    address: 'Zone Industrielle de Dakar, Km 14 Route de Rufisque',
    city: 'Dakar',
    phone: '+221 33 871 08 61',
    email: 'contact@sermabtp.com',
    whatsapp: '+221 77 267 16 17',
    hours: 'Lun–Sam : 07h30 – 18h00',
    color: '#1B4965',
  },
  {
    entity: 'SB-S Labo · Géotechnique & Essais Béton',
    address: 'Cité Keur Gorgui, Immeuble R+5, Dakar',
    city: 'Dakar',
    phone: '+221 33 871 08 61',
    email: 'labo@sbsgroup.sn',
    whatsapp: '+221 77 267 16 17',
    hours: 'Lun–Ven : 08h00 – 17h30',
    color: '#3A7D6F',
  },
];

const TIMESLOTS = [
  '08h00 – 09h00', '09h00 – 10h00', '10h00 – 11h00', '11h00 – 12h00',
  '14h00 – 15h00', '15h00 – 16h00', '16h00 – 17h00', '17h00 – 18h00',
];

const MEETING_TYPES = [
  { value: 'conseil', label: '💬 Conseil technique gratuit (30 min)' },
  { value: 'etude', label: '📋 Étude de projet (1h)' },
  { value: 'visite', label: '🏗️ Visite de chantier' },
  { value: 'demo', label: '🔬 Démonstration labo' },
  { value: 'partenariat', label: '🤝 Partenariat / collaboration' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '',
    subject: '', message: '', meetingType: '', date: '', time: '',
    entity: 'direction',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'message' | 'rdv'>('message');

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    if (activeTab === 'rdv' && formData.date && formData.time) {
      const typeMapping: Record<string, 'Direction' | 'Consultation technique' | 'Réunion de projet' | 'Visite de chantier' | 'Laboratoire' | 'Commercial'> = {
        conseil: 'Consultation technique',
        etude: 'Réunion de projet',
        visite: 'Visite de chantier',
        demo: 'Laboratoire',
        partenariat: 'Direction',
      };
      try {
        store.bookAppointment({
          type: typeMapping[formData.meetingType] || 'Consultation technique',
          entityId: (formData.entity as any) || 'direction',
          fullName: formData.name,
          email: formData.email || '',
          phone: formData.phone,
          company: formData.company || undefined,
          date: formData.date,
          timeSlot: formData.time,
          subject: formData.message || formData.meetingType || 'Rendez-vous',
        });
      } catch (err) {
        console.error('Erreur réservation rendez-vous:', err);
      }
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Message envoyé !</h1>
          <p className="text-slate-300 mb-2">
            {activeTab === 'rdv'
              ? `Votre rendez-vous du ${formData.date} à ${formData.time} est bien enregistré.`
              : 'Votre message a bien été reçu.'}
          </p>
          <p className="text-slate-400 text-sm mb-8">Nous vous répondons sous 24h ouvrées (WhatsApp disponible immédiatement).</p>
          <div className="flex gap-4 justify-center">
            <a href="https://wa.me/221772671617" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors">
              💬 WhatsApp direct
            </a>
            <button onClick={() => { setSubmitted(false); setFormData({ name:'', email:'', phone:'', company:'', subject:'', message:'', meetingType:'', date:'', time:'', entity:'direction' }); }}
              className="px-6 py-3 bg-brand-800 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors">
              Nouvelle demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-950">
      <Breadcrumb items={[{ label: 'Contactez-nous', href: '/contact' }]} />

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 bg-gradient-to-br from-brand-900 to-brand-950 border-b border-brand-800 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_IMAGES.magatteNiangEquipe}
          alt="L'équipe d'ingénieurs de Magatte Niang"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 to-brand-950/90" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-accent-400 font-semibold text-sm  tracking-widest mb-3">Prise de contact</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Parlons de <span className="text-gold-400">votre projet</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Obtenez un conseil expert gratuit ou réservez un rendez-vous avec Magatte Niang et ses équipes.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left: Infos de contact */}
        <div className="space-y-6">
          {OFFICES.map((office) => (
            <div key={office.entity} className="bg-brand-900 rounded-2xl p-5 border border-brand-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: office.color }} />
                <h3 className="font-bold text-white text-sm">{office.entity}</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-400" />{office.address}, {office.city}</p>
                <a href={`tel:${office.phone.replace(/\s/g,'')}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-accent-400" />{office.phone}
                </a>
                <a href={`mailto:${office.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-accent-400" />{office.email}
                </a>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent-400" />{office.hours}</p>
              </div>
            </div>
          ))}

          {/* WhatsApp CTA */}
          <a href="https://wa.me/221772671617?text=Bonjour%20M.%20Niang%2C%20je%20souhaite%20un%20conseil%20pour%20mon%20projet."
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp immédiat
          </a>

          {/* Réseaux sociaux officiels */}
          <div className="bg-brand-900 rounded-2xl p-5 border border-brand-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-400" />
              <span>Réseaux sociaux officiels</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Suivez nos actualités chantiers, arrivages matériaux showroom et publications techniques.
            </p>
            <div className="space-y-2 pt-1">
              {SOCIAL_LINKS.map(s => {
                const Icon = s.icon === 'Linkedin' ? Linkedin : s.icon === 'Facebook' ? Facebook : s.icon === 'Youtube' ? Youtube : s.icon === 'Instagram' ? Instagram : s.icon === 'Tiktok' ? TikTokIcon : MessageCircle;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-brand-800/80 hover:bg-brand-700/80 border border-brand-700 text-xs text-slate-300 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-accent-500 group-hover:text-accent-400" />
                      <span className="font-semibold text-white">{s.name}</span>
                    </div>
                    {s.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-900 text-slate-400 border border-brand-700">
                        {s.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Formulaire */}
        <div className="lg:col-span-2 bg-brand-900 rounded-2xl border border-brand-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-brand-800">
            {(['message', 'rdv'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-accent-600 text-white' : 'text-slate-400 hover:text-white hover:bg-brand-800'}`}>
                {tab === 'message' ? '✉️ Message libre' : '📅 Prendre rendez-vous'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Champs communs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nom complet *</label>
                <input required name="name" value={formData.name} onChange={handleChange}
                  className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500"
                  placeholder="Prénom Nom" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Téléphone *</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel"
                  className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500"
                  placeholder="+221 77 XXX XX XX" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email"
                  className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500"
                  placeholder="vous@entreprise.sn" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Société / organisation</label>
                <input name="company" value={formData.company} onChange={handleChange}
                  className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500"
                  placeholder="Nom de votre entreprise" />
              </div>
            </div>

            {/* Entité concernée */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Entité concernée</label>
              <select name="entity" value={formData.entity} onChange={handleChange}
                className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500">
                <option value="direction">Direction générale / Magatte Niang</option>
                <option value="serma-btp">SERMA BTP – charpente & génie civil</option>
                <option value="sbs-group">SB-S Group – infrastructures & TP</option>
                <option value="sbs-labo">SB-S Labo – géotechnique & contrôle</option>
                <option value="sbs-industries">SB-S Industries – matériaux & préfabrication</option>
                <option value="sbs-logistik">SB-S Logistik – engins & location</option>
                <option value="p2m">P2M – matériaux innovants</option>
                <option value="pgt">PGT – sourcing international</option>
              </select>
            </div>

            {/* Onglet RDV */}
            {activeTab === 'rdv' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Type de rendez-vous *</label>
                  <select required name="meetingType" value={formData.meetingType} onChange={handleChange}
                    className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500">
                    <option value="">Choisir un type…</option>
                    {MEETING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Date souhaitée *</label>
                    <input required name="date" value={formData.date} onChange={handleChange} type="date" min={today}
                      className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Créneau horaire *</label>
                    <select required name="time" value={formData.time} onChange={handleChange}
                      className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500">
                      <option value="">Choisir un créneau…</option>
                      {TIMESLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Sujet / message */}
            {activeTab === 'message' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Sujet *</label>
                <input required name="subject" value={formData.subject} onChange={handleChange}
                  className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500"
                  placeholder="Objet de votre demande" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Message / description du projet {activeTab === 'message' ? '*' : ''}</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
                required={activeTab === 'message'}
                className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-500 resize-none"
                placeholder="Décrivez votre projet, vos besoins, votre localisation…" />
            </div>

            <p className="text-xs text-slate-500">
              En soumettant ce formulaire, vous acceptez notre{' '}
              <a href="/legal/confidentialite" className="text-accent-400 underline">politique de confidentialité</a>{' '}
              (Loi n° 2008-12 CDP Sénégal).
            </p>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-accent-600 hover:bg-accent-500 disabled:opacity-60 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Envoi en cours…' : activeTab === 'rdv' ? 'Confirmer le rendez-vous' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>

      {/* Carte Interactive & Géolocalisation Certifiée */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <InteractiveLocationMap />
      </div>
    </div>
  );
}
