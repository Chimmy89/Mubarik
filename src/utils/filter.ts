import { Happening, CategoryId } from '@/types';
import { distanceFor } from './format';

export type DateFilter = 'any' | 'today' | 'weekend' | 'week';
export type SortKey = 'soonest' | 'nearest';

export interface Filters {
  categories: Set<CategoryId>;
  date: DateFilter;
  freeOnly: boolean;
  query: string;
  sort: SortKey;
}

export const defaultFilters = (): Filters => ({
  categories: new Set<CategoryId>(),
  date: 'any',
  freeOnly: false,
  query: '',
  sort: 'soonest',
});

function matchesDate(h: Happening, filter: DateFilter, now: Date): boolean {
  if (filter === 'any') return true;
  const d = new Date(h.start);
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const today = startOfDay(now);
  const day = startOfDay(d);
  const diff = Math.round((day.getTime() - today.getTime()) / 86400000);

  if (filter === 'today') return diff === 0;
  if (filter === 'week') return diff >= 0 && diff < 7;
  if (filter === 'weekend') {
    // Upcoming Sat/Sun within the next 7 days
    const dow = d.getDay();
    return diff >= 0 && diff < 7 && (dow === 0 || dow === 6);
  }
  return true;
}

export function applyFilters(items: Happening[], f: Filters, now = new Date()): Happening[] {
  const q = f.query.trim().toLowerCase();

  const filtered = items.filter((h) => {
    if (f.categories.size > 0 && !f.categories.has(h.category)) return false;
    if (f.freeOnly && h.price !== 0) return false;
    if (!matchesDate(h, f.date, now)) return false;
    if (q) {
      const haystack = [
        h.title,
        h.subcategory,
        h.description,
        h.venueName,
        h.address,
        h.organizer,
        ...h.tags,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (f.sort === 'nearest') return distanceFor(a) - distanceFor(b);
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

  return filtered;
}
