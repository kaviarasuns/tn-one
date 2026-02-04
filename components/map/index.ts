// Platform-specific exports
// Metro bundler automatically resolves:
// - map-view.native.tsx for iOS/Android
// - map-view.web.tsx for web
// The map-view.tsx file serves as the TypeScript type source

export { DirectionsPolyline } from './directions-polyline';
export { MapView, Marker, Polyline } from './map-view';
export type { MapViewProps, MapViewRef } from './map-view';

