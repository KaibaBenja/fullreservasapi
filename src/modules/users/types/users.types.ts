export interface IUser {
  id?: string;
  full_name: string;
  password: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}