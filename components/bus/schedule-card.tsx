import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScheduleEntry } from '@/constants/bus-data';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScheduleCardProps {
    schedule: ScheduleEntry;
    onPress: () => void;
}

export function ScheduleCard({ schedule, onPress }: ScheduleCardProps) {
    const getStatusConfig = (status: ScheduleEntry['status']) => {
        switch (status) {
            case 'on-time':
                return { label: 'On Time', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.12)', icon: 'checkmark.circle.fill' };
            case 'delayed':
                return { label: 'Delayed', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.12)', icon: 'clock.badge.exclamationmark.fill' };
            case 'cancelled':
                return { label: 'Cancelled', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.12)', icon: 'xmark.circle.fill' };
        }
    };

    const statusConfig = getStatusConfig(schedule.status);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.leftSection}>
                <View style={styles.routeBadge}>
                    <Text style={styles.routeNumber}>{schedule.routeNumber}</Text>
                </View>
                <View style={styles.timelineConnector} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.routeName}>{schedule.routeName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                        <IconSymbol name={statusConfig.icon as any} size={12} color={statusConfig.color} />
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                    </View>
                </View>

                <View style={styles.timeRow}>
                    <View style={styles.timeBlock}>
                        <IconSymbol name="arrow.up.circle.fill" size={16} color="#6366F1" />
                        <View>
                            <Text style={styles.timeLabel}>Departure</Text>
                            <Text style={styles.timeValue}>{schedule.departureTime}</Text>
                        </View>
                    </View>

                    <View style={styles.timeSeparator}>
                        <View style={styles.separatorLine} />
                        <IconSymbol name="arrow.right" size={14} color="#9CA3AF" />
                        <View style={styles.separatorLine} />
                    </View>

                    <View style={styles.timeBlock}>
                        <IconSymbol name="arrow.down.circle.fill" size={16} color="#10B981" />
                        <View>
                            <Text style={styles.timeLabel}>Arrival</Text>
                            <Text style={styles.timeValue}>{schedule.arrivalTime}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.frequencyBadge}>
                        <IconSymbol name="repeat.circle.fill" size={14} color="#6B7280" />
                        <Text style={styles.frequencyText}>{schedule.frequency}</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    leftSection: {
        alignItems: 'center',
        marginRight: 14,
    },
    routeBadge: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        minWidth: 44,
        alignItems: 'center',
    },
    routeNumber: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    timelineConnector: {
        width: 2,
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 1,
        marginTop: 8,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    routeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    timeValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    timeSeparator: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    frequencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    frequencyText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
});
