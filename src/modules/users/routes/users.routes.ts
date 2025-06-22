import express from "express";
import { validateSchemaPartial } from "../../../middlewares/validateSchema";
import usersController from "../controllers/users.controller";
import { editUserSchema } from "../schemas/users.schema";

export const userRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Users:
 *          type: object
 *          required:
 *              - id
 *              - full_name
 *              - password
 *              - email
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              full_name:
 *                  type: string
 *                  example: John Doe
 *              password:
 *                  type: string
 *                  example: JohnDoe123$
 *              email:
 *                  type: string
 *                  format: email
 *                  example: johndoe@domain.com
 *              created_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *              updated_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              full_name: John Doe
 *              password: JohnDoe123$
 *              email: johndoe@domain.com
 *              created_at: 2025-05-09 20:07:47.000000
 *              updated_at: 2025-05-09 20:07:47.000000
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: Usuarios
 */

/**
 * @swagger
 * /api/users/details:
 *   get:
 *     summary: Retorna una lista de todos los usuarios, opcional por role_id o shop_id
 *     tags: [User]
 *     parameters:
 *        - in: query
 *          name: role_id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: false
 *          description: El id del rol
 *        - in: query
 *          name: shop_id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: false
 *          description: El id de la tienda
 *     responses:
 *       200:
 *         description: Todos los usuarios.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Users'
 *       500:
 *          description: Error interno del servidor.
 */
userRoutes.get("/", usersController.getAll);
/**
 * @swagger
 * /api/users/details/{id}:
 *   get:
 *     summary: Retorna un usuario por ID
 *     tags: [User]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del usuario
 *     responses:
 *          200:
 *              description: El usuario del id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 *          404:
 *              description: El usuario con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
userRoutes.get("/:id", usersController.getById);
/**
 * @swagger
 * /api/users/details/{id}:
 *  patch:
 *      summary: Actualiza parcialmente un usuario por ID
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del usuario
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          full_name:
 *                              type: string
 *                              example: John Doe
 *                          email:
 *                              type: string
 *                              example: johndoe@domain.com
 *                          password:
 *                              type: string
 *                              example: JohnDoe123$
 *                          current_password:
 *                              type: string
 *                              example: JohnDoe123$
 *      responses:
 *          200:
 *              description: El usuario fue editado con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 *          400:
 *              description: Se debe enviar al menos un campo para actualizar.
 *          404:
 *              description: El usuario con el ID no existe.
 *          409:
 *              description: Error al editar el usuario.
 *          500:
 *              description: Error interno del servidor.
 */
userRoutes.patch("/:id", validateSchemaPartial(editUserSchema), usersController.editById);
/**
 * @swagger
 * /api/users/details/{id}:
 *  delete:
 *      summary: Elimina un usuario por ID
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del usuario
 *      responses:
 *          200:
 *              description: El usuario fue eliminada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *          404:
 *              description: Error al eliminar. El usuario con el ID no existe.
 *          500:
 *              description: Error interno del servidor.
 */
userRoutes.delete("/:id", usersController.deleteById);
