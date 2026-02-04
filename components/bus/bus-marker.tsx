import { Bus } from '@/constants/bus-data';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BusMarkerProps {
    bus: Bus;
    color: string;
}

export function BusMarker({ bus, color }: BusMarkerProps) {
    const getOccupancyColor = (occupancy: Bus['occupancy']) => {
        switch (occupancy) {
            case 'low':
                return '#4ADE80';
            case 'medium':
                return '#FBBF24';
            case 'high':
                return '#EF4444';
            default:
                return '#9CA3AF';
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.markerBody, { backgroundColor: color }]}>
                <Text style={styles.routeNumber}>{bus.routeNumber}</Text>
                <View style={[styles.occupancyDot, { backgroundColor: getOccupancyColor(bus.occupancy) }]} />
            </View>
            <View style={[styles.markerArrow, { borderTopColor: color }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    markerBody: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    routeNumber: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    occupancyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    markerArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        marginTop: -1,
    },
});
