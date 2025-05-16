export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profileImage?: string;
  rating: number;
  rideCount: number;
  isDriver: boolean;
  preferredLanguage: 'en' | 'fr' | 'sw';
}

export interface Bus {
  id: string;
  name: string;
  licensePlate: string;
  capacity: number;
  currentOccupancy: number;
  driverId: string;
  operatorId: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  imageUrl?: string;
}

export interface Route {
  id: string;
  name: string;
  startLocation: Location;
  endLocation: Location;
  stops: Location[];
  distance: number;
  estimatedDuration: number;
  fare: {
    base: number;
    perKm: number;
    current: number;
  };
  schedule: {
    frequency: number;
    firstDeparture: string;
    lastDeparture: string;
  };
  popularity: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isPopular: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  routeId: string;
  busId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupTime: string;
  fare: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'mobile_money' | 'cash' | 'card';
  passengerCount: number;
  createdAt: string;
  isGroupBooking: boolean;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: number;
  rating: number;
  totalTrips: number;
  status: 'available' | 'on_trip' | 'offline';
  earnings: {
    today: number;
    week: number;
    month: number;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Operator {
  id: string;
  name: string;
  fleetSize: number;
  rating: number;
  commission: number;
  contactPerson: string;
  contactPhone: string;
  address: string;
}

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'card' | 'cash';
  provider?: string;
  accountNumber?: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  action?: {
    type: string;
    data: any;
  };
}