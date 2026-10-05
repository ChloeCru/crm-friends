export const colors = {
  background: '#FAF6EC',
  ink: '#17203A',
  muted: '#4A556F',
  accent: '#2F4BE0',
  card: '#FFFFFF',
  followUp: '#FFE1C7',
  followUpText: '#8A3F00',
  separator: '#DCD5C3',
  white: '#FFFFFF',
} as const;

/** Fonds de vignettes, en rotation. */
export const tileColors = ['#DDE4FF', '#FFF0B8', '#D5F0E0', '#FFD9E6'] as const;

export const tileColor = (index: number) => tileColors[index % tileColors.length];

export const fonts = {
  title: 'BricolageGrotesque_800ExtraBold',
  400: 'Figtree_400Regular',
  500: 'Figtree_500Medium',
  600: 'Figtree_600SemiBold',
  700: 'Figtree_700Bold',
} as const;

export const border = { borderWidth: 2, borderColor: colors.ink } as const;
