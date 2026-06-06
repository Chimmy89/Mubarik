import { Category, CategoryId } from '@/types';
import { colors } from '@/theme';

export const categories: Category[] = [
  {
    id: 'sports',
    label: 'Sports & Cups',
    icon: 'football',
    color: colors.sports,
    description: 'Football cups, runs, tournaments and pickup games',
  },
  {
    id: 'family',
    label: 'Family & Kids',
    icon: 'happy',
    color: colors.family,
    description: 'Activities, workshops and meetups for all ages',
  },
  {
    id: 'community',
    label: 'Community & Social',
    icon: 'people',
    color: colors.community,
    description: 'Markets, volunteering and neighbourhood gatherings',
  },
];

export const categoryById: Record<CategoryId, Category> = categories.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, Category>,
);
