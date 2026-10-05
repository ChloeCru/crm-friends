export type Channel = 'appel' | 'message' | 'cafe' | 'autre';

export const CHANNELS: readonly Channel[] = ['appel', 'message', 'cafe', 'autre'];

/** Réglages DiceBear « Toon Head » d'un ami. On ne stocke jamais l'image. */
export type AvatarSettings = {
  hairVariant: 'bun' | 'sideComed' | 'spiky' | 'undercut';
  rearHairVariant: 'longStraight' | 'longWavy' | 'neckHigh' | 'shoulderHigh';
  rearHairProbability: 0 | 100;
  beardVariant: 'chin' | 'chinMoustache' | 'fullBeard' | 'longBeard' | 'moustacheTwirl';
  beardProbability: 0 | 100;
  eyesVariant: 'bow' | 'happy' | 'humble' | 'wide' | 'wink';
  eyebrowsVariant: 'angry' | 'happy' | 'neutral' | 'raised' | 'sad';
  mouthVariant: 'agape' | 'angry' | 'laugh' | 'sad' | 'smile';
  clothesVariant: 'dress' | 'openJacket' | 'shirt' | 'tShirt' | 'turtleNeck';
  hairColor: '2c1b18' | 'd6b370' | '724133' | 'a55728' | 'b58143';
  skinColor: 'f1c3a5' | 'c68e7a' | 'b98e6a' | 'a36b4f' | '5c3829';
  clothesColor:
    | '151613'
    | '0b3286'
    | '545454'
    | '147f3c'
    | 'f97316'
    | 'ec4899'
    | '731ac3'
    | 'b11f1f'
    | 'e8e9e6'
    | 'eab308';
};

export type Friend = {
  id: string;
  name: string;
  label: string;
  rhythmDays: number;
  avatar: AvatarSettings;
  notes: string;
  /** Canaux habituels avec cet ami ; vide = les quatre sont proposés. */
  channels: Channel[];
  createdAt: string;
};

export type Contact = {
  id: string;
  friendId: string;
  /** Date locale au format AAAA-MM-JJ. */
  date: string;
  channel: Channel;
  createdAt: string;
};

export type FriendWithLastContact = Friend & { lastContact: string | null };
