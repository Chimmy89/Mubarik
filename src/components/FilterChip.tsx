import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, font } from '@/theme';

interface Props {
  label: string;
  active?: boolean;
  icon?: string;
  color?: string;
  onPress: () => void;
}

export function FilterChip({ label, active, icon, color, onPress }: Props) {
  const accent = color ?? colors.accent;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: accent, borderColor: accent },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={15}
          color={active ? colors.white : accent}
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  labelActive: {
    color: colors.white,
  },
});
