// Options de l'éditeur d'avatar : valeurs DiceBear « Toon Head » et libellés affichés.
// Sans dépendance pour être testé avec `node --test`.
import type { AvatarSettings } from '../domain/types';

export type Choice<T extends string> = { value: T; label: string };

export const HAIR: Choice<AvatarSettings['hairVariant']>[] = [
  { value: 'bun', label: 'Chignon' },
  { value: 'sideComed', label: 'Sur le côté' },
  { value: 'spiky', label: 'En pics' },
  { value: 'undercut', label: 'Undercut' },
];

export const REAR_HAIR: Choice<AvatarSettings['rearHairVariant']>[] = [
  { value: 'neckHigh', label: 'Nuque' },
  { value: 'shoulderHigh', label: 'Épaules' },
  { value: 'longStraight', label: 'Longs raides' },
  { value: 'longWavy', label: 'Longs ondulés' },
];

export const BEARD: Choice<AvatarSettings['beardVariant']>[] = [
  { value: 'chin', label: 'Collier' },
  { value: 'chinMoustache', label: 'Bouc' },
  { value: 'fullBeard', label: 'Pleine' },
  { value: 'longBeard', label: 'Longue' },
  { value: 'moustacheTwirl', label: 'Moustache' },
];

export const EYES: Choice<AvatarSettings['eyesVariant']>[] = [
  { value: 'happy', label: 'Rieurs' },
  { value: 'wide', label: 'Grands' },
  { value: 'humble', label: 'Doux' },
  { value: 'bow', label: 'Fermés' },
  { value: 'wink', label: "Clin d'œil" },
];

export const EYEBROWS: Choice<AvatarSettings['eyebrowsVariant']>[] = [
  { value: 'neutral', label: 'Neutres' },
  { value: 'happy', label: 'Joyeux' },
  { value: 'raised', label: 'Levés' },
  { value: 'sad', label: 'Tristes' },
  { value: 'angry', label: 'Froncés' },
];

export const MOUTH: Choice<AvatarSettings['mouthVariant']>[] = [
  { value: 'smile', label: 'Sourire' },
  { value: 'laugh', label: 'Rire' },
  { value: 'agape', label: 'Bouche bée' },
  { value: 'sad', label: 'Triste' },
  { value: 'angry', label: 'Fâchée' },
];

export const CLOTHES: Choice<AvatarSettings['clothesVariant']>[] = [
  { value: 'tShirt', label: 'T-shirt' },
  { value: 'shirt', label: 'Chemise' },
  { value: 'turtleNeck', label: 'Col roulé' },
  { value: 'openJacket', label: 'Veste' },
  { value: 'dress', label: 'Robe' },
];

export const HAIR_COLORS: Choice<AvatarSettings['hairColor']>[] = [
  { value: '2c1b18', label: 'Brun foncé' },
  { value: 'd6b370', label: 'Blond' },
  { value: '724133', label: 'Châtain' },
  { value: 'a55728', label: 'Roux' },
  { value: 'b58143', label: 'Blond foncé' },
];

export const SKIN_COLORS: Choice<AvatarSettings['skinColor']>[] = [
  { value: 'f1c3a5', label: 'Teinte 1' },
  { value: 'c68e7a', label: 'Teinte 2' },
  { value: 'b98e6a', label: 'Teinte 3' },
  { value: 'a36b4f', label: 'Teinte 4' },
  { value: '5c3829', label: 'Teinte 5' },
];

export const CLOTHES_COLORS: Choice<AvatarSettings['clothesColor']>[] = [
  { value: '151613', label: 'Noir' },
  { value: '0b3286', label: 'Bleu marine' },
  { value: '545454', label: 'Gris' },
  { value: '147f3c', label: 'Vert' },
  { value: 'f97316', label: 'Orange' },
  { value: 'ec4899', label: 'Rose' },
  { value: '731ac3', label: 'Violet' },
  { value: 'b11f1f', label: 'Rouge' },
  { value: 'e8e9e6', label: 'Blanc cassé' },
  { value: 'eab308', label: 'Jaune' },
];

/** Couleurs claires : la coche de la pastille choisie est alors dessinée à l'encre. */
export const LIGHT_SWATCHES = new Set(['d6b370', 'b58143', 'f1c3a5', 'c68e7a', 'b98e6a', 'e8e9e6', 'eab308', 'f97316']);

function pick<T extends string>(choices: Choice<T>[], rand: () => number): T {
  return choices[Math.floor(rand() * choices.length)].value;
}

/** Tire des réglages au hasard. Barbe une fois sur quatre, cheveux arrière une fois sur deux. */
export function randomAvatar(rand: () => number = Math.random): AvatarSettings {
  return {
    hairVariant: pick(HAIR, rand),
    rearHairVariant: pick(REAR_HAIR, rand),
    rearHairProbability: rand() < 0.5 ? 100 : 0,
    beardVariant: pick(BEARD, rand),
    beardProbability: rand() < 0.25 ? 100 : 0,
    eyesVariant: pick(EYES, rand),
    eyebrowsVariant: pick(EYEBROWS, rand),
    mouthVariant: pick(MOUTH, rand),
    clothesVariant: pick(CLOTHES, rand),
    hairColor: pick(HAIR_COLORS, rand),
    skinColor: pick(SKIN_COLORS, rand),
    clothesColor: pick(CLOTHES_COLORS, rand),
  };
}
