import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import type { AvatarSettings, Channel, Contact, Friend, FriendWithLastContact } from '@/domain/types';

type FriendRow = {
  id: string;
  name: string;
  label: string;
  rhythm_days: number;
  avatar: string;
  notes: string;
  channels: string;
  created_at: string;
};

type ContactRow = {
  id: string;
  friend_id: string;
  date: string;
  channel: Channel;
  created_at: string;
};

function toFriend(row: FriendRow): Friend {
  return {
    id: row.id,
    name: row.name,
    label: row.label,
    rhythmDays: row.rhythm_days,
    avatar: JSON.parse(row.avatar) as AvatarSettings,
    notes: row.notes,
    channels: JSON.parse(row.channels) as Channel[],
    createdAt: row.created_at,
  };
}

function toContact(row: ContactRow): Contact {
  return {
    id: row.id,
    friendId: row.friend_id,
    date: row.date,
    channel: row.channel,
    createdAt: row.created_at,
  };
}

export async function listFriends(db: SQLiteDatabase): Promise<FriendWithLastContact[]> {
  const rows = await db.getAllAsync<FriendRow & { last_contact: string | null }>(`
    SELECT f.*, (SELECT MAX(c.date) FROM contact c WHERE c.friend_id = f.id) AS last_contact
    FROM friend f
    ORDER BY f.name COLLATE NOCASE
  `);
  return rows.map((r) => ({ ...toFriend(r), lastContact: r.last_contact }));
}

export async function getFriend(db: SQLiteDatabase, id: string): Promise<FriendWithLastContact | null> {
  const row = await db.getFirstAsync<FriendRow & { last_contact: string | null }>(
    `SELECT f.*, (SELECT MAX(c.date) FROM contact c WHERE c.friend_id = f.id) AS last_contact
     FROM friend f WHERE f.id = ?`,
    id,
  );
  return row ? { ...toFriend(row), lastContact: row.last_contact } : null;
}

/** Contacts d'un ami, les plus récents en premier. */
export async function listContacts(db: SQLiteDatabase, friendId: string): Promise<Contact[]> {
  const rows = await db.getAllAsync<ContactRow>(
    'SELECT * FROM contact WHERE friend_id = ? ORDER BY date DESC, created_at DESC',
    friendId,
  );
  return rows.map(toContact);
}

export async function insertFriend(
  db: SQLiteDatabase,
  friend: Pick<Friend, 'name' | 'avatar'> & Partial<Pick<Friend, 'label' | 'rhythmDays' | 'notes' | 'channels'>>,
): Promise<string> {
  const id = randomUUID();
  await db.runAsync(
    `INSERT INTO friend (id, name, label, rhythm_days, avatar, notes, channels, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    friend.name.trim(),
    friend.label ?? '',
    friend.rhythmDays ?? 21,
    JSON.stringify(friend.avatar),
    friend.notes ?? '',
    JSON.stringify(friend.channels ?? []),
    new Date().toISOString(),
  );
  return id;
}

export async function insertContact(
  db: SQLiteDatabase,
  contact: Pick<Contact, 'friendId' | 'date' | 'channel'>,
): Promise<string> {
  const id = randomUUID();
  await db.runAsync(
    'INSERT INTO contact (id, friend_id, date, channel, created_at) VALUES (?, ?, ?, ?, ?)',
    id,
    contact.friendId,
    contact.date,
    contact.channel,
    new Date().toISOString(),
  );
  return id;
}
