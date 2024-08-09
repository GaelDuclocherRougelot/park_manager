export interface Parking {
  id?: number;
  name: string;
  max_spaces: number;
  max_floors: number;
  address: string;
  owner: number;
  createdAt?: Date;
  updatedAt?: Date;
}