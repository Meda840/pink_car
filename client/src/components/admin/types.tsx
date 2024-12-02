// types.tsx

export interface User {
    id: number;
    identity: string;
    username: string;
    password: string;
    email: string;
    phone_number: string;
    role: boolean;
    passengerProfile?: PassengerProfile;
    driverProfile?: DriverProfile;
  }
  
  export interface PassengerProfile {
    id: number;
    userId: number;
    photo?: string;
    biography?: string;
    favorite_drivers: DriverProfile[];
    favorite_of_drivers: DriverProfile[];
    trips: Trip[];
    users: User;
  }
  
  export interface DriverProfile {
    id: number;
    userId: number;
    drivingLicence: string;
    photo?: string;
    biography?: string;
    location: string;
    favorite_cars: Car[];
    favorite_passengers: PassengerProfile[];
    favorite_of_passengers: PassengerProfile[];
    trips: Trip[];
    users: User;
  }
  
  export interface Car {
    id: number;
    mark: string;
    model: string;
    capacity: number;
    isAutomatic: boolean;
    year: number;
    city: string;
    price: number;
    isAvailable: boolean;
    drivers: DriverProfile[];
  }
  
  export interface Trip {
    id: number;
    start: string;
    destination: string;
    price?: number;
    numberPassengers?: number;
    description?: string;
    driverId: number;
    driver: DriverProfile;
    passengerId: number;
    passenger: PassengerProfile;
  }
  