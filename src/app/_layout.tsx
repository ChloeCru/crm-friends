import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

import { initDatabase } from '@/db/migrations';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="crm-friends.db" onInit={initDatabase}>
      <Stack />
    </SQLiteProvider>
  );
}
