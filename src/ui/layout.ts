import { useWindowDimensions } from 'react-native';

export const SCREEN_PADDING = 20;
const MAX_WIDTH = 560;

/** Largeur utile d'un écran (marges de 20 px), plafonnée pour rester lisible sur grand écran. */
export function useContentWidth() {
  const { width } = useWindowDimensions();
  return Math.min(width, MAX_WIDTH) - SCREEN_PADDING * 2;
}
