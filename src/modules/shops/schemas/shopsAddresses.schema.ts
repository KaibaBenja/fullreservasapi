import { z } from "zod";

export const shopsAddressesSchema = z.object({
  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),

  address_id: z.string({
    invalid_type_error: "El campo 'address_id' debe ser de tipo string.",
    required_error: "El campo 'address_id' es requerido."
  }).uuid({ message: "El campo 'address_id' debe ser un UUID válido." })
}).strict();

