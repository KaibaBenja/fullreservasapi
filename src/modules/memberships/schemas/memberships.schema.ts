import { z } from "zod";

export const membershipsSchema = z.object({
  user_id: z.string({
    invalid_type_error: "El campo 'user_id' debe ser de tipo string.",
    required_error: "El campo 'user_id' es requerido."
  }).uuid({ message: "El campo 'user_id' debe ser un UUID válido." }),

  tier: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val), 
    z.enum(["FREE", "BASIC", "ADVANCED", "PREMIUM"], {
      errorMap: () => ({ message: `El campo 'tier' solo puede ser "FREE", "BASIC", "ADVANCED", "PREMIUM".` })
    })
  ),

  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val), 
    z.enum(["ACTIVE", "INACTIVE", "PENDING", "EXPIRED", "DELAYED"], {
      errorMap: () => ({ message: `El campo 'status' solo puede ser "ACTIVE", "INACTIVE", "PENDING", "EXPIRED", "DELAYED".` })
    })
  ).optional(),

  expire_date: z
    .string()
    .datetime({ message: "El campo 'expire_date' debe ser una fecha válida en formato ISO." })
    .optional(),
}).strict();

export const tierSchema = membershipsSchema.pick({ tier: true });
export const statusSchema = membershipsSchema.pick({ status: true });

