// Sample bus data for the app
export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  color: string;
  stops: BusStop[];
  fullPath?: { latitude: number; longitude: number }[];
}

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
  isWaypoint?: boolean;
}

export interface Bus {
  id: string;
  routeId: string;
  routeNumber: string;
  currentLatitude: number;
  currentLongitude: number;
  heading: number;
  speed: number;
  nextStop: string;
  estimatedArrival: string;
  occupancy: 'low' | 'medium' | 'high';
  isActive: boolean;
}

export interface ScheduleEntry {
  id: string;
  routeNumber: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string;
  status: 'on-time' | 'delayed' | 'cancelled';
}

// Sample routes in Tamil Nadu (Tiruppur area)
export const SAMPLE_ROUTES: BusRoute[] = [
  {
    id: 'route-1',
    routeNumber: '20',
    routeName: 'New Bus Stand - Balakumaran Pushpa Theatre',
    startLocation: 'New Bus Stand',
    endLocation: 'Balakumaran Pushpa Theatre',
    color: '#4ECDC4',
    stops: [
      {
        id: 's1',
        name: 'New Bus Stand',
        latitude: 11.13211374217086,
        longitude: 77.34124259570535,
        arrivalTime: '07:00',
      },
      {
        id: 's2',
        name: 'Balakumaran Pushpa Theatre',
        latitude: 11.113396582111964,
        longitude: 77.33947428979899,
        arrivalTime: '07:10',
      },
      {
        id: 's3',
        name: 'Pilamedu',
        latitude: 11.106723361295671,
        longitude: 77.34157975759351,
        arrivalTime: '07:15',
      },
    ],
  },
];

// Sample active buses
export const SAMPLE_BUSES: Bus[] = [
  {
    id: 'bus-1',
    routeId: 'route-1',
    routeNumber: '20',
    currentLatitude: 11.13211374217086,
    currentLongitude: 77.34124259570535,
    heading: 200,
    speed: 35,
    nextStop: 'Pilamedu',
    estimatedArrival: '15 min',
    occupancy: 'medium',
    isActive: true,
  },
];

// Sample schedule
export const SAMPLE_SCHEDULE: ScheduleEntry[] = [
  {
    id: 'sch-1',
    routeNumber: '20',
    routeName: 'New Bus Stand - Balakumaran Pushpa Theatre',
    departureTime: '07:00',
    arrivalTime: '07:15',
    frequency: 'Every 10 min',
    status: 'on-time',
  },
  {
    id: 'sch-2',
    routeNumber: '20',
    routeName: 'New Bus Stand - Balakumaran Pushpa Theatre',
    departureTime: '07:15',
    arrivalTime: '07:30',
    frequency: 'Every 10 min',
    status: 'on-time',
  },
];

// Initial map region (Tiruppur)
export const TIRUPPUR_REGION = {
  latitude: 11.1085,
  longitude: 77.3411,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Keeping CHENNAI_REGION for backward compatibility if needed, but aliasing to TIRUPPUR for now to switch default
export const CHENNAI_REGION = TIRUPPUR_REGION;
