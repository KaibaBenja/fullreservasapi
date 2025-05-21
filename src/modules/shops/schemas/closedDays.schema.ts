import { z } from "zod";

const validDays = [0, 1, 2, 3, 4, 5, 6];

export const ClosedDaysSchema = z.object({
  shop_id: z.string({
    invalid_type_error: "El campo 'shop_id' debe ser de tipo string.",
    required_error: "El campo 'shop_id' es requerido."
  }).uuid({ message: "El campo 'shop_id' debe ser un UUID válido." }),

  day_of_week: z.array(z.number({
    invalid_type_error: "Cada valor de 'day_of_week' debe ser un número."
  }).refine((val) => validDays.includes(val), {
    message: `Cada valor de 'day_of_week' debe ser uno de los siguientes: ${validDays.join(', ')}`
  })).nonempty("Debe haber al menos un día cerrado.")
  
}).strict();

export const SoloDaySchema = z.object({
  day_of_week: z.number({
      invalid_type_error: "El campo 'day_of_week' debe ser un número válido."
    }).refine((val) => validDays.includes(val), {
      message: `El day_of_week debe ser uno de los siguientes valores: ${validDays.join(', ')}`
    })
})

export const DayOfWeekSchema = ClosedDaysSchema.pick({ day_of_week: true});