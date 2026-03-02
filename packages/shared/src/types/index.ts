export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'passenger' | 'driver';
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  pickup: Location;
  dropoff: Location;
  status: 'searching' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}
