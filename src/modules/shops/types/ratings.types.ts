export interface IRatings {
  id?: string;
  shop_id: string;
  user_id: string;
  booking_id: string;
  rating: number;
  status: "PENDING" | "COMPLETED";
  comment?: string;
}
