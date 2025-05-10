import express from "express";
import { validateSchema } from "../../../middlewares/validateSchema";
import userrolesController from "../controllers/userroles.controller";
import { userrolesSchema } from "../schemas/userroles.schema";

export const userrolesRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Userroles:
 *          type: object
 *          required:
 *              - id
 *              - user_id
 *              - role_id
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              user_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              role_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              user_id: 550e8400-e29b-41d4-a716-446655440000
 *              role_id: 550e8400-e29b-41d4-a716-446655440000
 */

/**
 * @swagger
 * tags:
 *  name: Userrole
 *  description: Roles de usuarios
 */

/**
 * @swagger
 * /api/users/userroles:
 *  post:
 *      summary: Crear/Añadir un rol a un usuario
 *      tags: [Userrole]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - user_id
 *                          - role_id
 *                      properties:
 *                          user_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          role_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *      responses:
 *          201:
 *              description: Rol agregado exitosamente al usuario.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Userroles'
 *          404:
 *              description: Error al agregar el rol al usuario.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El rol con el ID no existe."
 *          409:
 *              description: Entrada duplicada en el registro.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El rol ya se encuentra agregado al usuario"
 *          500:
 *              description: Error interno del servidor.
 */
userrolesRoutes.post("/", validateSchema(userrolesSchema), userrolesController.create);
/**
 * @swagger
 * /api/users/userroles:
 *   get:
 *     summary: Retorna una relación de usuario-rol por ID
 *     tags: [Userrole]
 *     parameters:
 *        - in: query
 *          name: user_id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: false
 *          description: El id del usuario
 *        - in: query
 *          name: role_id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: false
 *          description: El id del rol 
 *     responses:
 *          200:
 *              description: Relación usuario-rol
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 *          400:
 *              description: El usuario con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
userrolesRoutes.get("/", userrolesController.getAll);
/**
 * @swagger
 * /api/users/userroles/{id}:
 *  delete:
 *      summary: Elimina un rol de usuario por ID
 *      tags: [Userrole]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id de la relación de usuario-rol
 *      responses:
 *          200:
 *              description: El rol del usuario fue eliminado con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *          404:
 *              description: Error al eliminar. La relación con el ID no existe.
 *          500:
 *              description: Error interno del servidor.
 */
userrolesRoutes.delete("/:id", userrolesController.deleteById);
