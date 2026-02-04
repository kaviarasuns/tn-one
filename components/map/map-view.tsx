// Native implementation using react-native-maps
import React, { forwardRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import RNMapView, {
    PROVIDER_GOOGLE,
    Region,
    Marker as RNMarker,
    Polyline as RNPolyline,
} from 'react-native-maps';

export type { Region };

export interface MapViewProps {
    children?: React.ReactNode;
    initialRegion?: Region;
    showsUserLocation?: boolean;
    style?: object;
    mapPadding?: { top: number; right: number; bottom: number; left: number };
}

export interface MapViewRef {
    animateToRegion: (region: Region) => void;
}

export const MapView = forwardRef<MapViewRef, MapViewProps>(
    ({ children, initialRegion, showsUserLocation, style, mapPadding }, ref) => {
        const mapRef = React.useRef<RNMapView>(null);

        React.useImperativeHandle(ref, () => ({
            animateToRegion: (region: Region) => {
                mapRef.current?.animateToRegion(region);
            },
        }));

        return (
            <RNMapView
                ref={mapRef}
                style={[styles.map, style]}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialRegion}
                showsUserLocation={showsUserLocation}
                showsMyLocationButton={false}
                showsCompass={false}
                mapPadding={mapPadding}
            >
                {children}
            </RNMapView>
        );
    }
);

MapView.displayName = 'MapView';

// Re-export native components
export const Marker = RNMarker;
export const Polyline = RNPolyline;

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});
