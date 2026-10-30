'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Send,
  User,
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  Info,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { store } from '@/lib/store';
import { queryKnowledgeBase } from '@/data/aiKnowledgeBase';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: { title: string; ref: string; link?: string }[];
  suggestedAction?: { label: string; href: string };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-init',
    sender: 'assistant',
    text: 'Bonjour, je suis l\'assistant technique de l\'écosystème Magatte Niang Expert. Je réponds à vos questions en m\'appuyant exclusivement sur notre base documentaire validée (charpentes SERMA BTP, essais SB-S Labo, finitions P2M, logistique). Que puis-je préciser pour votre projet ?',
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    sources: [
      { title: 'Plaquette institutionnelle écosystème 2026', ref: 'PLA-CORP-2026', link: '/docs/plaquette' }
    ]
  }
];

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n');

  const parseInlineBold = (line: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-neutral-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-0.5" />;
        }

        // Bullet point • or -
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const bulletContent = trimmed.replace(/^[•\-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0 mt-1.5" />
              <div className="flex-1 text-xs sm:text-sm">
                {parseInlineBold(bulletContent)}
              </div>
            </div>
          );
        }

        // Numbered list 1. 2.
        const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 my-1">
              <span className="font-mono text-[11px] font-bold text-accent-500 shrink-0 mt-0.5">
                {numMatch[1]}
              </span>
              <div className="flex-1 text-xs sm:text-sm">
                {parseInlineBold(numMatch[2])}
              </div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed">
            {parseInlineBold(line)}
          </p>
        );
      })}
    </div>
  );
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const AVATAR_URL = '/chatbot-macon.svg';
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Guardrail enriched query logic using the full platform knowledge base
    setTimeout(() => {
      const { text: responseText, sources, suggestedAction } = queryKnowledgeBase(userText);

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sources,
        suggestedAction
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // Log in store
      store.addAuditLog({
        user: 'Visiteur web',
        role: 'Public AI user',
        action: 'AI_QUERY',
        resourceType: 'AIAssistant',
        resourceId: `q-${Date.now()}`,
        newValue: userText.slice(0, 100)
      });
    }, 450);
  };

  const handleSuggestionClick = (query: string) => {
    setInput('');
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const { text: responseText, sources, suggestedAction } = queryKnowledgeBase(query);

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sources,
        suggestedAction
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 w-full max-w-2xl h-[min(620px,calc(100dvh-1.5rem))] max-h-[92dvh] rounded-xl shadow-elev-3 flex flex-col overflow-hidden">

        {/* HEADER (compact & shrink-0) */}
        <div className="shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-brand-900 text-white flex items-center justify-between border-b border-brand-800">
          <div className="flex items-center gap-2.5">
            <img src={AVATAR_URL} alt="Maçon assistant" className="w-8 h-8 rounded-m border border-brand-700 shrink-0" />
            <div>
              <h3 className="font-title font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 flex-wrap">
                Assistant IA technique BTP
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 border border-emerald-700 rounded">
                  Sourcé & encadré
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-400">
                Alimenté exclusivement par la base documentaire validée (§ 24)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-brand-800 transition-colors"
            aria-label="Fermer l'assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTICE BAR (shrink-0) */}
        <div className="shrink-0 bg-brand-50 dark:bg-brand-800/40 px-3 py-1.5 border-b border-brand-200 dark:border-brand-800 flex items-center justify-between text-[11px] text-brand-800 dark:text-brand-300 flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">Garde-fou actif : aucune donnée contractuelle ou prix final n'est inventé.</span>
          </div>
          <Link href="/contact" onClick={onClose} className="font-semibold text-accent-500 hover:underline flex items-center gap-1 shrink-0">
            <PhoneCall className="w-3 h-3" /> Escalade humain
          </Link>
        </div>

        {/* QUICK SUGGESTIONS PILLS */}
        <div className="shrink-0 px-3 py-1.5 bg-neutral-100/80 dark:bg-brand-950/50 border-b border-neutral-200 dark:border-brand-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-neutral-500 dark:text-neutral-400 font-semibold shrink-0 text-[10px]">Suggestions :</span>
          {[
            'Carrelages P2M',
            'Essais sol CBR',
            'Charpentes SERMA',
            'Location grues',
            'Agglos 300F',
            'Projets Sénégal',
            'Magatte Niang',
            'Contacts & Devis'
          ].map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              className="px-2 py-0.5 rounded-full bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 hover:border-accent-500 text-neutral-700 dark:text-neutral-300 whitespace-nowrap hover:text-accent-500 transition-colors text-[10px]"
            >
              {s}
            </button>
          ))}
        </div>

        {/* CHAT MESSAGES CONTAINER (scrollable, min-h-0) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-neutral-50 dark:bg-brand-900/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[90%] sm:max-w-[85%]">
                {m.sender === 'assistant' && (
                  <img src={AVATAR_URL} alt="Maçon assistant" className="w-7 h-7 rounded border border-brand-700 shrink-0 mt-0.5" />
                )}

                <div
                  className={`p-3 sm:p-3.5 rounded-l text-xs sm:text-sm leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-brand-700 text-white rounded-tr-none'
                      : 'bg-white dark:bg-brand-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-brand-700 rounded-tl-none'
                  }`}
                >
                  <FormattedMessage text={m.text} />

                  {/* SOURCES CITATIONS */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-brand-700 text-xs">
                      <span className="font-bold text-[10px] sm:text-[11px] tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1">
                        Sources internes citées :
                      </span>
                      <ul className="space-y-1">
                        {m.sources.map((src, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-brand-600 dark:text-brand-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                            <span className="font-medium">{src.title}</span>
                            <span className="font-mono text-[10px] text-neutral-500">({src.ref})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* SUGGESTED ACTION */}
                  {m.suggestedAction && (
                    <div className="mt-2.5 pt-2">
                      <Link
                        href={m.suggestedAction.href}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-xs font-semibold transition-colors shadow-sm"
                      >
                        <span>{m.suggestedAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 italic">
              <img src={AVATAR_URL} alt="Maçon assistant" className="w-6 h-6 rounded shrink-0" />
              <span>Consultation de la base documentaire technique...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM (shrink-0, pinned at bottom) */}
        <form onSubmit={handleSend} className="shrink-0 p-2.5 sm:p-3 bg-white dark:bg-brand-900 border-t border-neutral-200 dark:border-brand-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question (ex: carrelage 60×60, essais CBR, charpente, grues, agglos)..."
            className="flex-1 min-w-0 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-neutral-100 dark:bg-brand-800/80 border border-neutral-300 dark:border-brand-700 rounded-m text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold rounded-m text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
