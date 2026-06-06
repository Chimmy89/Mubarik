export type CategoryId = 'sports' | 'family' | 'community';

export interface Category {
  id: CategoryId;
  label: string;
  /** Ionicons name */
  icon: string;
  color: string;
  description: string;
}

export interface Happening {
  id: string;
  title: string;
  category: CategoryId;
  subcategory: string;
  description: string;

  /** ISO 8601 start datetime */
  start: string;
  /** ISO 8601 end datetime (optional) */
  end?: string;
  /** Human label for recurring events, e.g. "Every Saturday" */
  recurring?: string;

  venueName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;

  /** 0 means free */
  price: number;
  currency: string;

  organizer: string;
  imageUrl: string;
  tags: string[];

  attendees: number;
  capacity?: number;
  ageRange?: string;
  contact?: string;
}
