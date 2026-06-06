import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { happenings } from '@/data/happenings';
import { Happening } from '@/types';
import { colors, spacing, font } from '@/theme';
import { useSaved } from '@/context/SavedContext';
import { HappeningCard } from '@/components/HappeningCard';
import { EmptyState } from '@/components/EmptyState';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { saved } = useSaved();

  const items = useMemo(
    () =>
      happenings
        .filter((h) => saved.has(h.id))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [saved],
  );

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <Text style={styles.title}>Saved</Text>
      <Text style={styles.subtitle}>
        {items.length > 0
          ? `${items.length} ${items.length === 1 ? 'happening' : 'happenings'} you’re keeping an eye on`
          : 'Tap the heart on any happening to keep it here'}
      </Text>
    </View>
  );

  return (
    <FlatList<Happening>
      data={items}
      keyExtractor={(h) => h.id}
      ListHeaderComponent={header}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: spacing.xl }}>
          <HappeningCard item={item} />
        </View>
      )}
      ListEmptyComponent={
        <EmptyState
          icon="heart-outline"
          title="No saved happenings yet"
          subtitle="Browse the map or feed and tap the heart to save things for later."
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    gap: 4,
    paddingBottom: spacing.lg,
  },
  title: { fontSize: font.size.display, fontWeight: font.weight.bold, color: colors.text },
  subtitle: { fontSize: font.size.md, color: colors.textSecondary, lineHeight: 21 },
});
