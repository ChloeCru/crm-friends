import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Sticker } from './Sticker';
import { colors } from './theme';
import { Txt } from './Txt';

type Props = {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

/** Bouton « sticker » de 52 px : accent (principal) ou blanc (secondaire). */
export function Button({ label, onPress, icon, variant = 'primary', disabled, style, accessibilityHint }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: disabled ? 0.5 : 1, transform: [{ translateY: pressed ? 2 : 0 }] }, style]}>
      <Sticker
        radius={16}
        background={primary ? colors.accent : colors.card}
        contentStyle={{ height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {icon}
        <Txt weight={700} size={primary ? 16 : 15} color={primary ? colors.white : colors.ink}>
          {label}
        </Txt>
      </Sticker>
    </Pressable>
  );
}

/** Ligne d'action dans un panneau du bas (canal, rythme, menu ⋯). */
export function SheetOption({
  label,
  onPress,
  icon,
  selected,
  color = colors.ink,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  selected?: boolean;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({ transform: [{ translateY: pressed ? 2 : 0 }] })}>
      <Sticker
        radius={16}
        shadow={3}
        contentStyle={{
          minHeight: 52,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderColor: selected ? colors.accent : colors.ink,
          borderWidth: selected ? 3 : 2,
        }}>
        {icon}
        <Txt weight={selected ? 700 : 600} size={16} color={color} style={{ flex: 1 }}>
          {label}
        </Txt>
      </Sticker>
    </Pressable>
  );
}
