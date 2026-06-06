import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { MapView, Marker, PROVIDER_DEFAULT } from '@/components/Map';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { happenings, USER_LOCATION } from '@/data/happenings';
import { categories, categoryById } from '@/data/categories';
import { CategoryId, Happening } from '@/types';
import { colors, radius, spacing, font, shadow } from '@/theme';
import { relativeDay, formatTimeRange, formatPrice, formatDistance, distanceFor } from '@/utils/format';
import { FilterChip } from '@/components/FilterChip';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.xl * 2;
const CARD_SPACING = spacing.md;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList<Happening>>(null);
  const [activeCats, setActiveCats] = useState<Set<CategoryId>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      activeCats.size === 0
        ? happenings
        : happenings.filter((h) => activeCats.has(h.category)),
    [activeCats],
  );

  const toggleCat = (id: CategoryId) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSelectedId(null);
  };

  const focusOn = (h: Happening, index: number) => {
    setSelectedId(h.id);
    mapRef.current?.animateToRegion(
      {
        latitude: h.latitude - 0.012,
        longitude: h.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      },
      350,
    );
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        showsUserLocation
        initialRegion={{
          latitude: USER_LOCATION.latitude,
          longitude: USER_LOCATION.longitude,
          latitudeDelta: 0.14,
          longitudeDelta: 0.14,
        }}
      >
        {visible.map((h, index) => {
          const cat = categoryById[h.category];
          const active = h.id === selectedId;
          return (
            <Marker
              key={h.id}
              coordinate={{ latitude: h.latitude, longitude: h.longitude }}
              onPress={() => focusOn(h, index)}
              zIndex={active ? 99 : 1}
            >
              <View style={[styles.pin, active && styles.pinActive, { borderColor: cat.color }]}>
                <Ionicons
                  name={cat.icon as any}
                  size={active ? 18 : 15}
                  color={cat.color}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Header overlay */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>HAPPENING NEAR</Text>
            <View style={styles.locRow}>
              <Ionicons name="location" size={16} color={colors.accent} />
              <Text style={styles.locText}>{USER_LOCATION.label}</Text>
            </View>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{visible.length} nearby</Text>
          </View>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.sm }}
          renderItem={({ item }) => (
            <FilterChip
              label={item.label}
              icon={item.icon}
              color={item.color}
              active={activeCats.has(item.id)}
              onPress={() => toggleCat(item.id)}
            />
          )}
        />
      </View>

      {/* Bottom carousel */}
      <FlatList
        ref={listRef}
        data={visible}
        horizontal
        keyExtractor={(h) => h.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.carousel,
          { paddingBottom: spacing.lg },
        ]}
        style={[styles.carouselWrap, { bottom: insets.bottom + spacing.sm }]}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => (
          <MapCard
            item={item}
            selected={item.id === selectedId}
            onPress={() => router.push(`/happening/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

function MapCard({
  item,
  selected,
  onPress,
}: {
  item: Happening;
  selected: boolean;
  onPress: () => void;
}) {
  const cat = categoryById[item.category];
  return (
    <Pressable
      onPress={onPress}
      style={[styles.mapCard, selected && { borderColor: cat.color, borderWidth: 2 }]}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.mapCardImg} />
      <View style={styles.mapCardBody}>
        <Text style={[styles.mapCardCat, { color: cat.color }]}>{item.subcategory.toUpperCase()}</Text>
        <Text style={styles.mapCardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.mapCardMeta} numberOfLines={1}>
          {relativeDay(item.start)} · {formatTimeRange(item)}
        </Text>
        <View style={styles.mapCardFooter}>
          <Text style={styles.mapCardDist}>
            <Ionicons name="navigate" size={12} color={colors.textSecondary} />{' '}
            {formatDistance(distanceFor(item))}
          </Text>
          <Text style={[styles.mapCardPrice, item.price === 0 && { color: colors.success }]}>
            {formatPrice(item)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceAlt },
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  pinActive: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locText: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.text },
  countPill: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  countText: { color: colors.accent, fontWeight: font.weight.bold, fontSize: font.size.sm },
  carouselWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    maxHeight: 132,
  },
  carousel: {
    paddingHorizontal: spacing.xl,
    gap: CARD_SPACING,
  },
  mapCard: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.floating,
  },
  mapCardImg: { width: 104, height: '100%', backgroundColor: colors.surfaceAlt },
  mapCardBody: { flex: 1, padding: spacing.md, gap: 3, justifyContent: 'center' },
  mapCardCat: { fontSize: 10, fontWeight: font.weight.bold, letterSpacing: 0.5 },
  mapCardTitle: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.text, lineHeight: 19 },
  mapCardMeta: { fontSize: font.size.xs, color: colors.textSecondary },
  mapCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  mapCardDist: { fontSize: font.size.xs, color: colors.textSecondary, fontWeight: font.weight.medium },
  mapCardPrice: { fontSize: font.size.sm, fontWeight: font.weight.bold, color: colors.text },
});
