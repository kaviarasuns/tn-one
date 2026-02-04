
import React, { useEffect, useState } from 'react';
import { Polyline } from './map-view';

// Define the coordinate interface locally to avoid circular deps or complex imports
// assuming simple consumption
interface Coordinate {
    latitude: number;
    longitude: number;
}

// We treat props as 'any' for the underlying Polyline to act as a pass-through,
// but explicitly define coordinates for our usage.
interface DirectionsPolylineProps {
    coordinates: Coordinate[];
    strokeColor?: string;
    strokeWidth?: number;
    lineDashPattern?: number[];
    // Include other Polyline props as needed
    [key: string]: any;
}

export function DirectionsPolyline({ coordinates, ...props }: DirectionsPolylineProps) {
    // Initialize with straight lines
    const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>(coordinates);

    useEffect(() => {
        // Only fetch on native platforms to save resources/bandwidth on web (where map might be stubbed)
        // although generic fetch works on web too.
        // If the map is stubbed on web, fetching coords is useless but harmless.

        let isMounted = true;

        const fetchRoute = async () => {
            // Need at least 2 points to form a path
            if (coordinates.length < 2) {
                if (isMounted) setRouteCoordinates(coordinates);
                return;
            }

            try {
                // Construct the OSRM URL
                // OSRM expects: lon,lat;lon,lat
                // We take the start, key intermediate stops, and end.
                // If there are too many stops, formatting the URL is fine for OSRM (up to a limit).
                const waypoints = coordinates
                    .map((c) => `${c.longitude},${c.latitude}`)
                    .join(';');

                // Use OSRM public demo server
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`
                );

                const data = await response.json();

                if (data.code === 'Ok' && data.routes && data.routes[0]) {
                    const geometry = data.routes[0].geometry;
                    if (geometry.type === 'LineString') {
                        const newCoords = geometry.coordinates.map((coord: number[]) => ({
                            latitude: coord[1],
                            longitude: coord[0],
                        }));
                        if (isMounted) setRouteCoordinates(newCoords);
                    }
                } else {
                    // If OSRM fails or returns no route, stick to straight lines
                    if (isMounted) setRouteCoordinates(coordinates);
                }
            } catch (error) {
                // console.warn('Failed to fetch directions, using straight lines:', error);
                if (isMounted) setRouteCoordinates(coordinates);
            }
        };

        fetchRoute();

        return () => {
            isMounted = false;
        };
    }, [coordinates]);

    return <Polyline coordinates={routeCoordinates} {...props} />;
}
