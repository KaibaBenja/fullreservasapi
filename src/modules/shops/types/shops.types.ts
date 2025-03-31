export interface IShops {
  id?: string;
  user_id: string;
  subcategory_id: string;
  name: string;
  phone_number: string;
  shift_type: "SINGLESHIFT" | "DOUBLESHIFT" | "CONTINUOUS";
  average_stay_time: number;
  capacity: number;
  legal_info: string;
  bank_info: string;
  description?: string;
  price_range: 1 | 2 | 3 | 4;
  createdAt?: Date;
  updatedAt?: Date;
}