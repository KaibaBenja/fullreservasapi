export interface IResetToken {
  id: string;
  user_id: string;
  token: string;
  used: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}