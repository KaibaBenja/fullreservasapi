import express from "express";
import { validateSchema, } from "../../../middlewares/validateSchema";
import { login, logout, register, requestPasswordReset, resetPassword } from "../controllers/auth.controller";
import { loginSchema, userSchema, userEmailSchema, userPasswordSchema } from "../schemas/users.schema";

export const authRoutes = express.Router();
/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Registro/Creación y Login de Usuarios
 */

/**
 * @swagger
 * /api/users/auth/register:
 *  post:
 *      summary: Registra/Crea un nuevo usuario
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - full_name
 *                          - password
 *                          - email
 *                          - merchant
 *                      properties:
 *                          full_name:
 *                              type: string
 *                              example: John Doe
 *                          password:
 *                              type: string
 *                              example: JohnDoe123$
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: johndoe@domain.com
 *                          merchant:
 *                              type: boolean
 *                              example: false
 *      responses:
 *          201:
 *              description: Usuario creado con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Usuario creado exitosamente.
 *                              user:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                         id:
 *                                             type: string
 *                                             format: uuid
 *                                             example: 550e8400-e29b-41d4-a716-446655440000
 *                                         full_name:
 *                                             type: string
 *                                             example: John Doe
 *                                         email:
 *                                           type: string
 *                                           example: johndoe@domain.com
 *                                         created_at:
 *                                           type: string
 *                                           format: date-time
 *                                           example: 2025-05-09T19:39:48.000Z
 *                                         updated_at:
 *                                           type: string
 *                                           format: date-time
 *                                           example: 2025-05-09T19:39:48.000Z
 *                                         roles:
 *                                           type: array
 *                                           items:
 *                                             type: string
 *                                             example: MERCHANT, CLIENT
 *                                         membership:
 *                                           type: object
 *                                           properties:
 *                                             tier:
 *                                                 type: string
 *                                             status:
 *                                                  type: string
 *                                             created_at:
 *                                                  type: string
 *                                             updated_at:
 *                                                  type: string
 *                                             expire_date:
 *                                                  type: string
 *                                                  nullable: true
 *                          example:
 *                              message: Usuario creado exitosamente
 *                              user:
 *                                  id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                  full_name: "John Doe"
 *                                  email: johndoe@domain.com
 *                                  created_at: 2025-05-09 20:11:04.000000
 *                                  updated_at: 2025-05-09 20:11:04.000000
 *                                  roles: [CLIENT, MERCHANT]
 *                                  membership:
 *                                      tier: FREE
 *                                      status: EXPIRED
 *                                      created_at: 2025-05-09 20:11:04.000000
 *                                      updated_at: 2025-05-09 20:11:04.000000
 *                                      expire_date: 2025-05-09 20:11:04.000000
 *                                          
 *          404:
 *              description: Error al crear el usuario.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El usuario no se ha creado."
 *          409:
 *              description: Error de recursos asociados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "No se encuentra el rol CLIENT para asignar"
 *          500:
 *              description: Error interno del servidor.
 * 
 */
