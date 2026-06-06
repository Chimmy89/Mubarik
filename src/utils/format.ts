import { Happening } from '@/types';
import { USER_LOCATION } from '@/data/happenings';

/** Haversine distance in km between two coordinates. */
export function distanceKm(
  lat: number,
  lon: number,
  fromLat = USER_LOCATION.latitude,
  fromLon = USER_LOCATION.longitude,
): number {
  const R = 6371;
  const dLat = toRad(lat - fromLat);
  const dLon = toRad(lon - fromLon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function distanceFor(h: Happening): number {
  return distanceKm(h.latitude, h.longitude);
}

export function formatPrice(h: Happening): string {
  if (h.price === 0) return 'Free';
  const symbol = h.currency === 'GBP' ? '£' : h.currency === 'USD' ? '$' : '';
  return `${symbol}${h.price}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** e.g. "Sat 7 Jun · 10:00" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${formatTime(d)}`;
}

/** e.g. "Sat 7 Jun" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** "10:00 – 15:00" or just "10:00" */
export function formatTimeRange(h: Happening): string {
  const start = formatTime(new Date(h.start));
  if (!h.end) return start;
  return `${start} – ${formatTime(new Date(h.end))}`;
}

/** Relative day label: Today / Tomorrow / Sat 7 Jun */
export function relativeDay(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round(
    (startOfDay(d) - startOfDay(now)) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return WEEKDAYS[d.getDay()];
  return formatDate(iso);
}
