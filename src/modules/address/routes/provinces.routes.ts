import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import provincesController from "../controllers/provinces.controller";
import { provinceSchema } from "../schemas/provinces.schema";

export const provincesRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Provinces:
 *          type: object
 *          required:
 *              - id
 *              - name
 *              - country_id
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              name:
 *                  type: varchar
 *                  example: Argentina
 *              country_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              name: Misiones
 *              country_id: 550e8400-e29b-41d4-a716-446655440000
 */

/**
 * @swagger
 * tags:
 *  name: Province
 *  description: Provincias
 */

/**
 * @swagger
 * /api/address/provinces:
 *  post:
 *      summary: Crea una nueva provincia
 *      tags: [Province]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - name
 *                          - country_id
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Misiones
 *                          country_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *      responses:
 *          201:
 *              description: Provincia agregada exitosamente.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Provinces'
 *          404:
 *              description: Recurso no encontrado o error de validación de datos relacionados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El país con el ID no existe."
 *          409:
 *              description: Entradas duplicadas en el registro.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "La provincia con el nombre ya existe."
 * 
 *          500:
 *              description: Error interno del servidor.
 */
provincesRoutes.post("/", validateSchema(provinceSchema), provincesController.create);
/**
 * @swagger
 * /api/address/provinces:
 *   get:
 *     summary: Retorna una lista de todas las provincias
 *     tags: [Province]
 *     responses:
 *       200:
 *         description: Todas las provincias.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Provinces'
 *       500:
 *          description: Error interno del servidor.
 */
provincesRoutes.get("/", provincesController.getAll);
/**
 * @swagger
 * /api/address/provinces/{id}:
 *   get:
 *     summary: Retorna una provincia por ID
 *     tags: [Province]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id de la provincia.
 *     responses:
 *          200:
 *              description: La provincia del id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Provinces'
 *          404:
 *              description: La provincia con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
provincesRoutes.get("/:id", provincesController.getById);
/**
 * @swagger
 * /api/address/provinces/{id}:
 *  patch:
 *      summary: Actualiza parcialmente una provincia por ID
 *      tags: [Province]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id de la provincia
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Misiones
 *      responses:
 *          200:
 *              description: La provincia fue editada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Provinces'
 *          400:
 *              description: Se debe enviar al menos un campo para actualizar.
 *          404:
 *              description: La provincia con el ID no existe.
 *          409:
 *              description: Error al editar la provincia.
 *          500:
 *              description: Error interno del servidor.
 */
provincesRoutes.patch("/:id", validateSchemaPartial(provinceSchema), provincesController.editById);
/**
 * @swagger
 * /api/address/provinces/{id}:
 *  delete:
 *      summary: Elimina una provincia por ID
 *      tags: [Province]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id de la provincia
 *      responses:
 *          200:
 *              description: La provincia fue eliminada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: True
 *          404:
 *              description: Error al eliminar. La provincia con el ID no existe.
 *          500:
 *              description: Error interno del servidor.
 */
provincesRoutes.delete("/:id", provincesController.deleteById);


