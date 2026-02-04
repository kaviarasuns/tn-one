import { ScheduleCard } from '@/components/bus/schedule-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SAMPLE_SCHEDULE, ScheduleEntry } from '@/constants/bus-data';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterTab = 'all' | 'upcoming' | 'delayed';

export default function TimetableScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<FilterTab>('all');

    const filterSchedule = (): ScheduleEntry[] => {
        let filtered = SAMPLE_SCHEDULE;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (entry) =>
                    entry.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entry.routeName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Tab filter
        switch (activeTab) {
            case 'upcoming':
                filtered = filtered.filter((entry) => entry.status === 'on-time');
                break;
            case 'delayed':
                filtered = filtered.filter(
                    (entry) => entry.status === 'delayed' || entry.status === 'cancelled'
                );
                break;
        }

        return filtered;
    };

    const filteredSchedule = filterSchedule();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Timetable</Text>
                    <TouchableOpacity style={styles.refreshButton}>
                        <IconSymbol name="arrow.clockwise" size={22} color="#6366F1" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subtitle}>View bus schedules and plan your journey</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search routes..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <IconSymbol name="xmark.circle.fill" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    {(['all', 'upcoming', 'delayed'] as FilterTab[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab === 'all' ? 'All' : tab === 'upcoming' ? 'Upcoming' : 'Delayed'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Schedule List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Today's Date Header */}
                <View style={styles.dateHeader}>
                    <View style={styles.dateInfo}>
                        <IconSymbol name="calendar" size={18} color="#6366F1" />
                        <Text style={styles.dateText}>Today, February 2</Text>
                    </View>
                    <Text style={styles.scheduleCount}>
                        {filteredSchedule.length} schedules
                    </Text>
                </View>

                {/* Schedule Cards */}
                {filteredSchedule.length > 0 ? (
                    filteredSchedule.map((schedule) => (
                        <ScheduleCard
                            key={schedule.id}
                            schedule={schedule}
                            onPress={() => {
                                // Navigate to route details
                            }}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <IconSymbol name="bus.fill" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>No schedules found</Text>
                        <Text style={styles.emptyText}>
                            Try adjusting your search or filter settings
                        </Text>
                    </View>
                )}

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={styles.actionCard}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                                <IconSymbol name="bell.fill" size={24} color="#6366F1" />
                            </View>
                            <Text style={styles.actionTitle}>Set Alert</Text>
                            <Text style={styles.actionSubtitle}>Get notified</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                                <IconSymbol name="star.fill" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.actionTitle}>Favorites</Text>
                            <Text style={styles.actionSubtitle}>Saved routes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                                <IconSymbol name="clock.fill" size={24} color="#F59E0B" />
                            </View>
                            <Text style={styles.actionTitle}>History</Text>
                            <Text style={styles.actionSubtitle}>Past trips</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom padding for tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.5,
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 4,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 16,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#6366F1',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 20,
    },
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    scheduleCount: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 8,
    },
    quickActions: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    quickActionsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
});
