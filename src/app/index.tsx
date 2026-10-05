// Écran provisoire (étape 1) : vérifie la base et les valeurs calculées.
// Remplacé par la galerie à l'étape 3.
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';

import { listFriends } from '@/db/queries';
import { daysSince, relativeDay, splitByStatus, todayISO } from '@/domain/friendship';
import type { FriendWithLastContact } from '@/domain/types';

export default function Index() {
  const db = useSQLiteContext();
  const [friends, setFriends] = useState<FriendWithLastContact[]>([]);

  useEffect(() => {
    listFriends(db).then(setFriends);
  }, [db]);

  const today = todayISO();
  const { toFollowUp, fine } = splitByStatus(friends, today);
  const line = (f: FriendWithLastContact) =>
    `${f.name} — ${relativeDay(daysSince(f.lastContact, today))} (rythme ${f.rhythmDays} j)`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {friends.length} personnes · {toFollowUp.length} à relancer
      </Text>
      <Text style={styles.section}>À relancer</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {friends.map((f) => (
          <View key={f.id} style={{ backgroundColor: '#FFE1C7', borderWidth: 2 }}>
            <Avatar seed={f.id} settings={f.avatar} size={100} />
          </View>
        ))}
      </View>
      {toFollowUp.map((f) => (
        <Text key={f.id}>{line(f)}</Text>
      ))}
      <Text style={styles.section}>Tout va bien</Text>
      {fine.map((f) => (
        <Text key={f.id}>{line(f)}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 6 },
  title: { fontSize: 18, fontWeight: '700' },
  section: { marginTop: 12, fontWeight: '700', textTransform: 'uppercase' },
});
