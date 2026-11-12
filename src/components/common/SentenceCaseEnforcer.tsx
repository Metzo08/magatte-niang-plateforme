'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toFirstUpperRestLower } from '@/lib/textCase';

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'SVG',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
]);

const UNIT_CONTAINERS = new Set([
  'A',
  'BUTTON',
  'LABEL',
  'LI',
  'TD',
  'TH',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
  'DT',
  'DD',
  'FIGCAPTION',
  'BLOCKQUOTE',
  'SUMMARY',
  'DIV',
  'SECTION',
  'HEADER',
  'FOOTER',
  'NAV',
  'MAIN',
  'ASIDE',
  'ARTICLE',
]);

function shouldSkipElement(el: Element | null): boolean {
  let cur: Element | null = el;
  while (cur) {
    if (SKIP_TAGS.has(cur.tagName)) return true;
    if (cur.getAttribute('data-preserve-case') === 'true') return true;
    if ((cur as HTMLElement).isContentEditable) return true;
    cur = cur.parentElement;
  }
  return false;
}

function getNearestContainer(node: Text): Element | null {
  let cur: Element | null = node.parentElement;
  while (cur && cur !== document.body) {
    if (UNIT_CONTAINERS.has(cur.tagName)) {
      return cur;
    }
    cur = cur.parentElement;
  }
  return document.body;
}

function getPrecedingTextInContainer(node: Text, container: Element): string {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let acc = '';
  let current = walker.nextNode();
  while (current && current !== node) {
    if (!shouldSkipElement(current.parentElement)) {
      acc += current.nodeValue || '';
    }
    current = walker.nextNode();
  }
  return acc;
}

function shouldCapitalizeTextNode(node: Text): boolean {
  const container = getNearestContainer(node);
  if (!container) return true;

  const preceding = getPrecedingTextInContainer(node, container).trimEnd();
  if (!preceding) return true;

  // Si le texte précédent dans le même conteneur se termine par une ponctuation de fin de phrase
  if (/[.!?]$/.test(preceding)) return true;

  // Si le texte précédent ne contenait aucune lettre (ex. puce, numéro, symbole)
  if (!/\p{L}/u.test(preceding)) return true;

  return false;
}

function normalizeRoot(root: Node): void {
  if (!root || (root instanceof Element && shouldSkipElement(root))) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    if (
      current.nodeType === Node.TEXT_NODE &&
      current.nodeValue &&
      /\p{L}/u.test(current.nodeValue) &&
      !shouldSkipElement(current.parentElement)
    ) {
      nodes.push(current as Text);
    }
    current = walker.nextNode();
  }

  for (const textNode of nodes) {
    const raw = textNode.nodeValue;
    if (!raw) continue;
    const capFirst = shouldCapitalizeTextNode(textNode);
    const normalized = toFirstUpperRestLower(raw, capFirst);
    if (normalized !== raw) {
      textNode.nodeValue = normalized;
    }
  }
}

export function SentenceCaseEnforcer() {
  const pathname = usePathname();

  useEffect(() => {
    let isApplying = false;
    let rafId: number | null = null;

    const run = () => {
      if (isApplying) return;
      isApplying = true;
      try {
        if (document.title) {
          const nextTitle = toFirstUpperRestLower(document.title, true);
          if (nextTitle !== document.title) {
            document.title = nextTitle;
          }
        }
        if (document.body) {
          normalizeRoot(document.body);
        }
      } finally {
        isApplying = false;
      }
    };

    run();

    const observer = new MutationObserver(() => {
      if (isApplying) return;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        run();
      });
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
