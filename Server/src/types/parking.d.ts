export interface Parking {
  name: string;
  space_per_floor: number;
  floors: number;
  address: string;
  owner: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ParkingWithId extends Parking {
  id: number;
}

export interface Space {
  id?: number;
  space_number: number,
  floor: number,
  occupation_time: Date | null,
  space_owner: null | number,
  parking: number,
  createdAt?: Date;
  updatedAt?: Date;
}