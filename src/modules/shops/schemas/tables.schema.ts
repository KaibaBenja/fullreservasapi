import { z } from "zod";

export const tablesSchema = z.object({
  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),

  location_type: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["INSIDE", "OUTSIDE"], {
      errorMap: () => ({ message: "El campo 'location_type' solo puede ser 'INSIDE' ó 'OUTSIDE'." })
    })
  ),

  floor: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["GROUND LEVEL", "UPPER LEVEL"], {
      errorMap: () => ({ message: "El campo 'floor' solo puede ser 'GROUND LEVEL' ó 'UPPER LEVEL'." })
    })
  ),

  roof_type: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["COVERED", "UNCOVERED"], {
      errorMap: () => ({ message: "El campo 'roof_type' solo puede ser 'COVERED' ó 'UNCOVERED'." })
    })
  ),

  capacity: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'capacity' debe ser de tipo número.",
      required_error: "El campo 'capacity' es requerido.",
    }).refine((val) => val <= 50, {
      message: "El campo 'capacity' no puede ser más de 50.",
    })
  ),
  
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'quantity' debe ser de tipo número.",
      required_error: "El campo 'quantity' es requerido.",
    }).refine((val) => val <= 50, {
      message: "El campo 'quantity' no puede ser más de 50.",
    })
  ),
}).strict();

