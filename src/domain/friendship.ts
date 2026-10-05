// Valeurs calculées à partir des contacts : jamais stockées en base.
// Fichier sans dépendance pour être testé avec `node --test`.
import type { FriendWithLastContact } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Date locale du jour au format AAAA-MM-JJ. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const t = Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS;
  return new Date(t).toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((Date.parse(`${toISO}T00:00:00Z`) - Date.parse(`${fromISO}T00:00:00Z`)) / DAY_MS);
}

/** Jours écoulés depuis le dernier contact, ou null si aucun contact. */
export function daysSince(lastContact: string | null, today: string): number | null {
  return lastContact === null ? null : daysBetween(lastContact, today);
}

/** « À relancer » : aucun contact, ou plus de jours écoulés que le rythme voulu. */
export function needsFollowUp(lastContact: string | null, rhythmDays: number, today: string): boolean {
  const days = daysSince(lastContact, today);
  return days === null || days > rhythmDays;
}

export function relativeDay(days: number | null): string {
  if (days === null) return 'jamais';
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return 'hier';
  return `il y a ${days} jours`;
}

/** Sépare les amis en « à relancer » (plus ancien d'abord) et « tout va bien » (plus récent d'abord). */
export function splitByStatus<T extends FriendWithLastContact>(friends: T[], today: string) {
  const toFollowUp: T[] = [];
  const fine: T[] = [];
  for (const f of friends) {
    (needsFollowUp(f.lastContact, f.rhythmDays, today) ? toFollowUp : fine).push(f);
  }
  // Une date AAAA-MM-JJ se trie comme une chaîne ; sans contact = le plus ancien.
  const key = (f: T) => f.lastContact ?? '';
  toFollowUp.sort((a, b) => key(a).localeCompare(key(b)));
  fine.sort((a, b) => key(b).localeCompare(key(a)));
  return { toFollowUp, fine };
}
