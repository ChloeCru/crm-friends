import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/toon-head.json';

import type { AvatarSettings } from '@/domain/types';

const style = new Style(definition);

// L'éditeur redessine souvent les mêmes combinaisons : on garde les derniers SVG produits.
const cache = new Map<string, string>();
const CACHE_SIZE = 200;

/** SVG (texte) d'un avatar à partir de ses réglages. `seed` = id de l'ami. */
export function renderAvatarSvg(seed: string, settings: AvatarSettings): string {
  const key = seed + JSON.stringify(settings);
  const hit = cache.get(key);
  if (hit) return hit;

  const svg = new Avatar(style, { seed, ...settings })
    .toString()
    // Métadonnées de licence : inutiles à l'affichage et mal gérées par react-native-svg.
    .replace(/<metadata[\s\S]*?<\/metadata>/, '');

  if (cache.size >= CACHE_SIZE) cache.delete(cache.keys().next().value!);
  cache.set(key, svg);
  return svg;
}
