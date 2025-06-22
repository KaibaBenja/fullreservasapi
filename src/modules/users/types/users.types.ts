export interface IUser {
  id?: string;
  full_name: string;
  password: string;
  email: string;
  passwordChanged?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}