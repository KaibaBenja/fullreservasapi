import { z } from "zod";

export const bookingSchema = z.object({
  user_id: z.string({
    invalid_type_error: "El campo 'user_id' debe ser de tipo string.",
    required_error: "El campo 'user_id' es requerido."
  }).uuid({ message: "El campo 'user_id' debe ser un UUID válido." }),

  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),

  booked_slot_id: z.string({
    invalid_type_error: "El campo 'booked_slot_id' debe ser de tipo string.",
    required_error: "El campo 'booked_slot_id' es requerido."
  }).uuid({ message: "El campo 'booked_slot_id' debe ser un UUID válido." }),

  date: z.coerce.date({
    invalid_type_error: "El campo 'date' debe ser una fecha válida.",
    required_error: "El campo 'date' es requerido."
  }),

  guests: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'guests' debe ser de tipo número.",
      required_error: "El campo 'capacigueststy' es requerido.",
    })
  ),

  location_type: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["INSIDE", "OUTSIDE"], {
      errorMap: () => ({ message: "El campo 'location_type' solo puede ser 'INSIDE' ó 'OUTSIDE'." })
    })
  ).optional(),

  floor: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["GROUND LEVEL", "UPPER LEVEL"], {
      errorMap: () => ({ message: "El campo 'floor' solo puede ser 'GROUND LEVEL' ó 'UPPER LEVEL'." })
    })
  ).optional(),

  roof_type: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["COVERED", "UNCOVERED"], {
      errorMap: () => ({ message: "El campo 'roof_type' solo puede ser 'COVERED' ó 'UNCOVERED'." })
    })
  ).optional(),

  comment: z.string({
    invalid_type_error: "El campo 'comment' debe ser de tipo string.",
    required_error: "El campo 'comment' es requerido."
  })
    .min(1, { message: "El campo 'comment' debe tener al menos 1 caracteres." })
    .max(200, { message: "El campo 'comment' no puede tener más de 200 caracteres." })
    .optional(),
}).strict();


export const bookingSchemaFiter = bookingSchema.extend({
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(['PENDING', 'CONFIRMED', 'CANCELLED'], {
      errorMap: () => ({ message: "El campo 'status' solo puede ser 'PENDING', 'CONFIRMED' ó 'CANCELLED'." })
    })
  ),
});
