export interface IMemberships {
  id?: string;
  user_id: string;
  tier: 'FREE' | 'BASIC' | 'ADVANCED' | 'PREMIUM';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED' | 'DELAYED';
  expire_date?: string | undefined | null;
}