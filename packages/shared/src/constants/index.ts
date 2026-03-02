export const API_BASE_URL = 'http://localhost:3000';

export const SOCKET_EVENTS = {
  TRIP_REQUEST: 'trip:request',
  TRIP_ACCEPTED: 'trip:accepted',
  TRIP_CANCELLED: 'trip:cancelled',
  DRIVER_LOCATION: 'driver:location',
  TRIP_COMPLETED: 'trip:completed',
} as const;

export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 7.1907, // Davao City
  DEFAULT_LONGITUDE: 125.4553,
  DEFAULT_DELTA: 0.01,
} as const;
