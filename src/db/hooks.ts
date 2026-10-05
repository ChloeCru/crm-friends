import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import type { Contact, FriendWithLastContact } from '@/domain/types';

import { getFriend, listContacts, listFriends } from './queries';

/** Liste des amis, rechargée chaque fois que l'écran reprend le focus. */
export function useFriends() {
  const db = useSQLiteContext();
  const [friends, setFriends] = useState<FriendWithLastContact[] | null>(null);

  const reload = useCallback(() => {
    listFriends(db).then(setFriends);
  }, [db]);

  useFocusEffect(reload);
  return { friends, reload };
}

/** Un ami et ses contacts. `friend` vaut `undefined` pendant le chargement, `null` s'il n'existe plus. */
export function useFriend(id: string) {
  const db = useSQLiteContext();
  const [friend, setFriend] = useState<FriendWithLastContact | null | undefined>(undefined);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const reload = useCallback(() => {
    Promise.all([getFriend(db, id), listContacts(db, id)]).then(([f, c]) => {
      setFriend(f);
      setContacts(c);
    });
  }, [db, id]);

  useFocusEffect(reload);
  return { friend, contacts, reload };
}
