# Nearby

Find **happenings around where you live** — not big festivals, but the local stuff:
football cups, family activities, community meetups, volunteering, runs and more.

This is **V1** — a mobile app running on **mock data** (no backend yet).

---

## Highlights

- 🗺️ **Explore (map)** — happenings as category-coloured pins with a synced card carousel
- 🧭 **Browse** — category tiles + a filterable feed (date, free-only, sort by soonest/nearest)
- 🔍 **Search** — live keyword search across titles, venues, organisers and tags
- ❤️ **Saved** — keep happenings for later (with a tab badge)
- 📄 **Detail** — full info, mini-map, directions, organiser and key facts

Three categories for V1: **Sports & Cups**, **Family & Kids**, **Community & Social**.

## Tech

- [Expo](https://expo.dev) (SDK 52) + React Native + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) — file-based navigation
- [react-native-maps](https://github.com/react-native-maps/react-native-maps) — map + markers
- Clean, modern design system in [`src/theme.ts`](src/theme.ts) (single accent, generous spacing)

## Getting started

```bash
npm install
npm run start      # then press 'i' (iOS), 'a' (Android), or scan the QR with Expo Go
```

> **Maps & API keys:** On iOS (Expo Go / simulator) maps use Apple Maps with no key.
> For a standalone **Android** build you'll need a Google Maps API key in `app.json`
> under `android.config.googleMaps.apiKey`. Not required for iOS or Expo Go demos.

Useful scripts:

```bash
npm run typecheck  # tsc --noEmit
npm run ios        # open in iOS simulator
npm run android    # open in Android emulator
```

If you ever need to regenerate the placeholder app icon/splash:

```bash
node scripts/gen-assets.js
```

## Project structure

```
app/                         # Expo Router screens
  _layout.tsx                # Root stack + providers (saved state, safe area)
  (tabs)/
    _layout.tsx              # Bottom tab bar (Explore / Browse / Search / Saved)
    index.tsx                # Explore — map with pins + card carousel
    browse.tsx               # Category tiles + filterable feed
    search.tsx               # Live search with suggestions
    saved.tsx                # Saved happenings
  happening/[id].tsx         # Happening detail screen
src/
  components/                # Reusable UI (cards, chips, search bar, empty state…)
  context/SavedContext.tsx   # In-memory saved state (V1)
  data/
    happenings.ts            # ⬅️ MOCK DATA — swap for an API in V2
    categories.ts            # Category definitions
  utils/
    filter.ts                # Filtering + sorting logic
    format.ts                # Dates, distance (haversine), prices
  theme.ts                   # Design tokens
  types.ts                   # Shared types (Happening, Category…)
```

## Mock data

All sample happenings live in [`src/data/happenings.ts`](src/data/happenings.ts) with real
London coordinates so the map renders meaningfully. Each entry follows the `Happening`
type in [`src/types.ts`](src/types.ts). The "current location" used for distances is
`USER_LOCATION` at the top of that file.

## Roadmap to V2

- Replace `happenings.ts` with a real API / backend (the `Happening` type is the contract)
- Real device location via `expo-location` (currently a fixed `USER_LOCATION`)
- Persist saved happenings (`AsyncStorage`) and add user accounts
- Let organisers submit happenings; add date-range pickers and "near me" radius
- Push notifications for saved/upcoming happenings
```
