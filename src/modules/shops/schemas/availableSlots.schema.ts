import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const availableSlotsSchema = z.object({
  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),

  start_time: z.string({
    invalid_type_error: "El campo 'start_time' debe ser de tipo string.",
    required_error: "El campo 'start_time' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm:ss" }),

  end_time: z.string({
    invalid_type_error: "El campo 'end_time' debe ser de tipo string.",
    required_error: "El campo 'end_time' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm:ss" }),

  capacity: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'capacity' debe ser de tipo número.",
      required_error: "El campo 'capacity' es requerido.",
    }).refine((val) => val <= 50, {
      message: "El campo 'capacity' no puede ser más de 50.",
    })
  )
}).strict();

