// Vignettes de forme et pastilles de couleur de l'éditeur d'avatar.
import { Pressable, View } from 'react-native';

import { LIGHT_SWATCHES } from '@/avatar/options';
import type { AvatarSettings } from '@/domain/types';
import { CheckIcon } from '@/ui/icons';
import { colors } from '@/ui/theme';
import { SectionTitle, Txt } from '@/ui/Txt';

import { Avatar } from './Avatar';

export type ShapeOption = { key: string; label: string; preview: AvatarSettings; selected: boolean; onPick: () => void };

/**
 * Grille de vignettes : chacune montre l'avatar actuel avec l'option appliquée.
 * `zoom` = « face » pour les détails du visage (yeux, sourcils, bouche), cadrés de plus près.
 */
export function ShapeSection({
  title,
  seed,
  options,
  width,
  zoom = 'bust',
}: {
  title: string;
  seed: string;
  options: ShapeOption[];
  width: number;
  zoom?: 'bust' | 'face';
}) {
  const gap = 8;
  const tile = Math.floor((width - gap * 3) / 4);
  const size = zoom === 'face' ? 170 : 82;
  const offset = zoom === 'face' ? -58 : -6;
  return (
    <View style={{ gap: 8 }}>
      <SectionTitle>{title}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {options.map((o) => (
          <Pressable
            key={o.key}
            accessibilityRole="radio"
            accessibilityState={{ selected: o.selected }}
            accessibilityLabel={`${title} : ${o.label}`}
            onPress={o.onPick}
            style={{ width: tile, alignItems: 'center', gap: 4 }}>
            <View
              style={{
                width: '100%',
                height: 78,
                borderRadius: 16,
                borderWidth: o.selected ? 3 : 2,
                borderColor: o.selected ? colors.accent : colors.ink,
                backgroundColor: colors.card,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <View style={{ marginBottom: offset }}>
                <Avatar seed={seed} settings={o.preview} size={size} />
              </View>
            </View>
            <Txt weight={o.selected ? 700 : 500} size={12} numberOfLines={1} style={{ lineHeight: 16 }}>
              {o.label}
            </Txt>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** Pastilles rondes ; la choisie a un anneau d'accent et une coche. */
export function ColorSection<T extends string>({
  title,
  choices,
  value,
  onPick,
}: {
  title: string;
  choices: { value: T; label: string }[];
  value: T;
  onPick: (v: T) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <SectionTitle>{title}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginLeft: -5 }}>
        {choices.map((c) => {
          const selected = c.value === value;
          return (
            <Pressable
              key={c.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={c.label}
              onPress={() => onPick(c.value)}
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                borderWidth: 3,
                borderColor: selected ? colors.accent : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: colors.ink,
                  backgroundColor: `#${c.value}`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {selected && <CheckIcon size={18} strokeWidth={3} color={LIGHT_SWATCHES.has(c.value) ? colors.ink : colors.white} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
