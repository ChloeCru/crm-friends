import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SCREEN_PADDING } from '@/ui/layout';
import { Sticker } from '@/ui/Sticker';
import { colors } from '@/ui/theme';
import { SectionTitle, Txt } from '@/ui/Txt';

export default function Settings() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 24, paddingBottom: 40, gap: 16 }}>
        <Txt weight="title" size={36} accessibilityRole="header" style={{ lineHeight: 44, letterSpacing: -0.5 }}>
          Réglages
        </Txt>
        <SectionTitle>Crédits</SectionTitle>
        <Sticker radius={18} shadow={0} contentStyle={{ padding: 14 }}>
          <Txt>Avatars : Toon Head par Johan Melin, via DiceBear (CC BY 4.0)</Txt>
        </Sticker>
      </ScrollView>
    </SafeAreaView>
  );
}
