import { z } from "zod";

export const subcategoriesSchema = z.object({
  name: z.string({
    invalid_type_error: "El campo 'name' debe ser de tipo string.",
    required_error: "El campo 'name' es requerido."
  })
    .min(1, { message: "El campo 'name' debe tener al menos 1 carácter." })
    .max(100, { message: "El campo 'name' no puede tener más de 100 caracteres." }),

  main_category: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val), 
    z.enum(["COMMERCE", "SERVICE"], {
      errorMap: () => ({ message: "El campo 'main_category' solo puede ser 'COMMERCE' o 'SERVICE'." })
    })
  )
}).strict();

