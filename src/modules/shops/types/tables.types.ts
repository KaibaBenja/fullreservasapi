export interface ITables {
  id: string;
  shop_id: string;
  location_type: "INSIDE" | "OUTSIDE";
  floor: "GROUND LEVEL" | "UPPER LEVEL";
  roof_type: "COVERED" | "UNCOVERED";
  capacity: number;
  quantity: number;
};