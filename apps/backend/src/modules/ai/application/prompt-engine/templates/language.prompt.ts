export const LANGUAGE_SPECIFIC_GUIDELINES: Record<string, string> = {
  TYPESCRIPT:
    'Focus on strict typing, no implicit any, proper async/await handling, memory leakage in RxJS subscriptions, and immutability.',
  JAVASCRIPT:
    'Focus on ES6+ best practices, strict equality, variable scope (let/const over var), prototype pollution prevention, and unhandled promises.',
  PYTHON:
    'Focus on PEP8 styling, type hints, GIL constraints, list comprehension readability, context managers (with statement), and exception specificity.',
  JAVA: 'Focus on NullPointerException avoidance (Optional), thread safety, memory leak prevention in static references, stream API optimization, and effective resource management.',
  GO: 'Focus on idiomatic Go concurrency (goroutine leaks, mutex locks), explicit error checking, slice allocations, and pointer safety.',
  CPP: 'Focus on RAII, smart pointer management (std::unique_ptr, std::shared_ptr), buffer overflow prevention, move semantics, and memory alignment.',
};

export function getLanguageGuideline(language?: string): string {
  if (!language) return '';
  const normalized = language.toUpperCase();
  return LANGUAGE_SPECIFIC_GUIDELINES[normalized]
    ? `Language-Specific Rule Set (${normalized}): ${LANGUAGE_SPECIFIC_GUIDELINES[normalized]}`
    : '';
}
