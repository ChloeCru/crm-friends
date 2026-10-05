import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { BackIcon } from './icons';
import { Txt } from './Txt';

/** Lien de retour des maquettes (« ‹ Amis », « ‹ Inès »). */
export function BackLink({ label }: { label: string }) {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Retour : ${label}`}
      onPress={goBack}
      hitSlop={8}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 44, paddingRight: 12, flexShrink: 1 }}>
      <BackIcon />
      <Txt weight={700} size={16} numberOfLines={1} style={{ flexShrink: 1 }}>
        {label}
      </Txt>
    </Pressable>
  );
}
