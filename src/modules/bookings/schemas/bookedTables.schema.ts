import { z } from "zod";

export const bookedTablesSchema = z.object({
  booking_id: z.string({
    invalid_type_error: "El campo 'booking_id' debe ser de tipo string.",
    required_error: "El campo 'booking_id' es requerido."
  }).uuid({ message: "El campo 'booking_id' debe ser un UUID válido." }),

  table_id: z.string({
    invalid_type_error: "El campo 'table_id' debe ser de tipo string.",
    required_error: "El campo 'table_id' es requerido."
  }).uuid({ message: "El campo 'table_id' debe ser un UUID válido." }),

  tables_booked: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'tables_booked' debe ser de tipo número.",
      required_error: "El campo 'tables_booked' es requerido.",
    })
  ),

  guests: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number({
      invalid_type_error: "El campo 'guests' debe ser de tipo número.",
      required_error: "El campo 'guests' es requerido.",
    })
  ),

}).strict();

