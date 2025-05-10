import express from "express";
import { validateSchema } from "../../../middlewares/validateSchema";
import countriesController from "../controllers/countries.controller";
import { countrySchema } from "../schemas/countries.schema";

export const countriesRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Countries:
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
 *                  type: string
 *                  example: Argentina
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              name: Argentina
 */

/**
 * @swagger
 * tags:
 *  name: Country
 *  description: Paises
 */

/**
 * @swagger
 * /api/address/countries:
 *  post:
 *      summary: Crea un nuevo pais
 *      tags: [Country]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - name
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Argentina
 *      responses:
 *          201:
 *              description: País agregado exitosamente.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Countries'
 *          404:
 *              description: Error al agregar el país.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El país con el ID no existe."
 *          409:
 *              description: Entrada duplicada en el registro.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El país ya existe."
 *          500:
 *              description: Error interno del servidor.
 */
countriesRoutes.post("/", validateSchema(countrySchema), countriesController.create);
/**
 * @swagger
 * /api/address/countries:
 *   get:
 *     summary: Retorna una lista de todas los paises.
 *     tags: [Country]
 *     responses:
 *       200:
 *         description: Todos los paises.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Countries'
 *       500:
 *          description: Error interno del servidor.
 */
countriesRoutes.get("/", countriesController.getAll);
/**
 * @swagger
 * /api/address/countries/{id}:
 *   get:
 *     summary: Retorna un país por ID
 *     tags: [Country]
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
 *              description: El país del id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Countries'
 *          404:
 *              description: La ciudad con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
countriesRoutes.get("/:id", countriesController.getById);
/**
 * @swagger
 * /api/address/countries/{id}:
 *  patch:
 *      summary: Actualiza parcialmente un país por ID
 *      tags: [Country]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del país
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Argentina
 *      responses:
 *          200:
 *              description: El país fue editado con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Countries'
 *          400:
 *              description: Se debe enviar al menos un campo para actualizar.
 *          404:
 *              description: El país con el ID no existe.
 *          409:
 *              description: Error al editar el país.
 *          500:
 *              description: Error interno del servidor.
 */
countriesRoutes.patch("/:id", validateSchema(countrySchema), countriesController.editById);
/**
 * @swagger
 * /api/address/countries/{id}:
 *  delete:
 *      summary: Elimina un país por ID
 *      tags: [Country]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del país
 *      responses:
 *          200:
 *              description: El país fue eliminada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *          404:
 *              description: Error al eliminar. El país con el ID no existe.
 *          500:
 *              description: Error interno del servidor.
 */
countriesRoutes.delete("/:id", countriesController.deleteById);


