import { z } from 'zod';

export const footerSchema = z.object({
  key: z.string({
    required_error: 'El campo "key" es obligatorio.',
    invalid_type_error: 'El campo "key" debe ser un texto.'
  }).refine(
    val => ['legal_terms', 'usage_rules', 'privacy_policy', 'faq', 'footer_content'].includes(val),
    { message: 'El valor de "key" no es válido. Debe ser uno de: "legal_terms", "usage_rules", "privacy_policy", "faq" o "footer_content".' }
  ),
  content: z.string({
    required_error: 'El campo "content" es obligatorio.',
    invalid_type_error: 'El campo "content" debe ser un texto.'
  })
  .min(1, { message: 'El campo "content" debe tener al menos 1 carácter.' })
  .max(5000, { message: 'El campo "content" debe tener como máximo 5000 caracteres.' }),
}).strict();
