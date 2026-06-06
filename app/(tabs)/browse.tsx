import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { happenings } from '@/data/happenings';
import { categories } from '@/data/categories';
import { Happening } from '@/types';
import { colors, radius, spacing, font, shadow } from '@/theme';
import { applyFilters, defaultFilters, DateFilter, SortKey } from '@/utils/filter';
import { HappeningCard } from '@/components/HappeningCard';
import { FilterChip } from '@/components/FilterChip';
import { EmptyState } from '@/components/EmptyState';

const DATE_OPTIONS: { key: DateFilter; label: string }[] = [
  { key: 'any', label: 'Any time' },
  { key: 'today', label: 'Today' },
  { key: 'weekend', label: 'This weekend' },
  { key: 'week', label: 'This week' },
];

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState(defaultFilters);

  const results = useMemo(() => applyFilters(happenings, filters), [filters]);

  const toggleCategory = (id: (typeof categories)[number]['id']) =>
    setFilters((f) => {
      const next = new Set(f.categories);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...f, categories: next };
    });

  const setDate = (date: DateFilter) => setFilters((f) => ({ ...f, date }));
  const toggleFree = () => setFilters((f) => ({ ...f, freeOnly: !f.freeOnly }));
  const cycleSort = () =>
    setFilters((f) => ({ ...f, sort: (f.sort === 'soonest' ? 'nearest' : 'soonest') as SortKey }));

  const header = (
    <View style={{ gap: spacing.lg }}>
      <View style={[styles.titleBlock, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.title}>Browse</Text>
        <Text style={styles.subtitle}>Find something to do near you</Text>
      </View>

      {/* Category tiles */}
      <View style={styles.tiles}>
        {categories.map((c) => {
          const active = filters.categories.has(c.id);
          const count = happenings.filter((h) => h.category === c.id).length;
          return (
            <Pressable
              key={c.id}
              onPress={() => toggleCategory(c.id)}
              style={[
                styles.tile,
                { backgroundColor: active ? c.color : colors.surface },
                active && shadow.card,
              ]}
            >
              <View
                style={[
                  styles.tileIcon,
                  { backgroundColor: active ? 'rgba(255,255,255,0.22)' : colors.white },
                ]}
              >
                <Ionicons name={c.icon as any} size={20} color={active ? colors.white : c.color} />
              </View>
              <Text style={[styles.tileLabel, active && { color: colors.white }]} numberOfLines={2}>
                {c.label}
              </Text>
              <Text style={[styles.tileCount, active && { color: 'rgba(255,255,255,0.85)' }]}>
                {count} events
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Date filters */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={DATE_OPTIONS}
        keyExtractor={(d) => d.key}
        contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.xl }}
        renderItem={({ item }) => (
          <FilterChip
            label={item.label}
            active={filters.date === item.key}
            onPress={() => setDate(item.key)}
          />
        )}
      />

      {/* Results bar */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCount}>
          {results.length} {results.length === 1 ? 'happening' : 'happenings'}
        </Text>
        <View style={styles.resultsActions}>
          <Pressable onPress={toggleFree} style={[styles.toggle, filters.freeOnly && styles.toggleOn]}>
            <Ionicons
              name="pricetag"
              size={13}
              color={filters.freeOnly ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.toggleText, filters.freeOnly && { color: colors.white }]}>Free</Text>
          </Pressable>
          <Pressable onPress={cycleSort} style={styles.toggle}>
            <Ionicons name="swap-vertical" size={13} color={colors.textSecondary} />
            <Text style={styles.toggleText}>
              {filters.sort === 'soonest' ? 'Soonest' : 'Nearest'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList<Happening>
      data={results}
      keyExtractor={(h) => h.id}
      ListHeaderComponent={header}
      contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }}
      columnWrapperStyle={undefined}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: spacing.xl }}>
          <HappeningCard item={item} />
        </View>
      )}
      ListEmptyComponent={
        <EmptyState
          icon="calendar-outline"
          title="Nothing matches those filters"
          subtitle="Try widening the date range or clearing a category."
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  titleBlock: { paddingHorizontal: spacing.xl, gap: 2 },
  title: { fontSize: font.size.display, fontWeight: font.weight.bold, color: colors.text },
  subtitle: { fontSize: font.size.md, color: colors.textSecondary },
  tiles: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  tile: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 116,
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { fontSize: font.size.sm, fontWeight: font.weight.bold, color: colors.text },
  tileCount: { fontSize: font.size.xs, color: colors.textSecondary },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  resultsCount: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.text },
  resultsActions: { flexDirection: 'row', gap: spacing.sm },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  toggleOn: { backgroundColor: colors.success, borderColor: colors.success },
  toggleText: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textSecondary },
});
