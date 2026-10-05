import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from './theme';

type Props = {
  children?: ReactNode;
  /** Décalage de l'ombre dure vers le bas : 4 (grandes cartes, boutons), 3 (vignettes), 0 (aucune). */
  shadow?: 0 | 3 | 4;
  radius: number;
  background?: string;
  borderStyle?: 'solid' | 'dashed';
  style?: StyleProp<ViewStyle>;
  /** Style du contenu (padding, alignement…), qui est découpé par l'arrondi. */
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Carte « sticker » : contour 2 px à l'encre et ombre dure sans flou.
 * L'ombre est une forme décalée derrière la carte, pour ne pas être coupée par `overflow: hidden`.
 */
export function Sticker({ children, shadow = 4, radius, background = colors.card, borderStyle = 'solid', style, contentStyle }: Props) {
  return (
    <View style={[{ marginBottom: shadow }, style]}>
      {shadow > 0 && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: shadow,
            bottom: -shadow,
            borderRadius: radius,
            backgroundColor: colors.ink,
          }}
        />
      )}
      <View
        style={[
          {
            flexGrow: 1,
            borderRadius: radius,
            borderWidth: 2,
            borderColor: colors.ink,
            borderStyle,
            backgroundColor: background,
            overflow: 'hidden',
          },
          contentStyle,
        ]}>
        {children}
      </View>
    </View>
  );
}
