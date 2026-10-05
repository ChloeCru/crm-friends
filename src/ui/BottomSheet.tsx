import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from './theme';
import { Txt } from './Txt';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/** Panneau qui monte du bas, au-dessus d'un voile. Toucher le voile le ferme. */
export function BottomSheet({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={onClose}
          style={{ flex: 1, backgroundColor: 'rgba(23, 32, 58, 0.45)' }}
        />
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderWidth: 2,
            borderBottomWidth: 0,
            borderColor: colors.ink,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: Math.max(20, insets.bottom + 8),
            gap: 14,
          }}>
          <Txt weight="title" size={22} style={{ lineHeight: 28 }}>
            {title}
          </Txt>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
