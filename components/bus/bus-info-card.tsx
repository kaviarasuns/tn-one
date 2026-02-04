import { IconSymbol } from '@/components/ui/icon-symbol';
import { Bus, SAMPLE_ROUTES } from '@/constants/bus-data';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BusInfoCardProps {
    bus: Bus;
    onClose: () => void;
    onTrack: () => void;
}

export function BusInfoCard({ bus, onClose, onTrack }: BusInfoCardProps) {
    const route = SAMPLE_ROUTES.find((r) => r.id === bus.routeId);

    const getOccupancyLabel = (occupancy: Bus['occupancy']) => {
        switch (occupancy) {
            case 'low':
                return { label: 'Low Crowd', color: '#4ADE80', bgColor: 'rgba(74, 222, 128, 0.15)' };
            case 'medium':
                return { label: 'Moderate', color: '#FBBF24', bgColor: 'rgba(251, 191, 36, 0.15)' };
            case 'high':
                return { label: 'Crowded', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
        }
    };

    const occupancy = getOccupancyLabel(bus.occupancy);

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.routeInfo}>
                            <View style={[styles.routeBadge, { backgroundColor: route?.color || '#6366F1' }]}>
                                <Text style={styles.routeNumber}>{bus.routeNumber}</Text>
                            </View>
                            <View style={styles.routeDetails}>
                                <Text style={styles.routeName}>{route?.routeName || 'Unknown Route'}</Text>
                                <Text style={styles.routePath}>
                                    {route?.startLocation} → {route?.endLocation}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <IconSymbol name="xmark.circle.fill" size={28} color="rgba(255,255,255,0.6)" />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <IconSymbol name="mappin.circle.fill" size={20} color="#6366F1" />
                            <Text style={styles.statLabel}>Next Stop</Text>
                            <Text style={styles.statValue}>{bus.nextStop}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <IconSymbol name="clock.fill" size={20} color="#10B981" />
                            <Text style={styles.statLabel}>ETA</Text>
                            <Text style={styles.statValue}>{bus.estimatedArrival}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <IconSymbol name="speedometer" size={20} color="#F59E0B" />
                            <Text style={styles.statLabel}>Speed</Text>
                            <Text style={styles.statValue}>{bus.speed} km/h</Text>
                        </View>
                    </View>

                    {/* Occupancy */}
                    <View style={[styles.occupancyBadge, { backgroundColor: occupancy.bgColor }]}>
                        <View style={[styles.occupancyDot, { backgroundColor: occupancy.color }]} />
                        <Text style={[styles.occupancyText, { color: occupancy.color }]}>{occupancy.label}</Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.trackButton} onPress={onTrack}>
                            <IconSymbol name="location.fill" size={18} color="#FFFFFF" />
                            <Text style={styles.trackButtonText}>Track This Bus</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        left: 16,
        right: 16,
        borderRadius: 24,
        overflow: 'hidden',
    },
    cardContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 30, 46, 0.95)',
    },
    content: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    routeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    routeBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 12,
    },
    routeNumber: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    routeDetails: {
        flex: 1,
    },
    routeName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    routePath: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        marginTop: 2,
    },
    closeButton: {
        padding: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        marginHorizontal: 4,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    occupancyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    occupancyDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    occupancyText: {
        fontSize: 14,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
    },
    trackButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6366F1',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    trackButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
