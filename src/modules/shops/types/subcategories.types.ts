export interface ISubcategories {
  id: string;
  name: string;
  main_category: "COMMERCE" | "SERVICE";
  logo_url: string;
  createdAt?: Date;
  updatedAt?: Date;
}