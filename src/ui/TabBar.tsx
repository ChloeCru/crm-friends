import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import type { Tabs } from 'expo-router/js-tabs';

import { BellIcon, FriendsIcon, SlidersIcon } from './icons';
import { colors } from './theme';
import { Txt } from './Txt';

type Props = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TABS = {
  index: { label: 'Amis', Icon: FriendsIcon },
  rappels: { label: 'Rappels', Icon: BellIcon },
  reglages: { label: 'Réglages', Icon: SlidersIcon },
} as const;

/** Barre du bas des maquettes : fond blanc, filet à l'encre, onglet actif en accent. */
export function TabBar({ state, navigation, insets }: Props) {
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderTopWidth: 2,
        borderTopColor: colors.ink,
        paddingTop: 8,
        paddingHorizontal: 12,
        paddingBottom: Math.max(12, insets.bottom),
      }}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name as keyof typeof TABS];
        if (!tab) return null;
        const focused = state.index === index;
        const color = focused ? colors.accent : colors.muted;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            style={{ flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <tab.Icon color={color} />
            <Txt weight={focused ? 700 : 600} size={12} color={color}>
              {tab.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
