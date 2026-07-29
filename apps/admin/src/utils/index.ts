/**
 * Utils Layer Barrel Export
 * Responsibilities: Pure helper functions (formatting, date parsing, string manipulation, token parsing).
 * Dependencies: Independent utilities usable by services, composables, and components.
 */

export function formatDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
