// Vignettes de la galerie : avatar rond (« À relancer ») et vignette colorée (« Tout va bien »).
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { daysSince, relativeDay } from '@/domain/friendship';
import type { FriendWithLastContact } from '@/domain/types';

import { Sticker } from './Sticker';
import { colors, tileColor } from './theme';
import { Txt } from './Txt';

const openFriend = (id: string) => router.push(`/ami/${id}`);

export function FollowUpBubble({ friend, today, width }: { friend: FriendWithLastContact; today: string; width: number }) {
  const when = relativeDay(daysSince(friend.lastContact, today));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${friend.name}, ${when}`}
      onPress={() => openFriend(friend.id)}
      style={{ width, alignItems: 'center', gap: 4 }}>
      <View
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          borderWidth: 2,
          borderColor: colors.ink,
          backgroundColor: colors.card,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <View style={{ marginBottom: -8 }}>
          <Avatar seed={friend.id} settings={friend.avatar} size={88} />
        </View>
      </View>
      <Txt weight={700} size={15} numberOfLines={1} style={{ lineHeight: 18 }}>
        {friend.name}
      </Txt>
      <Txt weight={600} size={12} color={colors.followUpText} numberOfLines={1} style={{ lineHeight: 16 }}>
        {when}
      </Txt>
    </Pressable>
  );
}

/** Panneau orangé « À relancer » : grille de 3 colonnes. `width` = largeur disponible. */
export function FollowUpPanel({ friends, today, width }: { friends: FriendWithLastContact[]; today: string; width: number }) {
  const gap = 8;
  const inner = width - 4 - 24;
  const col = Math.floor((inner - gap * 2) / 3);
  return (
    <Sticker radius={20} background={colors.followUp} contentStyle={{ padding: 12, flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {friends.map((f) => (
        <FollowUpBubble key={f.id} friend={f} today={today} width={col} />
      ))}
    </Sticker>
  );
}

export function FriendTile({ friend, today, width }: { friend: FriendWithLastContact; today: string; width: number }) {
  const when = relativeDay(daysSince(friend.lastContact, today));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${friend.name}, ${when}`}
      onPress={() => openFriend(friend.id)}
      style={{ width, gap: 5 }}>
      <Sticker
        radius={16}
        shadow={3}
        background={tileColor(friend.colorIndex)}
        contentStyle={{ height: 96, alignItems: 'center', justifyContent: 'flex-end' }}>
        <View style={{ marginBottom: -8 }}>
          <Avatar seed={friend.id} settings={friend.avatar} size={100} />
        </View>
      </Sticker>
      <Txt weight={700} size={15} numberOfLines={1} style={{ lineHeight: 18 }}>
        {friend.name}
      </Txt>
      <Txt size={12} color={colors.muted} numberOfLines={1} style={{ lineHeight: 16, marginTop: -3 }}>
        {when}
      </Txt>
    </Pressable>
  );
}
