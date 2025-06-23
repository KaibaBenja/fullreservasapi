import { z } from "zod";

export const membershipsSchema = z.object({
  user_id: z.string({
    invalid_type_error: "El campo 'user_id' debe ser de tipo string.",
    required_error: "El campo 'user_id' es requerido."
  }).uuid({ message: "El campo 'user_id' debe ser un UUID válido." }),

  tier: z.string({
    invalid_type_error: "El campo 'tier' debe ser de tipo string.",
    required_error: "El campo 'tier' es requerido."
  }).uuid({ message: "El campo 'tier' debe ser un UUID válido." }),


  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val), 
    z.enum(["ACTIVE", "INACTIVE", "PENDING", "EXPIRED", "DELAYED"], {
      errorMap: () => ({ message: `El campo 'status' solo puede ser "ACTIVE", "INACTIVE", "PENDING", "EXPIRED", "DELAYED".` })
    })
  ).optional(),

  expire_date: z.coerce.date({
    invalid_type_error: "El campo 'date' debe ser una fecha válida.",
    required_error: "El campo 'date' es requerido."
  }).optional(),

}).strict();

export const membershipUserSchema = membershipsSchema.pick({ user_id: true });
export const tierSchema = membershipsSchema.pick({ tier: true });
export const statusSchema = membershipsSchema.pick({ status: true });

