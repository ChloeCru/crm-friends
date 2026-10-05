import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFriends } from '@/db/hooks';
import { splitByStatus, todayISO } from '@/domain/friendship';
import { FollowUpPanel } from '@/ui/FriendCards';
import { SCREEN_PADDING, useContentWidth } from '@/ui/layout';
import { Sticker } from '@/ui/Sticker';
import { colors } from '@/ui/theme';
import { Txt } from '@/ui/Txt';

/** Pour cette version, Rappels affiche la même liste « à relancer » que la galerie. */
export default function Reminders() {
  const { friends } = useFriends();
  const width = useContentWidth();
  if (!friends) return null;

  const today = todayISO();
  const { toFollowUp } = splitByStatus(friends, today);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 24, paddingBottom: 40, gap: 16 }}>
        <View style={{ gap: 2 }}>
          <Txt weight="title" size={36} accessibilityRole="header" style={{ lineHeight: 44, letterSpacing: -0.5 }}>
            Rappels
          </Txt>
          <Txt weight={500} size={14} color={colors.muted}>
            {toFollowUp.length} à relancer
          </Txt>
        </View>
        {toFollowUp.length > 0 ? (
          <FollowUpPanel friends={toFollowUp} today={today} width={width} />
        ) : (
          <Sticker radius={20} contentStyle={{ padding: 16 }}>
            <Txt weight={600}>Personne à relancer. Tout va bien !</Txt>
          </Sticker>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
