import express from "express";
import { validateSchema } from "../../../middlewares/validateSchema";
import operatorsController from "../controllers/operators.controller";
import { operatorsSchema } from "../schemas/operators.schema";

export const operatorsRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Operator_settings:
 *          type: object
 *          required:
 *              - id
 *              - user_id
 *              - shop_id
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              user_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id:
 *                  type: string
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              created_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *              updated_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              user_id: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id: 550e8400-e29b-41d4-a716-446655440000
 *              created_at: 2025-05-09 20:07:47.000000
 *              updated_at: 2025-05-09 20:07:47.000000
 */

/**
 * @swagger
 * tags:
 *  name: Operator
 *  description: Operadores
 */

/**
 * @swagger
 * /api/users/operators:
 *  post:
 *      summary: Registra/Crea un nuevo operador para un comercio
 *      tags: [Operator]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - full_name
 *                          - password
 *                          - shop_id
 *                      properties:
 *                          full_name:
 *                              type: string
 *                              example: John Doe
 *                          password:
 *                              type: string
 *                              example: JohnDoe123$
 *                          shop_id:
 *                              type: string
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *      responses:
 *          201:
 *              description: Operador creado con éxito.
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
 *                                         operator_settings:
 *                                           type: object
 *                                           properties:
 *                                             id:
 *                                                 type: string
 *                                                 format: uuid
 *                                                 example: 550e8400-e29b-41d4-a716-446655440000
 *                                             shop_id:
 *                                                  type: string
 *                                                  format: uuid
 *                                                  example: 550e8400-e29b-41d4-a716-446655440000
 *                                             created_at:
 *                                                  type: date-time
 *                                                  example: 2025-05-09T19:39:48.000Z
 *                                             updated_at:
 *                                                  type: date-time
 *                                                  example: 2025-05-09T19:39:48.000Z
 *                          example:
 *                              message: Operador creado exitosamente
 *                              user:
 *                                  id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                  full_name: "John Doe"
 *                                  email: johndoe@domain.com
 *                                  created_at: 2025-05-09 20:11:04.000000
 *                                  updated_at: 2025-05-09 20:11:04.000000
 *                                  operator_settings:
 *                                      id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                      shop_id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                      created_at: 2025-05-09 20:11:04.000000
 *                                      updated_at: 2025-05-09 20:11:04.000000
 *                                          
 *          400:
 *              description: Error de recursos asociados
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El comercio con el id no existe"
 *          409:
 *              description: Entradas duplicadas en el registro.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El operador con el nombre ya se encuentra registrado"
 *          500:
 *              description: Error interno del servidor.
 * 
 */
operatorsRoutes.post("/", validateSchema(operatorsSchema), operatorsController.create);
/**
 * @swagger
 * /api/users/operators:
 *   get:
 *     summary: Retorna todos los operadores, opcional por shop_id
 *     tags: [Operator]
 *     parameters:
 *        - in: query
 *          name: shop_id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: false
 *          description: El id del shop
 *     responses:
 *          200:
 *              description: Relación usuario-rol
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
 *                                         operator_settings:
 *                                           type: object
 *                                           properties:
 *                                             id:
 *                                                 type: string
 *                                                 format: uuid
 *                                                 example: 550e8400-e29b-41d4-a716-446655440000
 *                                             shop_id:
 *                                                  type: string
 *                                                  format: uuid
 *                                                  example: 550e8400-e29b-41d4-a716-446655440000
 *                                             created_at:
 *                                                  type: date-time
 *                                                  example: 2025-05-09T19:39:48.000Z
 *                                             updated_at:
 *                                                  type: date-time
 *                                                  example: 2025-05-09T19:39:48.000Z
 *                          example:
 *                              message: Operador creado exitosamente
 *                              user:
 *                                  id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                  full_name: "John Doe"
 *                                  email: johndoe@domain.com
 *                                  created_at: 2025-05-09 20:11:04.000000
 *                                  updated_at: 2025-05-09 20:11:04.000000
 *                                  operator_settings:
 *                                      id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                      shop_id: ca77dc38-bd60-5da7-b428-f7bdc22525f5
 *                                      created_at: 2025-05-09 20:11:04.000000
 *                                      updated_at: 2025-05-09 20:11:04.000000
 *          400:
 *              description: El usuario con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
operatorsRoutes.get("/", operatorsController.getAll);
/**
 * @swagger
 * /api/users/operators/{id}:
 *   get:
 *     summary: Retorna un operador por ID
 *     tags: [Operator]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del operador
 *     responses:
 *          200:
 *              description: El operador del id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Operator_settings'
 *          404:
 *              description: El operador con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
operatorsRoutes.get("/:id", operatorsController.getById);
/**
 * @swagger
 * /api/users/operators/{id}:
 *  delete:
 *      summary: Elimina un operador por ID
 *      tags: [Operator]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del operador
 *      responses:
 *          200:
 *              description: El operador fue eliminado con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *                              user:
 *                                  $ref: '#/components/schemas/Users'
 *          404:
 *              description: Error al eliminar. El operador con el ID no existe.
 *          500:
 *              description: Error interno del servidor.
 */
operatorsRoutes.delete("/:id", operatorsController.deleteById);
