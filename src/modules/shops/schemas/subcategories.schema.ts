import { z } from "zod";

export const subcategoriesSchema = z.object({
  name: z.string({
    invalid_type_error: "El campo 'street' debe ser de tipo string.",
    required_error: "El campo 'street' es requerido."
  })
    .min(1, { message: "El campo 'street' debe tener al menos 1 carácter." })
    .max(255, { message: "El campo 'street' no puede tener más de 255 caracteres." }),

  main_category: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val), 
    z.enum(["COMMERCE", "SERVICE"], {
      errorMap: () => ({ message: "El campo 'main_category' solo puede ser 'COMMERCE' o 'SERVICE'." })
    })
  )
}).strict();

