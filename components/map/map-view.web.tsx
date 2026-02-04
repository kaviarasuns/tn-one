// Web implementation - fallback UI for react-native-maps
// For production, consider integrating react-leaflet or Google Maps JS API
import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

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
    ({ children, initialRegion, style }, ref) => {
        React.useImperativeHandle(ref, () => ({
            animateToRegion: (_region: Region) => {
                // No-op on web fallback
                console.log('MapView.animateToRegion called on web');
            },
        }));

        return (
            <View style={[styles.container, style]}>
                <View style={styles.mapPlaceholder}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.mapIcon}>🗺️</Text>
                    </View>
                    <Text style={styles.title}>Map View</Text>
                    <Text style={styles.subtitle}>
                        Live bus tracking is available on iOS and Android devices
                    </Text>
                    {initialRegion && (
                        <View style={styles.coordinatesBox}>
                            <Text style={styles.coordinatesLabel}>Region Center</Text>
                            <Text style={styles.coordinates}>
                                {initialRegion.latitude.toFixed(4)}°, {initialRegion.longitude.toFixed(4)}°
                            </Text>
                        </View>
                    )}
                    <View style={styles.downloadCta}>
                        <Text style={styles.downloadText}>
                            Download our mobile app for the full experience
                        </Text>
                    </View>
                </View>
                {/* Children are rendered but hidden - prevents crashes from nested components */}
                <View style={styles.hiddenChildren}>{children}</View>
            </View>
        );
    }
);

MapView.displayName = 'MapView';

// Stub components for web compatibility
export const Marker = ({ children }: { children?: React.ReactNode;[key: string]: unknown }) => {
    return <View style={styles.hiddenChildren}>{children}</View>;
};

export const Polyline = (_props: { [key: string]: unknown }) => {
    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    mapPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    } as unknown as object,
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    mapIcon: {
        fontSize: 56,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 24,
        marginBottom: 32,
    },
    coordinatesBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    coordinatesLabel: {
        fontSize: 12,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    coordinates: {
        fontSize: 18,
        color: '#E5E7EB',
        fontWeight: '500',
    },
    downloadCta: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 12,
    },
    downloadText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    hiddenChildren: {
        display: 'none',
    },
});
