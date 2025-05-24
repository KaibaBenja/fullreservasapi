export interface IMemberships {
  id?: string;
  user_id: string;
  tier: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED' | 'DELAYED';
  expire_date?: string | undefined | null;
}