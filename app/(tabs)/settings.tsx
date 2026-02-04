import { IconSymbol } from '@/components/ui/icon-symbol';
import { SAMPLE_ROUTES } from '@/constants/bus-data';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItemProps {
    icon: string;
    iconColor: string;
    iconBg: string;
    title: string;
    subtitle?: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
}

function SettingItem({
    icon,
    iconColor,
    iconBg,
    title,
    subtitle,
    hasSwitch,
    switchValue,
    onSwitchChange,
    onPress,
}: SettingItemProps) {
    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            activeOpacity={hasSwitch ? 1 : 0.7}
        >
            <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
                <IconSymbol name={icon as any} size={22} color={iconColor} />
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {hasSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={switchValue ? '#6366F1' : '#F3F4F6'}
                />
            ) : (
                <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
            )}
        </TouchableOpacity>
    );
}

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState(true);
    const [liveTracking, setLiveTracking] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [soundEffects, setSoundEffects] = useState(true);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 16 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.subtitle}>Customize your bus tracking experience</Text>
                </View>

                {/* User Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>K</Text>
                        </View>
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Kavi</Text>
                        <Text style={styles.profileEmail}>Daily Commuter</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <IconSymbol name="pencil" size={18} color="#6366F1" />
                    </TouchableOpacity>
                </View>

                {/* Favorite Routes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Favorite Routes</Text>
                    <View style={styles.favoriteRoutes}>
                        {SAMPLE_ROUTES.slice(0, 3).map((route) => (
                            <TouchableOpacity key={route.id} style={styles.favoriteRoute}>
                                <View style={[styles.routeColor, { backgroundColor: route.color }]} />
                                <Text style={styles.routeNumber}>{route.routeNumber}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.addRouteButton}>
                            <IconSymbol name="plus" size={20} color="#6366F1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={styles.settingsCard}>
                        <SettingItem
                            icon="bell.fill"
                            iconColor="#6366F1"
                            iconBg="rgba(99, 102, 241, 0.12)"
                            title="Push Notifications"
                            subtitle="Receive alerts about your buses"
                            hasSwitch
                            switchValue={notifications}
                            onSwitchChange={setNotifications}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="location.fill"
                            iconColor="#10B981"
                            iconBg="rgba(16, 185, 129, 0.12)"
                            title="Live Tracking"
                            subtitle="Real-time bus location updates"
                            hasSwitch
                            switchValue={liveTracking}
                            onSwitchChange={setLiveTracking}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="speaker.wave.3.fill"
                            iconColor="#F59E0B"
                            iconBg="rgba(245, 158, 11, 0.12)"
                            title="Sound Effects"
                            subtitle="Audio feedback for alerts"
                            hasSwitch
                            switchValue={soundEffects}
                            onSwitchChange={setSoundEffects}
                        />
                    </View>
                </View>

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.settingsCard}>
                        <SettingItem
                            icon="moon.fill"
                            iconColor="#8B5CF6"
                            iconBg="rgba(139, 92, 246, 0.12)"
                            title="Dark Mode"
                            subtitle="Switch to dark theme"
                            hasSwitch
                            switchValue={darkMode}
                            onSwitchChange={setDarkMode}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="textformat.size"
                            iconColor="#EC4899"
                            iconBg="rgba(236, 72, 153, 0.12)"
                            title="Text Size"
                            subtitle="Medium"
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="map.fill"
                            iconColor="#0EA5E9"
                            iconBg="rgba(14, 165, 233, 0.12)"
                            title="Map Style"
                            subtitle="Standard"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.settingsCard}>
                        <SettingItem
                            icon="questionmark.circle.fill"
                            iconColor="#6366F1"
                            iconBg="rgba(99, 102, 241, 0.12)"
                            title="Help Center"
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="envelope.fill"
                            iconColor="#10B981"
                            iconBg="rgba(16, 185, 129, 0.12)"
                            title="Contact Us"
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="star.fill"
                            iconColor="#F59E0B"
                            iconBg="rgba(245, 158, 11, 0.12)"
                            title="Rate App"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Version Info */}
                <View style={styles.versionInfo}>
                    <Text style={styles.versionText}>TN One v1.0.0</Text>
                    <Text style={styles.versionSubtext}>Made with ❤️ in Tamil Nadu</Text>
                </View>

                {/* Bottom padding */}
                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 4,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 16,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    profileEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    editButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    favoriteRoutes: {
        flexDirection: 'row',
        gap: 12,
    },
    favoriteRoute: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    routeColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    routeNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    addRouteButton: {
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    settingsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingContent: {
        flex: 1,
        marginLeft: 14,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 74,
    },
    versionInfo: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    versionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    versionSubtext: {
        fontSize: 13,
        color: '#D1D5DB',
        marginTop: 4,
    },
});
