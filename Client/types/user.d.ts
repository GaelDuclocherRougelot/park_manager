export interface UserBase {
  id?: number;
  fullname: string;
  user_role: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWithHashedPassword extends UserBase {
  hashed_password: string;
}

export interface UserWithPassword extends UserBase {
  password: string;
}