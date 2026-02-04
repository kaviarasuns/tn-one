import { BusInfoCard } from '@/components/bus/bus-info-card';
import { BusMarker } from '@/components/bus/bus-marker';
import { RouteFilter } from '@/components/bus/route-filter';
import { DirectionsPolyline, MapView, MapViewRef, Marker, Polyline } from '@/components/map';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  Bus,
  SAMPLE_BUSES,
  SAMPLE_ROUTES,
  SAMPLE_SCHEDULE,
  ScheduleEntry,
  TIRUPPUR_REGION
} from '@/constants/bus-data';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Coordinate = { latitude: number; longitude: number };

type RoutePath = {
  points: Coordinate[];
  segmentLengths: number[];
  totalLength: number;
};

type TripWindow = {
  id: string;
  startSeconds: number;
  endSeconds: number;
  direction: 'forward' | 'reverse';
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

const interpolate = (a: Coordinate, b: Coordinate, t: number): Coordinate => ({
  latitude: a.latitude + (b.latitude - a.latitude) * t,
  longitude: a.longitude + (b.longitude - a.longitude) * t,
});

const bearingDegrees = (a: Coordinate, b: Coordinate) => {
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);
  return ((bearing * 180) / Math.PI + 360) % 360;
};

const buildPath = (points: Coordinate[]): RoutePath => {
  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    const segmentLength = haversineDistance(points[i], points[i + 1]);
    segmentLengths.push(segmentLength);
    totalLength += segmentLength;
  }

  return { points, segmentLengths, totalLength };
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

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapViewRef>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [buses, setBuses] = useState<Bus[]>(SAMPLE_BUSES);
  const [isTracking, setIsTracking] = useState(false);

  const routePaths = useMemo(() => {
    const paths = new Map<string, RoutePath>();
    SAMPLE_ROUTES.forEach((route) => {
      const points =
        route.fullPath && route.fullPath.length > 1
          ? route.fullPath
          : route.stops.map((stop) => ({
              latitude: stop.latitude,
              longitude: stop.longitude,
            }));

      if (points.length < 2) return;

      paths.set(route.id, buildPath(points));
    });

    return paths;
  }, []);

  const reverseRoutePaths = useMemo(() => {
    const paths = new Map<string, RoutePath>();
    routePaths.forEach((path, routeId) => {
      const reversedPoints = [...path.points].reverse();
      paths.set(routeId, buildPath(reversedPoints));
    });
    return paths;
  }, [routePaths]);

  const routeTripWindows = useMemo(() => {
    const windows = new Map<string, TripWindow[]>();
    SAMPLE_SCHEDULE.forEach((entry) => {
      if (!entry.routeId) return;
      const startSeconds = parseTimeToSeconds(entry.departureTime);
      const endSeconds = parseTimeToSeconds(entry.arrivalTime);
      if (startSeconds === null || endSeconds === null) return;
      if (endSeconds <= startSeconds) return;

      const direction = resolveTripDirection(entry);
      const list = windows.get(entry.routeId) ?? [];
      list.push({
        id: entry.id,
        startSeconds,
        endSeconds,
        direction,
      });
      windows.set(entry.routeId, list);
    });

    windows.forEach((list) =>
      list.sort((a, b) => a.startSeconds - b.startSeconds)
    );

    return windows;
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission to access location was denied',
          'We need your location to show where you are on the map.'
        );
        return;
      }
    })();
  }, []);

  // Simulate bus movement along the schedule windows
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const trips = routeTripWindows.get(bus.routeId);
          if (!trips || trips.length === 0) {
            return bus;
          }

          const secondNow = nowInSeconds();
          const activeTrip = trips.find(
            (trip) => secondNow >= trip.startSeconds && secondNow <= trip.endSeconds
          );

          let trip = activeTrip;
          if (!trip) {
            const lastTrip = [...trips].reverse().find((t) => secondNow > t.endSeconds);
            const nextTrip = trips.find((t) => secondNow < t.startSeconds);

            trip = lastTrip ?? nextTrip ?? trips[0];
          }

          const path =
            trip.direction === 'reverse'
              ? reverseRoutePaths.get(bus.routeId)
              : routePaths.get(bus.routeId);

          if (!path || path.totalLength === 0) {
            return bus;
          }

          let progress = 0;
          const isActive = Boolean(activeTrip);
          if (activeTrip) {
            const duration = activeTrip.endSeconds - activeTrip.startSeconds;
            progress =
              duration > 0 ? (secondNow - activeTrip.startSeconds) / duration : 0;
          } else if (secondNow < trip.startSeconds) {
            progress = 0;
          } else {
            progress = 1;
          }

          const distanceAlong = path.totalLength * Math.min(1, Math.max(0, progress));
          let remaining = distanceAlong;
          let segmentIndex = 0;

          while (
            segmentIndex < path.segmentLengths.length - 1 &&
            remaining > path.segmentLengths[segmentIndex]
          ) {
            remaining -= path.segmentLengths[segmentIndex];
            segmentIndex += 1;
          }

          const start = path.points[segmentIndex];
          const end = path.points[segmentIndex + 1] ?? start;
          const segmentLength = path.segmentLengths[segmentIndex] || 1;
          const t = Math.min(1, Math.max(0, remaining / segmentLength));
          const position = interpolate(start, end, t);
          const durationMinutes = (trip.endSeconds - trip.startSeconds) / 60 || 1;
          const averageSpeedKmh =
            (path.totalLength / 1000) / (durationMinutes / 60);

          return {
            ...bus,
            currentLatitude: position.latitude,
            currentLongitude: position.longitude,
            heading: bearingDegrees(start, end),
            speed: isActive && Number.isFinite(averageSpeedKmh)
              ? Math.max(5, averageSpeedKmh)
              : 0,
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [routePaths, reverseRoutePaths, routeTripWindows]);

  const handleToggleRoute = (routeId: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(routeId)
        ? prev.filter((id) => id !== routeId)
        : [...prev, routeId]
    );
  };

  const filteredBuses =
    selectedRoutes.length === 0
      ? buses
      : buses.filter((bus) => selectedRoutes.includes(bus.routeId));

  const handleBusSelect = (bus: Bus) => {
    setSelectedBus(bus);
    mapRef.current?.animateToRegion({
      latitude: bus.currentLatitude,
      longitude: bus.currentLongitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const handleTrackBus = () => {
    setIsTracking(true);
    // In a real app, this would start following the bus
  };

  const centerOnLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          return;
        }
      }

      const location = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      // Fallback to default region if fails
      mapRef.current?.animateToRegion(TIRUPPUR_REGION);
    }
  };

  const getRouteColor = (routeId: string): string => {
    return SAMPLE_ROUTES.find((r) => r.id === routeId)?.color || '#6366F1';
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={TIRUPPUR_REGION}
        showsUserLocation
        mapPadding={{ top: 100, right: 0, bottom: 120, left: 0 }}
      >
        {/* Route lines */}
        {SAMPLE_ROUTES.map((route) => {
          if (selectedRoutes.length > 0 && !selectedRoutes.includes(route.id)) {
            return null;
          }
          return (
            /* 
               If provided, usage of 'fullPath' is preferred for exact road geometry.
               Otherwise, 'DirectionsPolyline' attempts to calculate it.
            */
            route.fullPath ? (
              <Polyline
                key={route.id}
                coordinates={route.fullPath}
                strokeColor={route.color}
                strokeWidth={4}
                lineDashPattern={[0]}
              />
            ) : (
              <DirectionsPolyline
                key={route.id}
                coordinates={route.stops.map((stop) => ({
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }))}
                strokeColor={route.color}
                strokeWidth={4}
                lineDashPattern={[0]}
              />
            )
          );
        })}

        {/* Bus stop markers */}
        {SAMPLE_ROUTES.map((route) => {
          if (selectedRoutes.length > 0 && !selectedRoutes.includes(route.id)) {
            return null;
          }
          return route.stops.map((stop) => {
            if (stop.isWaypoint) return null;
            return (
              <Marker
                key={`${route.id}-${stop.id}`}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                title={stop.name}
                description={`Arrival: ${stop.arrivalTime}`}
              >
                <View style={[styles.stopMarker, { borderColor: route.color }]}>
                  <View style={[styles.stopMarkerInner, { backgroundColor: route.color }]} />
                </View>
              </Marker>
            );
          });
        })}

        {/* Bus markers */}
        {filteredBuses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={{
              latitude: bus.currentLatitude,
              longitude: bus.currentLongitude,
            }}
            onPress={() => handleBusSelect(bus)}
            anchor={{ x: 0.5, y: 1 }}
          >
            <BusMarker bus={bus} color={getRouteColor(bus.routeId)} />
          </Marker>
        ))}
      </MapView>

      {/* Route Filter */}
      <RouteFilter
        routes={SAMPLE_ROUTES}
        selectedRoutes={selectedRoutes}
        onToggleRoute={handleToggleRoute}
      />

      {/* Header overlay */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>Search routes or stops...</Text>
        </View>
      </View>

      {/* Map controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapButton} onPress={centerOnLocation}>
          <IconSymbol name="location.fill" size={22} color="#6366F1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton}>
          <IconSymbol name="slider.horizontal.3" size={22} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Active buses count */}
      <View style={styles.activeBusesContainer}>
        <View style={styles.activeBusesBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.activeBusesText}>
            {filteredBuses.length} buses active
          </Text>
        </View>
      </View>

      {/* Bus Info Card */}
      {selectedBus && (
        <BusInfoCard
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
          onTrack={handleTrackBus}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 180,
    gap: 12,
  },
  mapButton: {
    backgroundColor: '#FFFFFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeBusesContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  activeBusesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activeBusesText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stopMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  stopMarkerInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
