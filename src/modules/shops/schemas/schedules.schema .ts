import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const schedulesSchema = z.object({
  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),

  open_time: z.string({
    invalid_type_error: "El campo 'open_time' debe ser de tipo string.",
    required_error: "El campo 'open_time' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm:ss" }),

  close_time: z.string({
    invalid_type_error: "El campo 'close_time' debe ser de tipo string.",
    required_error: "El campo 'close_time' es requerido."
  }).regex(timeRegex, { message: "El formato debe ser HH:mm:ss" })
}).strict();

