import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { TextInput } from 'react-native';

import { randomAvatar } from '@/avatar/options';
import { insertFriend } from '@/db/queries';
import { BottomSheet } from '@/ui/BottomSheet';
import { Button } from '@/ui/Button';
import { Sticker } from '@/ui/Sticker';
import { colors, fonts } from '@/ui/theme';

/** « + » : demande le prénom, crée l'ami avec un look tiré au hasard, puis ouvre l'éditeur d'avatar. */
export function AddFriendSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const close = () => {
    setName('');
    onClose();
  };

  const submit = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const id = await insertFriend(db, { name, avatar: randomAvatar() });
      close();
      router.push({ pathname: '/ami/[id]/look', params: { id, nouveau: '1' } });
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={close} title="Nouvel ami">
      <Sticker radius={16} shadow={0} contentStyle={{ height: 52, paddingHorizontal: 14, justifyContent: 'center' }}>
        <TextInput
          autoFocus
          value={name}
          onChangeText={setName}
          placeholder="Prénom"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={submit}
          accessibilityLabel="Prénom"
          style={{ fontFamily: fonts[600], fontSize: 17, color: colors.ink }}
        />
      </Sticker>
      <Button label="Choisir son look" onPress={submit} disabled={!name.trim() || saving} />
    </BottomSheet>
  );
}
