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
  routeId?: string;
  routeNumber: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string;
  status: 'on-time' | 'delayed' | 'cancelled';
  startStopId?: string;
  endStopId?: string;
}

// Sample routes in Tamil Nadu (Tiruppur area)
export const SAMPLE_ROUTES: BusRoute[] = [
  {
    id: 'route-1',
    routeNumber: '20',
    routeName: 'New Bus Stand - Palladam Bus Stand',
    startLocation: 'New Bus Stand',
    endLocation: 'Palladam Bus Stand',
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
      {
        id: 's4',
        name: 'Tiruppur Old Bus Stand',
        latitude: 11.098076575583528,
        longitude: 77.34919748242261,
        arrivalTime: '07:20',
      },
      {
        id: 's5',
        name: 'Collector Office',
        latitude: 11.0814402,
        longitude: 77.3435257,
        arrivalTime: '07:28',
      },
      {
        id: 's6',
        name: 'Veerapandi Pirivu',
        latitude: 11.0651313,
        longitude: 77.3393156,
        arrivalTime: '07:33',
      },
      {
        id: 's7',
        name: 'Chinkarai',
        latitude: 11.0539328,
        longitude: 77.3267716,
        arrivalTime: '07:38',
      },
      {
        id: 's8',
        name: 'Arul Puram',
        latitude: 11.0404862,
        longitude: 77.3164237,
        arrivalTime: '07:43',
      },
      {
        id: 's9',
        name: 'Mahalakshmi Nagar Bus Stop',
        latitude: 11.0120706,
        longitude: 77.2975248,
        arrivalTime: '07:53',
      },
      {
        id: 's10',
        name: 'Palladam Bus Stand',
        latitude: 10.9944167,
        longitude: 77.283062,
        arrivalTime: '08:00',
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
    nextStop: 'Palladam Bus Stand',
    estimatedArrival: '60 min',
    occupancy: 'medium',
    isActive: true,
  },
];

// Sample schedule
export const SAMPLE_SCHEDULE: ScheduleEntry[] = [
  {
    id: 'sch-1',
    routeId: 'route-1',
    routeNumber: '20',
    routeName: 'New Bus Stand - Palladam Bus Stand',
    departureTime: '8:00 AM',
    arrivalTime: '9:00 AM',
    frequency: 'Scheduled',
    status: 'on-time',
    startStopId: 's1',
    endStopId: 's10',
  },
  {
    id: 'sch-2',
    routeId: 'route-1',
    routeNumber: '20',
    routeName: 'Palladam Bus Stand - New Bus Stand',
    departureTime: '9:30 AM',
    arrivalTime: '10:30 AM',
    frequency: 'Scheduled',
    status: 'on-time',
    startStopId: 's10',
    endStopId: 's1',
  },
  {
    id: 'sch-3',
    routeId: 'route-1',
    routeNumber: '20',
    routeName: 'New Bus Stand - Palladam Bus Stand',
    departureTime: '11:00 AM',
    arrivalTime: '12:00 PM',
    frequency: 'Scheduled',
    status: 'on-time',
    startStopId: 's1',
    endStopId: 's10',
  },
  {
    id: 'sch-4',
    routeId: 'route-1',
    routeNumber: '20',
    routeName: 'Palladam Bus Stand - New Bus Stand',
    departureTime: '12:30 PM',
    arrivalTime: '1:30 PM',
    frequency: 'Scheduled',
    status: 'on-time',
    startStopId: 's10',
    endStopId: 's1',
  },
  {
    id: 'sch-5',
    routeId: 'route-1',
    routeNumber: '20',
    routeName: 'New Bus Stand - Palladam Bus Stand',
    departureTime: '3:00 PM',
    arrivalTime: '4:00 PM',
    frequency: 'Scheduled',
    status: 'on-time',
    startStopId: 's1',
    endStopId: 's10',
  },
  {
    id: 'sch-6',
    routeId: 'route-1',
    routeNumber: '20',
    routeName: 'Palladam Bus Stand - New Bus Stand',
    departureTime: '6:00 PM',
    arrivalTime: '7:00 PM',
    frequency: 'Scheduled',
    status: 'on-time',
    startStopId: 's10',
    endStopId: 's1',
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
