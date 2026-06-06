// Web fallback for react-native-maps (which has no web build).
// Renders a tasteful placeholder so the web preview builds and looks clean.
// The real interactive map shows on iOS/Android.
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing, radius } from '@/theme';

export const PROVIDER_DEFAULT = undefined;

// Markers are positioned geographically on native; on the web placeholder we
// simply render nothing for them.
export function Marker(_props: any) {
  return null;
}

interface MapViewProps {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  [key: string]: any;
}

export interface MapHandle {
  animateToRegion: () => void;
}

export const MapView = React.forwardRef<MapHandle, MapViewProps>(
  ({ style, children }, ref) => {
    React.useImperativeHandle(ref, () => ({
      // No-op on web; keeps the native call sites happy.
      animateToRegion: () => {},
    }));

    return (
      <View style={[styles.fallback, style as ViewStyle]}>
        <View style={styles.grid} pointerEvents="none">
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`h${i}`} style={[styles.line, { top: `${(i + 1) * 14}%` }]} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`v${i}`} style={[styles.lineV, { left: `${(i + 1) * 14}%` }]} />
          ))}
        </View>
        <View style={styles.badge}>
          <Ionicons name="map" size={18} color={colors.accent} />
          <Text style={styles.badgeText}>Interactive map on iOS & Android</Text>
        </View>
        {children}
      </View>
    );
  },
);

MapView.displayName = 'MapViewWeb';

export default MapView;

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#E9EDF3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  grid: { ...StyleSheet.absoluteFillObject },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(79,70,229,0.07)',
  },
  lineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(79,70,229,0.07)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.textSecondary,
  },
});
