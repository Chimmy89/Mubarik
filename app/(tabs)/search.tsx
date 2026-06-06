import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { happenings } from '@/data/happenings';
import { Happening } from '@/types';
import { colors, radius, spacing, font } from '@/theme';
import { applyFilters, defaultFilters } from '@/utils/filter';
import { HappeningCard } from '@/components/HappeningCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';

const SUGGESTIONS = ['Football', 'Free', 'Kids', 'This weekend', 'Volunteering', 'Running', 'Market'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return applyFilters(happenings, { ...defaultFilters(), query });
  }, [query]);

  const empty = query.trim().length === 0;

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <Text style={styles.title}>Search</Text>
      <SearchBar value={query} onChangeText={setQuery} autoFocus={false} />
      {!empty && (
        <Text style={styles.resultsCount}>
          {results.length} {results.length === 1 ? 'result' : 'results'} for “{query.trim()}”
        </Text>
      )}
    </View>
  );

  if (empty) {
    return (
      <View style={{ flex: 1 }}>
        {header}
        <View style={styles.suggestWrap}>
          <Text style={styles.suggestTitle}>Popular searches</Text>
          <View style={styles.chips}>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => setQuery(s)}>
                <Ionicons name="trending-up" size={14} color={colors.accent} />
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <FlatList<Happening>
      data={results}
      keyExtractor={(h) => h.id}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: spacing.xl }}>
          <HappeningCard item={item} />
        </View>
      )}
      ListEmptyComponent={
        <EmptyState
          icon="search"
          title={`No results for “${query.trim()}”`}
          subtitle="Try a different keyword, place or activity."
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: { fontSize: font.size.display, fontWeight: font.weight.bold, color: colors.text },
  resultsCount: { fontSize: font.size.sm, color: colors.textSecondary },
  suggestWrap: { paddingHorizontal: spacing.xl, gap: spacing.md },
  suggestTitle: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.text },
});
