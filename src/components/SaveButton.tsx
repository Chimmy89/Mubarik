import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useSaved } from '@/context/SavedContext';

interface Props {
  id: string;
  size?: number;
  variant?: 'plain' | 'floating';
  style?: ViewStyle;
}

export function SaveButton({ id, size = 22, variant = 'plain', style }: Props) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(id);

  return (
    <Pressable
      hitSlop={8}
      onPress={() => toggleSaved(id)}
      style={[variant === 'floating' && styles.floating, style]}
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
    >
      <Ionicons
        name={saved ? 'heart' : 'heart-outline'}
        size={size}
        color={saved ? '#EF4444' : variant === 'floating' ? colors.text : colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floating: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
});
