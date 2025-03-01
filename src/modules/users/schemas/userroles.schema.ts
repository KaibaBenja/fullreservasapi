import { z } from "zod";

export const userrolesSchema = z.object({
  user_id: z.string({
    invalid_type_error: "El campo 'user_id' debe ser de tipo string.",
    required_error: "El campo 'user_id' es requerido."
  }).uuid({ message: "El campo 'user_id' debe ser un UUID válido." }),

  role_id: z.string({
    invalid_type_error: "El campo 'role_id' debe ser de tipo string.",
    required_error: "El campo 'role_id' es requerido."
  }).uuid({ message: "El campo 'role_id' debe ser un UUID válido." })
}).strict();

