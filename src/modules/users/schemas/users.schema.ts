import { z } from "zod";

export const userSchema = z.object({
  full_name: z.string({
    invalid_type_error: "El campo 'full_name' debe ser de tipo string.",
    required_error: "El campo 'full_name' es requerido."
  })
    .min(1, { message: "El campo 'full_name' debe tener al menos 1 caracteres." })
    .max(255, { message: "El campo 'full_name' no puede tener más de 255 caracteres." }),

  password: z.string({
    invalid_type_error: "El campo 'password' debe ser de tipo string.",
    required_error: "El campo 'password' es requerido."
  })
    .min(8, { message: "El campo 'password' debe tener al menos 8 caracteres." })
    .max(128, { message: "El campo 'password' no puede tener más de 128 caracteres." })
    .regex(/[A-Z]/, { message: "El campo 'password' debe contener al menos una letra mayúscula." })
    .regex(/[a-z]/, { message: "El campo 'password' debe contener al menos una letra minúscula." })
    .regex(/[0-9]/, { message: "El campo 'password' debe contener al menos un número." })
    .regex(/[^A-Za-z0-9]/, { message: "El campo 'password' debe contener al menos un carácter especial." })
    .refine(value => !/\s/.test(value), {
      message: "El campo 'password' no debe contener espacios en blanco."
    }),

  email: z.string({
    invalid_type_error: "El campo 'email' debe ser de tipo string.",
    required_error: "El campo 'email' es requerido."
  })
    .trim()
    .toLowerCase()
    .email({ message: "El correo electrónico no es válido" })
    .max(255, { message: "El campo 'email' no puede tener más de 255 caracteres." }),

  merchant: z.boolean({
    invalid_type_error: "El campo 'merchant' debe ser de tipo booleano.",
    required_error: "El campo 'merchant' es requerido."
  }).default(false)
}).strict();

export const userGoogleSchema = z.object({
  full_name: z.string({
    invalid_type_error: "El campo 'full_name' debe ser de tipo string.",
    required_error: "El campo 'full_name' es requerido."
  })
    .min(1, { message: "El campo 'full_name' debe tener al menos 1 caracteres." })
    .max(255, { message: "El campo 'full_name' no puede tener más de 255 caracteres." }),

  email: z.string({
    invalid_type_error: "El campo 'email' debe ser de tipo string.",
    required_error: "El campo 'email' es requerido."
  })
    .trim()
    .toLowerCase()
    .email({ message: "El correo electrónico no es válido" })
    .max(255, { message: "El campo 'email' no puede tener más de 255 caracteres." }),

  merchant: z.boolean({
    invalid_type_error: "El campo 'merchant' debe ser de tipo booleano.",
    required_error: "El campo 'merchant' es requerido."
  }).default(false),

  idToken: z.string({
    invalid_type_error: "El campo 'idToken' es requerido para usuarios de Google."
  })
    .min(10, "El idToken debe ser válido.")
});

export const loginSchema = userSchema.pick({
  email: true,
  password: true
})

export const loginGoogleSchema = z.object({
  idToken: z.string({
    required_error: "El token de Google es requerido.",
    invalid_type_error: "El token debe ser una cadena."
  }).min(10, { message: "El token proporcionado no es válido." })
});


export const editUserSchema = userSchema.extend({
  current_password: z.string({
    invalid_type_error: "El campo 'current_password' debe ser de tipo string.",
    required_error: "El campo 'current_password' es requerido."
  })
    .min(8, { message: "El campo 'password' debe tener al menos 8 caracteres." })
    .max(128, { message: "El campo 'password' no puede tener más de 128 caracteres." })
    .regex(/[A-Z]/, { message: "El campo 'password' debe contener al menos una letra mayúscula." })
    .regex(/[a-z]/, { message: "El campo 'password' debe contener al menos una letra minúscula." })
    .regex(/[0-9]/, { message: "El campo 'password' debe contener al menos un número." })
    .regex(/[^A-Za-z0-9]/, { message: "El campo 'password' debe contener al menos un carácter especial." })
    .refine(value => !/\s/.test(value), {
      message: "El campo 'password' no debe contener espacios en blanco."
    }),
})

export const userEmailSchema = userSchema.pick({
  email: true
})

export const userPasswordSchema = userSchema.pick({
  password: true
})

export const deleteSchema = editUserSchema.pick({
  current_password: true
})
