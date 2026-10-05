import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddFriendSheet } from '@/components/AddFriendSheet';
import { SearchOverlay } from '@/components/SearchOverlay';
import { useFriends } from '@/db/hooks';
import { splitByStatus, todayISO } from '@/domain/friendship';
import { FollowUpPanel, FriendTile } from '@/ui/FriendCards';
import { PlusIcon, SearchIcon } from '@/ui/icons';
import { SCREEN_PADDING, useContentWidth } from '@/ui/layout';
import { Sticker } from '@/ui/Sticker';
import { colors } from '@/ui/theme';
import { SectionTitle, Txt } from '@/ui/Txt';

export default function Gallery() {
  const { friends } = useFriends();
  const width = useContentWidth();
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);

  if (!friends) return null;

  const today = todayISO();
  const { toFollowUp, fine } = splitByStatus(friends, today);
  const tileGap = 12;
  const tileWidth = Math.floor((width - tileGap * 2) / 3);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 24, paddingBottom: 110, gap: 16 }}>
        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Txt weight="title" size={36} accessibilityRole="header" style={{ lineHeight: 44, letterSpacing: -0.5 }}>
              Mes amis
            </Txt>
            <Pressable accessibilityRole="button" accessibilityLabel="Rechercher" onPress={() => setSearching(true)}>
              <Sticker radius={14} shadow={3} contentStyle={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                <SearchIcon />
              </Sticker>
            </Pressable>
          </View>
          <Txt weight={500} size={14} color={colors.muted}>
            {friends.length} {friends.length > 1 ? 'personnes' : 'personne'} · {toFollowUp.length} à relancer
          </Txt>
        </View>

        {friends.length === 0 && (
          <Txt color={colors.muted} style={{ marginTop: 8 }}>
            Ajoute ton premier ami avec le bouton +.
          </Txt>
        )}

        {toFollowUp.length > 0 && (
          <View style={{ gap: 8 }}>
            <SectionTitle color={colors.followUpText}>À relancer</SectionTitle>
            <FollowUpPanel friends={toFollowUp} today={today} width={width} />
          </View>
        )}

        {fine.length > 0 && (
          <View style={{ gap: 8 }}>
            <SectionTitle>Tout va bien</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: tileGap, rowGap: 14 }}>
              {fine.map((f) => (
                <FriendTile key={f.id} friend={f} today={today} width={tileWidth} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajouter un ami"
        onPress={() => setAdding(true)}
        style={({ pressed }) => ({ position: 'absolute', right: 20, bottom: 20, transform: [{ translateY: pressed ? 2 : 0 }] })}>
        <Sticker radius={18} background={colors.accent} contentStyle={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }}>
          <PlusIcon />
        </Sticker>
      </Pressable>

      {searching && <SearchOverlay friends={friends} today={today} onClose={() => setSearching(false)} />}
      <AddFriendSheet visible={adding} onClose={() => setAdding(false)} />
    </SafeAreaView>
  );
}
