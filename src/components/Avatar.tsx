import { memo, useMemo } from 'react';
import { SvgXml } from 'react-native-svg';

import { renderAvatarSvg } from '@/avatar/render';
import type { AvatarSettings } from '@/domain/types';

type Props = { seed: string; settings: AvatarSettings; size: number };

/** Avatar DiceBear : réglages en entrée, SVG en sortie. Carré de `size` points. */
export const Avatar = memo(function Avatar({ seed, settings, size }: Props) {
  const xml = useMemo(() => renderAvatarSvg(seed, settings), [seed, settings]);
  return <SvgXml xml={xml} width={size} height={size} />;
});
