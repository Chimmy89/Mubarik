import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { happenings } from '@/data/happenings';
import { categoryById } from '@/data/categories';
import { colors, radius, spacing, font, shadow } from '@/theme';
import {
  formatDateTime,
  formatTimeRange,
  formatPrice,
  formatDistance,
  distanceFor,
} from '@/utils/format';
import { SaveButton } from '@/components/SaveButton';
import { useSaved } from '@/context/SavedContext';
import { EmptyState } from '@/components/EmptyState';

export default function HappeningDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSaved, toggleSaved } = useSaved();

  const item = happenings.find((h) => h.id === id);

  if (!item) {
    return <EmptyState icon="alert-circle-outline" title="Happening not found" />;
  }

  const cat = categoryById[item.category];
  const saved = isSaved(item.id);

  const openDirections = () => {
    const label = encodeURIComponent(item.venueName);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${label}&ll=${item.latitude},${item.longitude}`,
      default: `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`,
    });
    Linking.openURL(url!);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackTitle: 'Back' }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View>
          <Image source={{ uri: item.imageUrl }} style={styles.hero} />
          <View style={styles.heroShade} />
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + spacing.sm }]}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <View style={[styles.catBadge, { backgroundColor: cat.color }]}>
            <Ionicons name={cat.icon as any} size={14} color={colors.white} />
            <Text style={styles.catBadgeText}>{cat.label}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>

          {item.recurring && (
            <View style={styles.recurChip}>
              <Ionicons name="repeat" size={14} color={colors.accent} />
              <Text style={styles.recurText}>{item.recurring}</Text>
            </View>
          )}

          {/* Key facts */}
          <View style={styles.facts}>
            <Fact icon="calendar-outline" label="When" value={formatDateTime(item.start)} sub={formatTimeRange(item)} />
            <Fact
              icon="location-outline"
              label="Where"
              value={item.venueName}
              sub={`${item.address} · ${formatDistance(distanceFor(item))} away`}
            />
            <Fact
              icon="pricetag-outline"
              label="Price"
              value={formatPrice(item)}
              valueColor={item.price === 0 ? colors.success : colors.text}
            />
            <Fact
              icon="people-outline"
              label="Who's going"
              value={`${item.attendees} going`}
              sub={[item.capacity ? `${item.capacity} spots` : null, item.ageRange ? `Ages ${item.ageRange}` : null]
                .filter(Boolean)
                .join(' · ') || undefined}
            />
          </View>

          <Section title="About">
            <Text style={styles.paragraph}>{item.description}</Text>
          </Section>

          <Section title="Organised by">
            <View style={styles.organizer}>
              <View style={[styles.orgAvatar, { backgroundColor: cat.color }]}>
                <Text style={styles.orgInitial}>{item.organizer.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.orgName}>{item.organizer}</Text>
                {item.contact && <Text style={styles.orgContact}>{item.contact}</Text>}
              </View>
            </View>
          </Section>

          <Section title="Location">
            <Pressable onPress={openDirections} style={styles.mapWrap}>
              <MapView
                style={styles.miniMap}
                provider={PROVIDER_DEFAULT}
                pointerEvents="none"
                initialRegion={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
              >
                <Marker coordinate={{ latitude: item.latitude, longitude: item.longitude }}>
                  <View style={[styles.pin, { borderColor: cat.color }]}>
                    <Ionicons name={cat.icon as any} size={15} color={cat.color} />
                  </View>
                </Marker>
              </MapView>
              <View style={styles.directionsBtn}>
                <Ionicons name="navigate" size={15} color={colors.white} />
                <Text style={styles.directionsText}>Directions</Text>
              </View>
            </Pressable>
          </Section>

          {item.tags.length > 0 && (
            <View style={styles.tags}>
              {item.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>#{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={() => toggleSaved(item.id)}
          style={[styles.saveBtn, saved && styles.saveBtnActive]}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={22}
            color={saved ? '#EF4444' : colors.text}
          />
        </Pressable>
        <Pressable style={styles.primaryBtn} onPress={openDirections}>
          <Text style={styles.primaryBtnText}>
            {item.price === 0 ? 'Get directions' : `Join · ${formatPrice(item)}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Fact({
  icon,
  label,
  value,
  sub,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.fact}>
      <View style={styles.factIcon}>
        <Ionicons name={icon as any} size={18} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.factLabel}>{label}</Text>
        <Text style={[styles.factValue, valueColor && { color: valueColor }]}>{value}</Text>
        {sub && <Text style={styles.factSub}>{sub}</Text>}
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', height: 300, backgroundColor: colors.surfaceAlt },
  heroShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  backBtn: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  catBadge: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  catBadgeText: { color: colors.white, fontWeight: font.weight.bold, fontSize: font.size.sm },
  body: { padding: spacing.xl, gap: spacing.lg },
  title: { fontSize: font.size.xxl, fontWeight: font.weight.bold, color: colors.text, lineHeight: 32 },
  recurChip: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: -spacing.sm,
  },
  recurText: { color: colors.accent, fontWeight: font.weight.semibold, fontSize: font.size.sm },
  facts: {
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  fact: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  factIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factLabel: { fontSize: font.size.xs, color: colors.textTertiary, fontWeight: font.weight.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  factValue: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.text, marginTop: 1 },
  factSub: { fontSize: font.size.sm, color: colors.textSecondary, marginTop: 1 },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.text },
  paragraph: { fontSize: font.size.md, color: colors.textSecondary, lineHeight: 23 },
  organizer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  orgAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  orgInitial: { color: colors.white, fontSize: font.size.lg, fontWeight: font.weight.bold },
  orgName: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.text },
  orgContact: { fontSize: font.size.sm, color: colors.textSecondary, marginTop: 1 },
  mapWrap: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  miniMap: { width: '100%', height: 160 },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  directionsBtn: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    ...shadow.floating,
  },
  directionsText: { color: colors.white, fontWeight: font.weight.bold, fontSize: font.size.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  tagText: { fontSize: font.size.sm, color: colors.textSecondary, fontWeight: font.weight.medium },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnActive: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  primaryBtn: {
    flex: 1,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: colors.white, fontSize: font.size.lg, fontWeight: font.weight.bold },
});
