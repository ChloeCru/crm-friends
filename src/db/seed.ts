// Amis d'exemple, chargés uniquement en développement (voir migrations.ts),
// et seulement si la base est vide. Les dates sont relatives au jour du chargement.
import type { SQLiteDatabase } from 'expo-sqlite';

import { addDays, todayISO } from '@/domain/friendship';
import type { AvatarSettings, Channel } from '@/domain/types';

import { insertContact, insertFriend } from './queries';

const base: AvatarSettings = {
  hairVariant: 'sideComed',
  rearHairVariant: 'shoulderHigh',
  rearHairProbability: 0,
  beardVariant: 'chin',
  beardProbability: 0,
  eyesVariant: 'happy',
  eyebrowsVariant: 'neutral',
  mouthVariant: 'smile',
  clothesVariant: 'tShirt',
  hairColor: '2c1b18',
  skinColor: 'f1c3a5',
  clothesColor: '0b3286',
};

type SeedFriend = {
  name: string;
  label: string;
  rhythmDays?: number;
  notes?: string;
  channels?: Channel[];
  avatar: Partial<AvatarSettings>;
  /** [jours avant aujourd'hui, canal], du plus récent au plus ancien. */
  contacts: [number, Channel][];
};

const FRIENDS: SeedFriend[] = [
  {
    name: 'Inès',
    label: 'Amie de fac · Lyon',
    notes: 'A commencé un nouveau poste en septembre. Lui demander comment ça se passe.',
    channels: ['appel', 'message', 'cafe'],
    avatar: { hairVariant: 'bun', rearHairProbability: 0, skinColor: 'c68e7a', clothesVariant: 'turtleNeck', clothesColor: 'b11f1f' },
    contacts: [[23, 'appel'], [46, 'message'], [95, 'cafe']],
  },
  {
    name: 'Hugo',
    label: 'Ancien collègue',
    channels: ['message'],
    avatar: { hairVariant: 'spiky', hairColor: 'a55728', beardVariant: 'fullBeard', beardProbability: 100, clothesVariant: 'openJacket', clothesColor: '545454' },
    contacts: [[31, 'message'], [70, 'cafe']],
  },
  {
    name: 'Zoé',
    label: 'Voisine · Nantes',
    avatar: { hairVariant: 'sideComed', rearHairVariant: 'longWavy', rearHairProbability: 100, hairColor: 'd6b370', eyesVariant: 'wink', clothesVariant: 'dress', clothesColor: 'ec4899' },
    contacts: [[40, 'cafe']],
  },
  {
    name: 'Malo',
    label: 'Club de foot',
    rhythmDays: 14,
    avatar: { hairVariant: 'undercut', skinColor: 'a36b4f', mouthVariant: 'laugh', clothesColor: '147f3c' },
    contacts: [[3, 'appel'], [18, 'message']],
  },
  {
    name: 'Jade',
    label: 'Cousine',
    avatar: { hairVariant: 'bun', rearHairVariant: 'longStraight', rearHairProbability: 100, hairColor: '724133', eyebrowsVariant: 'raised', clothesVariant: 'shirt', clothesColor: 'eab308' },
    contacts: [[5, 'message']],
  },
  {
    name: 'Tom',
    label: 'Ami du lycée',
    rhythmDays: 28,
    avatar: { hairVariant: 'sideComed', hairColor: 'b58143', beardVariant: 'moustacheTwirl', beardProbability: 100, eyesVariant: 'wide', clothesColor: 'f97316' },
    contacts: [[1, 'cafe'], [30, 'appel']],
  },
  {
    name: 'Noor',
    label: 'Yoga du jeudi',
    avatar: { hairVariant: 'spiky', rearHairVariant: 'neckHigh', rearHairProbability: 100, skinColor: '5c3829', eyesVariant: 'bow', clothesVariant: 'turtleNeck', clothesColor: '731ac3' },
    contacts: [[8, 'autre']],
  },
  {
    name: 'Sacha',
    label: 'Coloc · Paris',
    avatar: { hairVariant: 'undercut', hairColor: '724133', skinColor: 'b98e6a', eyesVariant: 'humble', clothesVariant: 'openJacket', clothesColor: '151613' },
    contacts: [[12, 'appel']],
  },
  {
    name: 'Élise',
    label: 'Marraine',
    rhythmDays: 30,
    avatar: { hairVariant: 'bun', rearHairVariant: 'shoulderHigh', rearHairProbability: 100, hairColor: 'd6b370', mouthVariant: 'laugh', clothesVariant: 'shirt', clothesColor: 'e8e9e6' },
    contacts: [[2, 'appel'], [33, 'message']],
  },
];

export async function seedIfEmpty(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM friend');
  if ((row?.n ?? 0) > 0) return;

  const today = todayISO();
  await db.withTransactionAsync(async () => {
    for (const f of FRIENDS) {
      const friendId = await insertFriend(db, {
        name: f.name,
        label: f.label,
        rhythmDays: f.rhythmDays,
        notes: f.notes,
        channels: f.channels,
        avatar: { ...base, ...f.avatar },
      });
      for (const [daysAgo, channel] of f.contacts) {
        await insertContact(db, { friendId, date: addDays(today, -daysAgo), channel });
      }
    }
  });
}
