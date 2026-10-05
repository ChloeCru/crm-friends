import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFriend } from '@/db/hooks';
import { updateFriend } from '@/db/queries';
import { CHANNEL_LABELS } from '@/domain/friendship';
import { CHANNELS, type Channel, type Friend } from '@/domain/types';
import { BackLink } from '@/ui/BackLink';
import { Button } from '@/ui/Button';
import { ChannelIcon } from '@/ui/icons';
import { SCREEN_PADDING } from '@/ui/layout';
import { Sticker } from '@/ui/Sticker';
import { colors, fonts } from '@/ui/theme';
import { SectionTitle, Txt } from '@/ui/Txt';

/** Détails d'un ami (menu ⋯ › Modifier) : prénom, libellé, canaux habituels. */
export default function EditFriendScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { friend } = useFriend(id);
  return friend ? <EditFriend friend={friend} /> : null;
}

function EditFriend({ friend }: { friend: Friend }) {
  const db = useSQLiteContext();
  const [name, setName] = useState(friend.name);
  const [label, setLabel] = useState(friend.label);
  const [channels, setChannels] = useState<Channel[]>(friend.channels);

  const toggle = (ch: Channel) =>
    setChannels((cur) => (cur.includes(ch) ? cur.filter((c) => c !== ch) : CHANNELS.filter((c) => c === ch || cur.includes(c))));

  const save = async () => {
    await updateFriend(db, friend.id, { name, label: label.trim(), channels });
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 16, paddingBottom: 24, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <BackLink label={friend.name} />
          <Txt weight="title" size={22} accessibilityRole="header" style={{ lineHeight: 28 }}>
            Modifier
          </Txt>
        </View>

        <Field label="Prénom" value={name} onChange={setName} autoCapitalize="words" />
        <Field label="Libellé" value={label} onChange={setLabel} placeholder="Ex. Amie de fac · Lyon" autoCapitalize="sentences" />

        <View style={{ gap: 8, marginTop: 4 }}>
          <SectionTitle>Canaux habituels</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CHANNELS.map((ch) => {
              const on = channels.includes(ch);
              return (
                <Pressable
                  key={ch}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  onPress={() => toggle(ch)}
                  style={{
                    height: 44,
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: colors.ink,
                    backgroundColor: on ? colors.ink : colors.card,
                  }}>
                  <ChannelIcon channel={ch} color={on ? colors.white : colors.ink} />
                  <Txt weight={700} size={14} color={on ? colors.white : colors.ink}>
                    {CHANNEL_LABELS[ch]}
                  </Txt>
                </Pressable>
              );
            })}
          </View>
          <Txt size={13} color={colors.muted}>
            Proposés quand tu notes que tu as pris des nouvelles. Aucun choisi : les quatre sont proposés.
          </Txt>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: SCREEN_PADDING, paddingBottom: 12 }}>
        <Button label="Enregistrer" onPress={save} disabled={!name.trim()} />
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoCapitalize: 'words' | 'sentences';
}) {
  return (
    <View style={{ gap: 6 }}>
      <SectionTitle>{label}</SectionTitle>
      <Sticker radius={16} shadow={0} contentStyle={{ height: 52, paddingHorizontal: 14, justifyContent: 'center' }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          autoCapitalize={autoCapitalize}
          accessibilityLabel={label}
          style={{ fontFamily: fonts[600], fontSize: 17, color: colors.ink }}
        />
      </Sticker>
    </View>
  );
}