authRoutes.post("/register", validateSchema(userSchema), register);
/**
 * @swagger
 * /api/users/auth/login:
 *  post:
 *      summary: Inicio de sesión app y dashboard
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - email
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: johndoe@domain.com
 *                          password:
 *                              type: string
 *                              example: JohnDoe123$
 *      responses:
 *          200:
 *              description: Usuario logeado con exito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                         id:
 *                                             type: string
 *                                             format: uuid
 *                                             example: 550e8400-e29b-41d4-a716-446655440000
 *                                         full_name:
 *                                             type: string
 *                                             example: John Doe
 *                                         email:
 *                                           type: string
 *                                           example: johndoe@domain.com
 *                                         created_at:
 *                                           type: string
 *                                           format: date-time
 *                                           example: 2025-05-09T19:39:48.000Z
 *                                         updated_at:
 *                                           type: string
 *                                           format: date-time
 *                                           example: 2025-05-09T19:39:48.000Z
 *                                         roles:
 *                                           type: array
 *                                           items:
 *                                             type: string
 *                                             example: MERCHANT, CLIENT
 *                                         membership:
 *                                           type: object
 *                                           properties:
 *                                             tier:
 *                                                 type: string
 *                                             status:
 *                                                  type: string
 *                                             created_at:
 *                                                  type: string
 *                                             updated_at:
 *                                                  type: string
 *                                             expire_date:
 *                                                  type: string
 *                                                  nullable: true
 *                              idToken:
 *                                  type: string
 *                                  example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5MWYxNWRlZTg0OTUzNjZjOTgyZTA1MTMzYmNhOGYyNDg5ZWFjNzIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTmljb2xhcyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9mdWxscmVzZXJ2YXMtYXBpIiwiYXVkIjoiZnVsbHJlc2VydmFzLWFwaSIsImF1dGhfdGltZSI6MTc0NjgyNjAwNCwidXNlcl9pZCI6InRVd0VxZTlnVzlObkpsbFpvZWlLUHhzMFh4RjIiLCJzdWIiOiJ0VXdFcWU5Z1c5Tm5KbGxab2VpS1B4czBYeEYyIiwiaWF0IjoxNzQ2ODI2MDA0LCJleHAiOjE3NDY4Mjk2MDQsImVtYWlsIjoibmljb2JvYXR0aW5pQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJuaWNvYm9hdHRpbmlAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.c_fhpmXOdlIQEpWWLH3onbKeW1E0dYAYROg723fTfdfSx97-DH90UblxCeYW2OfSeOBTbBANyamp4Hgwue4yahNiIHcXVpdg33kixm7IBrdAXf6HVdMs4DyybG_TP8EZEm6HjadUbX_16iOcAwK8bpLqcWhxjxDLjlitXko82nIDPfBeIGqlgusFlg9Hajx10qOTpZ-jKKIJFtKRQVb1eI7tbh2QlVbZCz_UEw54rLoXSNYrSvvmMo45xGKK0KThrhdvQKU8F3SdEMYW-xG9hChTsWfMSxiG7_8HOoaRS_kFJKA55CwGI4Z2ycbeAHZpPqKeoeEjBY-uikTuRYW4dw
 *                          example:
 *                              message: Usuario creado exitosamente
 *                              user:
 *                                  id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                  full_name: "John Doe"
 *                                  email: johndoe@domain.com
 *                                  created_at: 2025-05-09 20:11:04.000000
 *                                  updated_at: 2025-05-09 20:11:04.000000
 *                                  roles: [CLIENT, MERCHANT]
 *                                  membership:
 *                                      tier: FREE
 *                                      status: EXPIRED
 *                                      created_at: 2025-05-09 20:11:04.000000
 *                                      updated_at: 2025-05-09 20:11:04.000000
 *                                      expire_date: 2025-05-09 20:11:04.000000
 *                              idToken: eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5MWYxNWRlZTg0OTUzNjZjOTgyZTA1MTMzYmNhOGYyNDg5ZWFjNzIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTmljb2xhcyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9mdWxscmVzZXJ2YXMtYXBpIiwiYXVkIjoiZnVsbHJlc2VydmFzLWFwaSIsImF1dGhfdGltZSI6MTc0NjgyNjAwNCwidXNlcl9pZCI6InRVd0VxZTlnVzlObkpsbFpvZWlLUHhzMFh4RjIiLCJzdWIiOiJ0VXdFcWU5Z1c5Tm5KbGxab2VpS1B4czBYeEYyIiwiaWF0IjoxNzQ2ODI2MDA0LCJleHAiOjE3NDY4Mjk2MDQsImVtYWlsIjoibmljb2JvYXR0aW5pQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJuaWNvYm9hdHRpbmlAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.c_fhpmXOdlIQEpWWLH3onbKeW1E0dYAYROg723fTfdfSx97-DH90UblxCeYW2OfSeOBTbBANyamp4Hgwue4yahNiIHcXVpdg33kixm7IBrdAXf6HVdMs4DyybG_TP8EZEm6HjadUbX_16iOcAwK8bpLqcWhxjxDLjlitXko82nIDPfBeIGqlgusFlg9Hajx10qOTpZ-jKKIJFtKRQVb1eI7tbh2QlVbZCz_UEw54rLoXSNYrSvvmMo45xGKK0KThrhdvQKU8F3SdEMYW-xG9hChTsWfMSxiG7_8HOoaRS_kFJKA55CwGI4Z2ycbeAHZpPqKeoeEjBY-uikTuRYW4dw
 *          500:
 *              description: Error al iniciar sesión.
 * 
 */
authRoutes.post("/login", validateSchema(loginSchema), login);
/**
 * @swagger
 * /api/users/auth/logout:
 *  post:
 *      summary: Cierre de sesión app y dashboard
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - idToken
 *                      properties:
 *                          idToken:
 *                              type: string
 *                              example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5MWYxNWRlZTg0OTUzNjZjOTgyZTA1MTMzYmNhOGYyNDg5ZWFjNzIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTmljb2xhcyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9mdWxscmVzZXJ2YXMtYXBpIiwiYXVkIjoiZnVsbHJlc2VydmFzLWFwaSIsImF1dGhfdGltZSI6MTc0NjgyNjAwNCwidXNlcl9pZCI6InRVd0VxZTlnVzlObkpsbFpvZWlLUHhzMFh4RjIiLCJzdWIiOiJ0VXdFcWU5Z1c5Tm5KbGxab2VpS1B4czBYeEYyIiwiaWF0IjoxNzQ2ODI2MDA0LCJleHAiOjE3NDY4Mjk2MDQsImVtYWlsIjoibmljb2JvYXR0aW5pQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJuaWNvYm9hdHRpbmlAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.c_fhpmXOdlIQEpWWLH3onbKeW1E0dYAYROg723fTfdfSx97-DH90UblxCeYW2OfSeOBTbBANyamp4Hgwue4yahNiIHcXVpdg33kixm7IBrdAXf6HVdMs4DyybG_TP8EZEm6HjadUbX_16iOcAwK8bpLqcWhxjxDLjlitXko82nIDPfBeIGqlgusFlg9Hajx10qOTpZ-jKKIJFtKRQVb1eI7tbh2QlVbZCz_UEw54rLoXSNYrSvvmMo45xGKK0KThrhdvQKU8F3SdEMYW-xG9hChTsWfMSxiG7_8HOoaRS_kFJKA55CwGI4Z2ycbeAHZpPqKeoeEjBY-uikTuRYW4dw
 *      responses:
 *          200:
 *              description: Sesión cerrada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "User logged out successfully"
 *          
 *          500:
 *              description: Error al cerrar sesión.
 * 
 */
authRoutes.post("/logout", logout);

authRoutes.post("/request-password-reset", validateSchema(userEmailSchema), requestPasswordReset);
authRoutes.post("/reset-password", validateSchema(userPasswordSchema), resetPassword);
