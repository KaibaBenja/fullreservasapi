export interface IResetToken {
  id: string;
  user_id: string;
  token: string;
  used: boolean;
  expires_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}