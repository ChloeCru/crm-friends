import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BEARD,
  CLOTHES,
  CLOTHES_COLORS,
  EYEBROWS,
  EYES,
  HAIR,
  HAIR_COLORS,
  MOUTH,
  randomAvatar,
  REAR_HAIR,
  SKIN_COLORS,
} from '@/avatar/options';
import { Avatar } from '@/components/Avatar';
import { ColorSection, ShapeSection, type ShapeOption } from '@/components/AvatarPickers';
import { useFriend } from '@/db/hooks';
import { updateFriend } from '@/db/queries';
import { needsFollowUp, todayISO } from '@/domain/friendship';
import type { AvatarSettings, FriendWithLastContact } from '@/domain/types';
import { BackLink } from '@/ui/BackLink';
import { Button } from '@/ui/Button';
import { DiceIcon } from '@/ui/icons';
import { SCREEN_PADDING, useContentWidth } from '@/ui/layout';
import { Sticker } from '@/ui/Sticker';
import { colors, tileColor } from '@/ui/theme';
import { Txt } from '@/ui/Txt';

const TABS = ['Coiffure', 'Visage', 'Tenue', 'Barbe'] as const;
type Tab = (typeof TABS)[number];

/** Éditeur d'avatar. `nouveau=1` : ami tout juste créé, « Enregistrer » ouvre alors sa fiche. */
export default function LookEditorScreen() {
  const { id, nouveau } = useLocalSearchParams<{ id: string; nouveau?: string }>();
  const { friend } = useFriend(id);
  return friend ? <LookEditor friend={friend} isNew={nouveau === '1'} /> : null;
}

function LookEditor({ friend, isNew }: { friend: FriendWithLastContact; isNew: boolean }) {
  const db = useSQLiteContext();
  const width = useContentWidth();
  const [tab, setTab] = useState<Tab>('Coiffure');
  const [settings, setSettings] = useState<AvatarSettings>(friend.avatar);

  const set = (patch: Partial<AvatarSettings>) => setSettings({ ...settings, ...patch });

  /** Une vignette par valeur d'un réglage, plus éventuellement « Aucune » (probabilité à 0). */
  function shapes<K extends keyof AvatarSettings>(
    key: K,
    choices: { value: AvatarSettings[K]; label: string }[],
    none?: { probability: 'rearHairProbability' | 'beardProbability' },
  ): ShapeOption[] {
    const s = settings;
    const shown = none ? s[none.probability] === 100 : true;
    const options: ShapeOption[] = choices.map((c) => {
      const patch = { [key]: c.value, ...(none ? { [none.probability]: 100 } : {}) } as Partial<AvatarSettings>;
      return {
        key: String(c.value),
        label: c.label,
        preview: { ...s, ...patch },
        selected: shown && s[key] === c.value,
        onPick: () => set(patch),
      };
    });
    if (!none) return options;
    const off = { [none.probability]: 0 } as Partial<AvatarSettings>;
    return [{ key: 'none', label: 'Aucune', preview: { ...s, ...off }, selected: !shown, onPick: () => set(off) }, ...options];
  }

  const save = async () => {
    await updateFriend(db, friend.id, { avatar: settings });
    if (isNew) router.replace({ pathname: '/ami/[id]', params: { id: friend.id } });
    else router.back();
  };

  const late = needsFollowUp(friend.lastContact, friend.rhythmDays, todayISO());

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <BackLink label={friend.name} />
          <Txt weight="title" size={22} accessibilityRole="header" style={{ lineHeight: 28 }}>
            Son look
          </Txt>
        </View>

        <Sticker
          radius={24}
          background={late ? colors.followUp : tileColor(friend.colorIndex)}
          contentStyle={{ height: 230, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ marginBottom: -16 }} accessibilityLabel={`Aperçu de l'avatar de ${friend.name}`}>
            <Avatar seed={friend.id} settings={settings} size={240} />
          </View>
        </Sticker>

        <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 6 }}>
          {TABS.map((t) => {
            const on = t === tab;
            return (
              <Pressable
                key={t}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => setTab(t)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: colors.ink,
                  backgroundColor: on ? colors.ink : colors.card,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Txt weight={700} size={14} color={on ? colors.white : colors.ink}>
                  {t}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 14, paddingBottom: 20, gap: 16 }}>
        {tab === 'Coiffure' && (
          <>
            <ShapeSection title="Coupe" seed={friend.id} width={width} options={shapes('hairVariant', HAIR)} />
            <ShapeSection
              title="Longueur derrière"
              seed={friend.id}
              width={width}
              options={shapes('rearHairVariant', REAR_HAIR, { probability: 'rearHairProbability' })}
            />
            <ColorSection title="Couleur des cheveux" choices={HAIR_COLORS} value={settings.hairColor} onPick={(hairColor) => set({ hairColor })} />
          </>
        )}
        {tab === 'Visage' && (
          <>
            <ShapeSection title="Yeux" seed={friend.id} width={width} zoom="face" options={shapes('eyesVariant', EYES)} />
            <ShapeSection title="Sourcils" seed={friend.id} width={width} zoom="face" options={shapes('eyebrowsVariant', EYEBROWS)} />
            <ShapeSection title="Bouche" seed={friend.id} width={width} zoom="face" options={shapes('mouthVariant', MOUTH)} />
            <ColorSection title="Couleur de peau" choices={SKIN_COLORS} value={settings.skinColor} onPick={(skinColor) => set({ skinColor })} />
          </>
        )}
        {tab === 'Tenue' && (
          <>
            <ShapeSection title="Vêtement" seed={friend.id} width={width} options={shapes('clothesVariant', CLOTHES)} />
            <ColorSection title="Couleur" choices={CLOTHES_COLORS} value={settings.clothesColor} onPick={(clothesColor) => set({ clothesColor })} />
          </>
        )}
        {tab === 'Barbe' && (
          <ShapeSection title="Barbe" seed={friend.id} width={width} options={shapes('beardVariant', BEARD, { probability: 'beardProbability' })} />
        )}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: SCREEN_PADDING, paddingTop: 8, paddingBottom: 12 }}>
        <Button label="Au hasard" variant="secondary" icon={<DiceIcon />} onPress={() => setSettings(randomAvatar())} />
        <Button label="Enregistrer" onPress={save} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
}
