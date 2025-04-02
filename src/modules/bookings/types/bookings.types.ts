export interface IBookings {
  id?: string;
  user_id: string;
  shop_id: string;
  booked_slot_id: string;
  date: Date;
  guests: number;
  location_type: "INSIDE" | "OUTSIDE";
  floor: "GROUND LEVEL" | "UPPER LEVEL";
  roof_type: "COVERED" | "UNCOVERED";
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  booking_code: string;
};