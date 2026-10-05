import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { daysSince, relativeDay } from '@/domain/friendship';
import type { FriendWithLastContact } from '@/domain/types';
import { SearchIcon } from '@/ui/icons';
import { Sticker } from '@/ui/Sticker';
import { colors, fonts, tileColor } from '@/ui/theme';
import { Txt } from '@/ui/Txt';

import { Avatar } from './Avatar';

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

type Props = { friends: FriendWithLastContact[]; today: string; onClose: () => void };

/** Recherche : fond opaque par-dessus la galerie, résultats sous le champ. */
export function SearchOverlay({ friends, today, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());
  const results = q ? friends.filter((f) => normalize(`${f.name} ${f.label}`).includes(q)) : friends;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        paddingTop: insets.top + 16,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20 }}>
        <Sticker
          radius={16}
          shadow={3}
          style={{ flex: 1 }}
          contentStyle={{ height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
          <SearchIcon />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un ami"
            placeholderTextColor={colors.muted}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Rechercher un ami"
            style={{ flex: 1, height: '100%', fontFamily: fonts[500], fontSize: 16, color: colors.ink }}
          />
        </Sticker>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={{ height: 44, paddingHorizontal: 8, justifyContent: 'center', marginBottom: 3 }}>
          <Txt weight={700} size={16}>
            Annuler
          </Txt>
        </Pressable>
      </View>

      <FlatList
        data={results}
        keyExtractor={(f) => f.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20 }}
        ListEmptyComponent={
          <Txt color={colors.muted} style={{ paddingVertical: 16 }}>
            Aucun ami ne correspond.
          </Txt>
        }
        renderItem={({ item: f }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onClose();
              router.push(`/ami/${f.id}`);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              minHeight: 64,
              borderBottomWidth: 1,
              borderBottomColor: colors.separator,
            }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: colors.ink,
                backgroundColor: tileColor(f.colorIndex),
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <View style={{ marginBottom: -5 }}>
                <Avatar seed={f.id} settings={f.avatar} size={50} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Txt weight={700} size={16} numberOfLines={1}>
                {f.name}
              </Txt>
              <Txt size={13} color={colors.muted} numberOfLines={1}>
                {[f.label, relativeDay(daysSince(f.lastContact, today))].filter(Boolean).join(' · ')}
              </Txt>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
