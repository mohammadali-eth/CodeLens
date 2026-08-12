/**
 * Centralized Language Detection & Display Metadata Utility for CodeLens IDE.
 * Extension-first language resolution with content fallback.
 */

export interface LanguageInfo {
  id: string;
  displayName: string;
  symbol: string;
  extension: string;
}

const LANGUAGE_MAP: Record<string, { id: string; displayName: string; symbol: string }> = {
  // Web Technologies
  html: { id: 'html', displayName: 'HTML', symbol: '🌐' },
  htm: { id: 'html', displayName: 'HTML', symbol: '🌐' },
  css: { id: 'css', displayName: 'CSS', symbol: '🎨' },
  scss: { id: 'scss', displayName: 'SCSS', symbol: '🎨' },
  less: { id: 'less', displayName: 'LESS', symbol: '🎨' },
  js: { id: 'javascript', displayName: 'JAVASCRIPT', symbol: '⚡' },
  jsx: { id: 'javascript', displayName: 'JSX', symbol: '⚛️' },
  mjs: { id: 'javascript', displayName: 'JAVASCRIPT', symbol: '⚡' },
  ts: { id: 'typescript', displayName: 'TYPESCRIPT', symbol: '📘' },
  tsx: { id: 'typescript', displayName: 'TSX', symbol: '⚛️' },
  json: { id: 'json', displayName: 'JSON', symbol: '⚙️' },
  xml: { id: 'xml', displayName: 'XML', symbol: '📜' },
  svg: { id: 'xml', displayName: 'SVG', symbol: '🖼️' },

  // Programming Languages
  py: { id: 'python', displayName: 'PYTHON', symbol: '🐍' },
  java: { id: 'java', displayName: 'JAVA', symbol: '☕' },
  go: { id: 'go', displayName: 'GO', symbol: '🐹' },
  rs: { id: 'rust', displayName: 'RUST', symbol: '🦀' },
  cpp: { id: 'cpp', displayName: 'CPP', symbol: '⚡' },
  cc: { id: 'cpp', displayName: 'CPP', symbol: '⚡' },
  cxx: { id: 'cpp', displayName: 'CPP', symbol: '⚡' },
  h: { id: 'cpp', displayName: 'CPP', symbol: '⚡' },
  hpp: { id: 'cpp', displayName: 'CPP', symbol: '⚡' },
  c: { id: 'c', displayName: 'C', symbol: '⚙️' },
  cs: { id: 'csharp', displayName: 'CSHARP', symbol: '🎯' },
  php: { id: 'php', displayName: 'PHP', symbol: '🐘' },
  rb: { id: 'ruby', displayName: 'RUBY', symbol: '💎' },
  kt: { id: 'kotlin', displayName: 'KOTLIN', symbol: '🅺' },
  kts: { id: 'kotlin', displayName: 'KOTLIN', symbol: '🅺' },
  swift: { id: 'swift', displayName: 'SWIFT', symbol: '🐦' },
  sql: { id: 'sql', displayName: 'SQL', symbol: '🗄️' },
  sh: { id: 'shell', displayName: 'SHELL', symbol: '🐚' },
  bash: { id: 'shell', displayName: 'SHELL', symbol: '🐚' },
  zsh: { id: 'shell', displayName: 'SHELL', symbol: '🐚' },
  yaml: { id: 'yaml', displayName: 'YAML', symbol: '📄' },
  yml: { id: 'yaml', displayName: 'YAML', symbol: '📄' },
  md: { id: 'markdown', displayName: 'MARKDOWN', symbol: '📝' },
  markdown: { id: 'markdown', displayName: 'MARKDOWN', symbol: '📝' },
  dockerfile: { id: 'dockerfile', displayName: 'DOCKERFILE', symbol: '🐳' },
};

/**
 * Detect Monaco language identifier from filename (extension priority).
 */
export function detectLanguage(filename: string, content?: string): string {
  if (!filename) return 'plaintext';

  const normalized = filename.trim().toLowerCase();
  const basename = normalized.split('/').pop() || normalized;

  // Exact filename matches
  if (basename === 'dockerfile') return 'dockerfile';
  if (basename === 'package.json' || basename === 'tsconfig.json') return 'json';

  // Extension match
  const parts = basename.split('.');
  if (parts.length > 1) {
    const ext = parts.pop() || '';
    if (LANGUAGE_MAP[ext]) {
      return LANGUAGE_MAP[ext].id;
    }
  }

  // Content-based fallback detection if extension is missing/unknown
  if (content && content.trim().length > 0) {
    const trimmed = content.trim();
    if (trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html')) {
      return 'html';
    }
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {
        // Not valid JSON
      }
    }
    if (trimmed.startsWith('<?php')) {
      return 'php';
    }
  }

  return 'plaintext';
}

/**
 * Get human-readable display name for language badge (e.g. "HTML", "TYPESCRIPT", "TSX", "CSS").
 */
export function getLanguageDisplayName(filenameOrLang: string): string {
  if (!filenameOrLang) return 'PLAINTEXT';

  const normalized = filenameOrLang.trim().toLowerCase();
  const basename = normalized.split('/').pop() || normalized;
  const ext = basename.includes('.') ? basename.split('.').pop() || '' : basename;

  if (LANGUAGE_MAP[ext]) {
    return LANGUAGE_MAP[ext].displayName;
  }

  // Check by language id match
  for (const key of Object.keys(LANGUAGE_MAP)) {
    if (LANGUAGE_MAP[key].id === normalized) {
      return LANGUAGE_MAP[key].displayName;
    }
  }

  return ext.toUpperCase();
}

/**
 * Get icon/emoji symbol for language/file extension.
 */
export function getLanguageSymbol(filenameOrLang: string): string {
  if (!filenameOrLang) return '📄';

  const normalized = filenameOrLang.trim().toLowerCase();
  const basename = normalized.split('/').pop() || normalized;
  const ext = basename.includes('.') ? basename.split('.').pop() || '' : basename;

  if (LANGUAGE_MAP[ext]) {
    return LANGUAGE_MAP[ext].symbol;
  }

  for (const key of Object.keys(LANGUAGE_MAP)) {
    if (LANGUAGE_MAP[key].id === normalized) {
      return LANGUAGE_MAP[key].symbol;
    }
  }

  return '📄';
}
