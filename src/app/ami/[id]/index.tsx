import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { useFriend } from '@/db/hooks';
import { deleteFriend, insertContact, updateFriend } from '@/db/queries';
import {
  CHANNEL_LABELS,
  daysSince,
  needsFollowUp,
  relativeDay,
  RHYTHM_CHOICES,
  rhythmLabel,
  shortDate,
  todayISO,
} from '@/domain/friendship';
import { CHANNELS, type Channel } from '@/domain/types';
import { BackLink } from '@/ui/BackLink';
import { BottomSheet } from '@/ui/BottomSheet';
import { Button, SheetOption } from '@/ui/Button';
import { ChannelIcon, CheckIcon, MoreIcon, PencilIcon, TrashIcon } from '@/ui/icons';
import { SCREEN_PADDING } from '@/ui/layout';
import { Sticker } from '@/ui/Sticker';
import { colors, fonts, tileColor } from '@/ui/theme';
import { SectionTitle, Txt } from '@/ui/Txt';

type Sheet = 'channel' | 'rhythm' | 'menu' | null;

export default function FriendScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const { friend, contacts, reload } = useFriend(id);
  const [sheet, setSheet] = useState<Sheet>(null);

  if (friend === undefined) return null;
  if (friend === null) {
    return (
      <SafeAreaView style={{ flex: 1, padding: SCREEN_PADDING }}>
        <BackLink label="Amis" />
        <Txt>Cet ami n’existe plus.</Txt>
      </SafeAreaView>
    );
  }

  const today = todayISO();
  const late = needsFollowUp(friend.lastContact, friend.rhythmDays, today);
  const channels = friend.channels.length > 0 ? friend.channels : CHANNELS;

  const logContact = async (channel: Channel) => {
    setSheet(null);
    await insertContact(db, { friendId: friend.id, date: today, channel });
    reload();
  };

  const onTookNews = () => (channels.length === 1 ? logContact(channels[0]) : setSheet('channel'));

  const setRhythm = async (rhythmDays: number) => {
    setSheet(null);
    await updateFriend(db, friend.id, { rhythmDays });
    reload();
  };

  const confirmDelete = () => {
    setSheet(null);
    // Laisse le panneau se fermer avant d'ouvrir l'alerte (iOS n'empile pas les deux).
    setTimeout(() => {
      Alert.alert(`Supprimer ${friend.name} ?`, 'Sa fiche et tout son historique de contacts seront effacés.', [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteFriend(db, friend.id);
            router.dismissTo('/');
          },
        },
      ]);
    }, 350);
  };

  const rhythmChoices = RHYTHM_CHOICES.includes(friend.rhythmDays as (typeof RHYTHM_CHOICES)[number])
    ? RHYTHM_CHOICES
    : [...RHYTHM_CHOICES, friend.rhythmDays].sort((a, b) => a - b);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 16, paddingBottom: 40, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackLink label="Amis" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Plus d'options"
            onPress={() => setSheet('menu')}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <MoreIcon />
          </Pressable>
        </View>

        <Sticker
          radius={24}
          background={late ? colors.followUp : tileColor(friend.colorIndex)}
          contentStyle={{ height: 190, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ marginBottom: -14 }}>
            <Avatar seed={friend.id} settings={friend.avatar} size={200} />
          </View>
          {late && (
            <View
              style={{
                position: 'absolute',
                left: 12,
                top: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: colors.ink,
                backgroundColor: colors.card,
              }}>
              <Txt weight={700} size={12} color={colors.followUpText} style={{ lineHeight: 16 }}>
                À relancer
              </Txt>
            </View>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/ami/[id]/look', params: { id: friend.id } })}
            style={{
              position: 'absolute',
              right: 12,
              bottom: 12,
              height: 44,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: colors.ink,
              backgroundColor: colors.card,
            }}>
            <PencilIcon />
            <Txt weight={700} size={13}>
              Son look
            </Txt>
          </Pressable>
        </Sticker>

        <View style={{ gap: 2 }}>
          <Txt weight="title" size={34} accessibilityRole="header" style={{ lineHeight: 40, letterSpacing: -0.5 }}>
            {friend.name}
          </Txt>
          {friend.label !== '' && (
            <Txt weight={500} size={14} color={colors.muted}>
              {friend.label}
            </Txt>
          )}
        </View>

        <Sticker radius={18} shadow={0} contentStyle={{ flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12, gap: 12 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt weight={600} size={12} color={colors.muted}>
              Dernier contact
            </Txt>
            <Txt weight={700} size={17} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
              {relativeDay(daysSince(friend.lastContact, today))}
            </Txt>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Rythme voulu : ${rhythmLabel(friend.rhythmDays)}`}
            accessibilityHint="Modifier le rythme"
            onPress={() => setSheet('rhythm')}
            style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Txt weight={600} size={12} color={colors.muted}>
                Rythme voulu
              </Txt>
              <PencilIcon size={12} color={colors.muted} />
            </View>
            <Txt weight={700} size={17} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
              {rhythmLabel(friend.rhythmDays)}
            </Txt>
          </Pressable>
        </Sticker>

        <Button
          label="J'ai pris des nouvelles"
          icon={<CheckIcon />}
          onPress={onTookNews}
          accessibilityHint="Enregistre un contact daté d'aujourd'hui"
        />

        <View style={{ gap: 6, marginTop: 4 }}>
          <SectionTitle>Derniers contacts</SectionTitle>
          {contacts.length === 0 ? (
            <Txt color={colors.muted}>Aucun contact enregistré.</Txt>
          ) : (
            contacts.map((c, i) => (
              <View
                key={c.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  height: 40,
                  borderBottomWidth: i < contacts.length - 1 ? 1 : 0,
                  borderBottomColor: colors.separator,
                }}>
                <ChannelIcon channel={c.channel} />
                <Txt weight={600} style={{ flex: 1 }}>
                  {CHANNEL_LABELS[c.channel]}
                </Txt>
                <Txt size={14} color={colors.muted}>
                  {shortDate(c.date, today)}
                </Txt>
              </View>
            ))
          )}
        </View>

        <View style={{ gap: 6 }}>
          <SectionTitle>Notes</SectionTitle>
          <NotesField key={friend.id} friendId={friend.id} initial={friend.notes} />
        </View>
      </ScrollView>

      <BottomSheet visible={sheet === 'channel'} onClose={() => setSheet(null)} title="Par quel moyen ?">
        {channels.map((ch) => (
          <SheetOption key={ch} label={CHANNEL_LABELS[ch]} icon={<ChannelIcon channel={ch} size={22} />} onPress={() => logContact(ch)} />
        ))}
      </BottomSheet>

      <BottomSheet visible={sheet === 'rhythm'} onClose={() => setSheet(null)} title="Rythme voulu">
        {rhythmChoices.map((days) => (
          <SheetOption
            key={days}
            label={rhythmLabel(days)}
            selected={days === friend.rhythmDays}
            icon={days === friend.rhythmDays ? <CheckIcon color={colors.accent} /> : undefined}
            onPress={() => setRhythm(days)}
          />
        ))}
      </BottomSheet>

      <BottomSheet visible={sheet === 'menu'} onClose={() => setSheet(null)} title={friend.name}>
        <SheetOption
          label="Modifier les détails"
          icon={<PencilIcon size={20} />}
          onPress={() => {
            setSheet(null);
            router.push({ pathname: '/ami/[id]/modifier', params: { id: friend.id } });
          }}
        />
        <SheetOption label="Supprimer" icon={<TrashIcon color={colors.followUpText} />} color={colors.followUpText} onPress={confirmDelete} />
      </BottomSheet>
    </SafeAreaView>
  );
}

/** Notes enregistrées automatiquement : 600 ms après la dernière frappe, en quittant le champ et en quittant l'écran. */
function NotesField({ friendId, initial }: { friendId: string; initial: string }) {
  const db = useSQLiteContext();
  const [value, setValue] = useState(initial);
  const pending = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (pending.current !== null) {
      updateFriend(db, friendId, { notes: pending.current });
      pending.current = null;
    }
  }, [db, friendId]);

  useEffect(() => flush, [flush]);

  const onChange = (text: string) => {
    setValue(text);
    pending.current = text;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 600);
  };

  return (
    <Sticker radius={16} shadow={0} borderStyle="dashed" contentStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}>
      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        onBlur={flush}
        placeholder="Ajouter une note"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Notes"
        style={{ minHeight: 64, fontFamily: fonts[400], fontSize: 15, lineHeight: 21, color: colors.ink, textAlignVertical: 'top' }}
      />
    </Sticker>
  );
}
