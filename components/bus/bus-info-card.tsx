import { IconSymbol } from '@/components/ui/icon-symbol';
import { Bus, SAMPLE_ROUTES, SAMPLE_SCHEDULE, ScheduleEntry } from '@/constants/bus-data';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BusInfoCardProps {
    bus: Bus;
    onClose: () => void;
    onTrack: () => void;
}

type Coordinate = { latitude: number; longitude: number };

type TripWindow = {
    id: string;
    startSeconds: number;
    endSeconds: number;
    direction: 'forward' | 'reverse';
    startStopId?: string;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversineDistance = (a: Coordinate, b: Coordinate) => {
    const earthRadius = 6371000;
    const dLat = toRadians(b.latitude - a.latitude);
    const dLon = toRadians(b.longitude - a.longitude);
    const lat1 = toRadians(a.latitude);
    const lat2 = toRadians(b.latitude);

    const sinLat = Math.sin(dLat / 2);
    const sinLon = Math.sin(dLon / 2);
    const h =
        sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;

    return 2 * earthRadius * Math.asin(Math.sqrt(h));
};

const parseTimeToSeconds = (time: string) => {
    const trimmed = time.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
    if (!match) {
        return null;
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return null;
    }

    let normalizedHour = hour % 12;
    if (period === 'PM') {
        normalizedHour += 12;
    }

    return normalizedHour * 3600 + minute * 60;
};

const nowInSeconds = () => {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

const resolveTripDirection = (entry: ScheduleEntry): TripWindow['direction'] => {
    if (entry.startStopId === 's10') {
        return 'reverse';
    }
    return 'forward';
};

const buildTripWindows = (routeId: string) => {
    const windows: TripWindow[] = [];
    SAMPLE_SCHEDULE.forEach((entry) => {
        if (entry.routeId !== routeId) return;
        const startSeconds = parseTimeToSeconds(entry.departureTime);
        const endSeconds = parseTimeToSeconds(entry.arrivalTime);
        if (startSeconds === null || endSeconds === null) return;
        if (endSeconds <= startSeconds) return;

        windows.push({
            id: entry.id,
            startSeconds,
            endSeconds,
            direction: resolveTripDirection(entry),
            startStopId: entry.startStopId,
        });
    });

    windows.sort((a, b) => a.startSeconds - b.startSeconds);
    return windows;
};

const projectDistanceAlongStops = (stops: Coordinate[], current: Coordinate) => {
    if (stops.length < 2) return 0;

    const cumulative: number[] = [0];
    for (let i = 0; i < stops.length - 1; i += 1) {
        cumulative.push(cumulative[i] + haversineDistance(stops[i], stops[i + 1]));
    }

    let bestDistance = 0;
    let bestError = Number.POSITIVE_INFINITY;

    for (let i = 0; i < stops.length - 1; i += 1) {
        const start = stops[i];
        const end = stops[i + 1];
        const dx = end.longitude - start.longitude;
        const dy = end.latitude - start.latitude;
        const lengthSquared = dx * dx + dy * dy;
        let t = 0;
        if (lengthSquared > 0) {
            t =
                ((current.longitude - start.longitude) * dx +
                    (current.latitude - start.latitude) * dy) /
                lengthSquared;
        }
        t = Math.min(1, Math.max(0, t));
        const projected = {
            latitude: start.latitude + dy * t,
            longitude: start.longitude + dx * t,
        };
        const error = haversineDistance(current, projected);
        if (error < bestError) {
            bestError = error;
            bestDistance =
                cumulative[i] + haversineDistance(start, projected);
        }
    }

    return bestDistance;
};

const formatEta = (minutes: number) => {
    if (!Number.isFinite(minutes)) return '—';
    if (minutes <= 1) return '<1 min';
    return `${Math.round(minutes)} min`;
};

export function BusInfoCard({ bus, onClose, onTrack }: BusInfoCardProps) {
    const route = SAMPLE_ROUTES.find((r) => r.id === bus.routeId);
    const stops = route?.stops.filter((stop) => !stop.isWaypoint) ?? [];
    const trips = route ? buildTripWindows(route.id) : [];
    const nowSeconds = nowInSeconds();
    const activeTrip = trips.find(
        (trip) => nowSeconds >= trip.startSeconds && nowSeconds <= trip.endSeconds
    );
    const upcomingTrip =
        trips.find((trip) => nowSeconds < trip.startSeconds) ?? trips[0];
    const direction = activeTrip?.direction ?? upcomingTrip?.direction ?? 'forward';
    const orderedStops = direction === 'reverse' ? [...stops].reverse() : stops;

    let nextStopName = bus.nextStop;
    let etaLabel = bus.estimatedArrival;

    if (orderedStops.length > 1) {
        const currentPosition = {
            latitude: bus.currentLatitude,
            longitude: bus.currentLongitude,
        };
        const distanceAlong = projectDistanceAlongStops(orderedStops, currentPosition);
        const cumulative: number[] = [0];
        for (let i = 0; i < orderedStops.length - 1; i += 1) {
            cumulative.push(
                cumulative[i] + haversineDistance(orderedStops[i], orderedStops[i + 1])
            );
        }

        let nextIndex = orderedStops.findIndex((_, index) => cumulative[index] > distanceAlong + 10);
        if (nextIndex === -1) {
            nextIndex = orderedStops.length - 1;
        }

        nextStopName = orderedStops[nextIndex]?.name ?? nextStopName;

        if (activeTrip) {
            const remainingDistance =
                Math.max(0, cumulative[nextIndex] - distanceAlong) / 1000;
            const speed = bus.speed > 0 ? bus.speed : 0;
            const etaMinutes = speed > 0 ? (remainingDistance / speed) * 60 : Infinity;
            etaLabel = formatEta(etaMinutes);
        } else if (upcomingTrip?.startStopId) {
            const startStop = stops.find((stop) => stop.id === upcomingTrip.startStopId);
            nextStopName = startStop?.name ?? nextStopName;
            etaLabel = `Starts at ${SAMPLE_SCHEDULE.find((t) => t.id === upcomingTrip.id)?.departureTime ?? '—'}`;
        } else {
            etaLabel = '—';
        }
    }

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
                            <Text style={styles.statValue}>{nextStopName}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <IconSymbol name="clock.fill" size={20} color="#10B981" />
                            <Text style={styles.statLabel}>ETA</Text>
                            <Text style={styles.statValue}>{etaLabel}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <IconSymbol name="speedometer" size={20} color="#F59E0B" />
                            <Text style={styles.statLabel}>Speed</Text>
                            <Text style={styles.statValue}>{Math.round(bus.speed)} km/h</Text>
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
