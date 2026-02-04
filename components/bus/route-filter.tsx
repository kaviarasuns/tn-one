import { BusRoute } from '@/constants/bus-data';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RouteFilterProps {
    routes: BusRoute[];
    selectedRoutes: string[];
    onToggleRoute: (routeId: string) => void;
}

export function RouteFilter({ routes, selectedRoutes, onToggleRoute }: RouteFilterProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        selectedRoutes.length === 0 && styles.filterChipActive,
                    ]}
                    onPress={() => {
                        // Reset to show all
                        routes.forEach((route) => {
                            if (!selectedRoutes.includes(route.id)) {
                                onToggleRoute(route.id);
                            }
                        });
                    }}
                >
                    <Text
                        style={[
                            styles.filterText,
                            selectedRoutes.length === 0 && styles.filterTextActive,
                        ]}
                    >
                        All Routes
                    </Text>
                </TouchableOpacity>

                {routes.map((route) => {
                    const isSelected = selectedRoutes.includes(route.id);
                    return (
                        <TouchableOpacity
                            key={route.id}
                            style={[
                                styles.filterChip,
                                isSelected && { backgroundColor: route.color },
                            ]}
                            onPress={() => onToggleRoute(route.id)}
                        >
                            <View
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: route.color },
                                    isSelected && styles.colorDotActive,
                                ]}
                            />
                            <Text
                                style={[
                                    styles.filterText,
                                    isSelected && styles.filterTextActive,
                                ]}
                            >
                                {route.routeNumber}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: '#1F2937',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    colorDotActive: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
});
