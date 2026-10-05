import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/ui/TabBar';
import { colors } from '@/ui/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="rappels" />
      <Tabs.Screen name="reglages" />
    </Tabs>
  );
}
