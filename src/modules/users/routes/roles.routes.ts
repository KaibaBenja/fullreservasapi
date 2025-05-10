import express from "express";
import rolesController from "../controllers/roles.controller";

export const rolesRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Roles:
 *          type: object
 *          required:
 *              - id
 *              - name
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              name:
 *                  type: varchar
 *                  example: CLIENT
 *              description:
 *                  type: varchar
 *                  example: Rol por defecto de usuarios registrados
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              name: CLIENT
 *              description: Rol por defecto de usuarios registrados
 */

/**
 * @swagger
 * tags:
 *  name: Role
 *  description: Roles
 */

/**
 * @swagger
 * /api/users/roles:
 *   get:
 *     summary: Retorna una lista de todos los roles
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: Todos los roles.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Roles'
 *       500:
 *          description: Error interno del servidor.
 */
rolesRoutes.get("/", rolesController.getAll);
/**
 * @swagger
 * /api/users/roles/{id}:
 *   get:
 *     summary: Retorna un rol por ID
 *     tags: [Role]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del rol
 *     responses:
 *          200:
 *              description: El rol del id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Roles'
 *          404:
 *              description: El rol con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
rolesRoutes.get("/:id", rolesController.getById);
