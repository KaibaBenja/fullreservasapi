import { z } from "zod";

export const merchantsSchema = z.object({
  user_id: z.string({
    invalid_type_error: "El campo 'user_id' debe ser de tipo string.",
    required_error: "El campo 'user_id' es requerido."
  }).uuid({ message: "El campo 'user_id' debe ser un UUID válido." }),

  main_category: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val), 
    z.enum(["COMMERCE", "SERVICE"], {
      errorMap: () => ({ message: "El campo 'main_category' solo puede ser 'COMMERCE' o 'SERVICE'." })
    })
  )
}).strict();

