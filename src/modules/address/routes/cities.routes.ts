import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import citiesController from "../controllers/cities.controller";
import { citiesSchema } from "../schemas/cities.schema";

export const citiesRoutes = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Cities:
 *          type: object
 *          required:
 *              - id
 *              - name
 *              - zip_code
 *              - province_id
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              name:
 *                  type: string
 *                  example: Corrientes
 *              zip_code:
 *                  type: string
 *                  example: 3400
 *              province_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              name: Corrientes
 *              zip_code: 3400
 *              province_id: 550e8400-e29b-41d4-a716-446655440000
 */

/**
 * @swagger
 * tags:
 *  name: City
 *  description: Ciudades
 */

/**
 * @swagger
 * /api/address/cities:
 *  post:
 *      summary: Crea una nueva ciudad
 *      tags: [City]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - name
 *                          - zip_code
 *                          - province_id
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Corrientes
 *                          zip_code:
 *                              type: string
 *                              example: 3400
 *                          province_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *      responses:
 *          201:
 *              description: Ciudad agregada exitosamente.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Cities'
 *          404:
 *              description: Recurso no encontrado o error de validación de datos relacionados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "La provincia con el ID no existe."
 *          409:
 *              description: Entradas duplicadas en el registro.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "La ciudad con el nombre ya existe."
 * 
 *          500:
 *              description: Error interno del servidor.
 */
citiesRoutes.post("/", validateSchema(citiesSchema), citiesController.create);
/**
 * @swagger
 * /api/address/cities:
 *   get:
 *     summary: Retorna una lista de todas las ciudades
 *     tags: [City]
 *     responses:
 *       200:
 *         description: Todas las ciudades.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Cities'
 *       500:
 *          description: Error interno del servidor.
 */
citiesRoutes.get("/", citiesController.getAll);
/**
 * @swagger
 * /api/address/cities/{id}:
 *   get:
 *     summary: Retorna una ciudad por ID
 *     tags: [City]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id de la ciudad
 *     responses:
 *          200:
 *              description: La ciudad del id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Cities'
 *          404:
 *              description: La ciudad con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
citiesRoutes.get("/:id", citiesController.getById);
/**
 * @swagger
 * /api/address/cities/{id}:
 *  patch:
 *      summary: Actualiza parcialmente una ciudad por ID
 *      tags: [City]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id de la ciudad
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Corrientes
 *                          zip_code:
 *                              type: string
 *                              example: 3400
 *                          province_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *      responses:
 *          200:
 *              description: La ciudad fue editada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Cities'
 *          400:
 *              description: Se debe enviar al menos un campo para actualizar.
 *          404:
 *              description: La ciudad con el ID no existe.
 *          409:
 *              description: Error al editar la ciudad.
 *          500:
 *              description: Error interno del servidor.
 */
citiesRoutes.patch("/:id", validateSchemaPartial(citiesSchema), citiesController.editById);
/**
 * @swagger
 * /api/address/cities/{id}:
 *  delete:
 *      summary: Elimina una ciudad por ID
 *      tags: [City]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id de la ciudad
 *      responses:
 *          200:
 *              description: La ciudad fue eliminada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *          404:
 *              description: Error al eliminar. La ciudad con el ID no existe.
 *          500:
 *              description: Error interno del servidor.
 */
citiesRoutes.delete("/:id", citiesController.deleteById);


