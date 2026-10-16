# TN One

A cross-platform bus tracking app prototype for Tamil Nadu, built with Expo and React Native. It shows a live map with simulated bus positions, routes drawn along real roads, and a searchable timetable.

## What it does

TN One shows town-bus routes on a map (sample data currently covers Tiruppur: New Bus Stand ↔ Palladam Bus Stand). It animates buses along their routes according to the trip schedule and lets riders browse timetables. Bus positions are **simulated on the device** from schedule data; the app is not connected to a real-time feed yet.

## Key features

- **Live Map tab:**
  - Google Maps on Android (via `react-native-maps`) showing route polylines, stop markers and bus markers.
  - **Road-following route lines:** stop coordinates are snapped to real roads with the public OSRM routing API, falling back to straight lines if the request fails.
  - **Schedule-driven bus simulation:** each bus's position is interpolated along its route based on the current time and its trip windows, in both directions.
  - Route filter chips, a bus info card (next stop, ETA, speed, occupancy) and a "locate me" button that uses device location (`expo-location`, with permission prompts).
- **Timetable tab** with search by route number or name, All / Upcoming / Delayed tabs and schedule cards showing on-time, delayed or cancelled status.
- **Settings tab** with preference toggles (notifications, live tracking, theme, sound). <!-- TODO: toggles are local UI state only and are not persisted -->
- File-based navigation with Expo Router (bottom tabs), haptic tab feedback, light and dark color schemes.
- **Web fallback:** a stub map component is used on web, where `react-native-maps` isn't supported.

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | Expo SDK 54, React Native 0.81 (New Architecture), React 19, TypeScript |
| Navigation | Expo Router (typed routes), React Navigation bottom tabs |
| Maps & location | `react-native-maps` (Google Maps provider on Android), `expo-location`, OSRM routing API |
| Animation | `react-native-reanimated` |
| Builds | EAS Build (development / preview / production profiles) |

## Project structure

```
app/
  (tabs)/            # index (Live Map), timetable, settings, explore
  _layout.tsx
components/
  bus/               # bus marker, bus info card, route filter, schedule card
  map/               # native map view, web fallback, OSRM directions polyline
constants/
  bus-data.ts        # sample routes, stops, buses and schedule (Tiruppur)
  theme.ts
hooks/               # color scheme / theme hooks
```

## Getting started

**Prerequisites:** Node.js 20+ and pnpm. For native builds you also need Android Studio and/or Xcode, or a device with a development build.

```bash
pnpm install
pnpm start          # Expo dev server
pnpm android        # build & run on Android (expo run:android)
pnpm ios            # build & run on iOS (expo run:ios)
pnpm web            # run in the browser (map is a fallback stub)
```

**Google Maps API key (Android):** the native map needs a Google Maps SDK for Android key, configured under `expo.android.config.googleMaps.apiKey` in `app.json`.
<!-- TODO: move the key out of app.json into an env var (e.g. GOOGLE_MAPS_API_KEY read from app.config.ts) and restrict it in Google Cloud Console. -->

Builds with EAS:

```bash
eas build --profile development   # or preview / production
```

## Roadmap

<!-- TODO: confirm the roadmap. Gaps visible in the code: real-time bus data source, persisted settings, iOS map provider config, an interactive web map, and the timetable "Set Alert / Favorites / History" actions (currently UI only). -->

## Author

Built by [Kaviarasu S](https://github.com/kaviarasuns), Full Stack Developer.
