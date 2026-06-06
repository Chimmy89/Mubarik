import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Happening } from '@/types';
import { categoryById } from '@/data/categories';
import { colors, radius, spacing, font, shadow } from '@/theme';
import {
  relativeDay,
  formatTimeRange,
  formatDistance,
  distanceFor,
  formatPrice,
} from '@/utils/format';
import { SaveButton } from './SaveButton';

export function HappeningCard({ item }: { item: Happening }) {
  const router = useRouter();
  const cat = categoryById[item.category];

  return (
    <Pressable
      onPress={() => router.push(`/happening/${item.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={[styles.catTag, { backgroundColor: cat.color }]}>
          <Ionicons name={cat.icon as any} size={13} color={colors.white} />
          <Text style={styles.catTagText}>{item.subcategory}</Text>
        </View>
        <SaveButton id={item.id} variant="floating" style={styles.save} />
        {item.price === 0 && (
          <View style={styles.freeTag}>
            <Text style={styles.freeTagText}>FREE</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.accent} />
          <Text style={styles.metaPrimary}>
            {relativeDay(item.start)} · {formatTimeRange(item)}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.metaSecondary} numberOfLines={1}>
              {item.venueName} · {formatDistance(distanceFor(item))}
            </Text>
          </View>
          {item.price > 0 && <Text style={styles.price}>{formatPrice(item)}</Text>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  pressed: { opacity: 0.92 },
  image: {
    width: '100%',
    height: 168,
    backgroundColor: colors.surfaceAlt,
  },
  catTag: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  catTagText: {
    color: colors.white,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
  },
  save: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    ...shadow.floating,
  },
  freeTag: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  freeTagText: {
    color: colors.white,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    letterSpacing: 0.5,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  metaPrimary: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.accent,
  },
  title: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.text,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metaSecondary: {
    fontSize: font.size.sm,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  price: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
});
