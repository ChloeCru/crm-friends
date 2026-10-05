import { Text, type TextProps } from 'react-native';

import { colors, fonts } from './theme';

type Props = TextProps & {
  weight?: 400 | 500 | 600 | 700 | 'title';
  size?: number;
  color?: string;
};

/** Texte de l'app : Figtree par défaut, Bricolage Grotesque 800 pour les titres. */
export function Txt({ weight = 400, size = 15, color = colors.ink, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: fonts[weight], fontSize: size, color, lineHeight: Math.round(size * 1.3) }, style]}
    />
  );
}

/** Intertitre en capitales (« À RELANCER », « NOTES »…). */
export function SectionTitle({ children, color = colors.muted }: { children: string; color?: string }) {
  return (
    <Txt weight={700} size={13} color={color} style={{ letterSpacing: 0.6, textTransform: 'uppercase', lineHeight: 18 }}>
      {children}
    </Txt>
  );
}
