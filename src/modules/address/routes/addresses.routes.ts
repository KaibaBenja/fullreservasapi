import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import addressesController from "../controllers/addresses.controller";
import { addressesSchema } from "../schemas/addresses.schema";

export const addressesRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Addresses:
 *          type: object
 *          required:
 *              - id
 *              - street
 *              - street_number
 *              - city_id
 *              - province_id
 *              - country_id
 *              - latitude
 *              - longitude
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              street:
 *                  type: varchar
 *                  example: Tucuman
 *              street_number:
 *                  type: varchar
 *                  example: 1164
 *              extra:
 *                  type: varchar
 *                  example: 1B
 *              city_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              province_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              country_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              description:
 *                  type: varchar
 *                  example: Oficina
 *              latitude:
 *                  type: decimal
 *                  example: 11.21
 *              longitude:
 *                  type: decimal
 *                  example: 12.12
 *              created_at:
 *                  type: datetime
 *                  example: 25-05-2025 11:00:00:00
 *              updated_at:
 *                  type: datetime
 *                  example: 25-05-2025 11:00:00:00
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              street: Tucuman
 *              street_number: 1164
 *              extra: P1
 *              city_id: 550e8400-e29b-41d4-a716-446655440000
 *              province_id: 550e8400-e29b-41d4-a716-446655440000
 *              country_id: 550e8400-e29b-41d4-a716-446655440000
 *              description: Oficina
 *              latitude: 11.21
 *              longitude: 12.12
 *              created_at: 25-05-2025 11:00:00:00
 *              updated_at: 25-05-2025 11:00:00:00
 */

/**
 * @swagger
 * tags:
 *  name: Address
 *  description: Direcciones
 */

/**
 * @swagger
 * /api/address/details:
 *  post:
 *      summary: Crea una nueva dirección
 *      tags: [Address]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - street
 *                          - street_number
 *                          - latitude
 *                          - longitude
 *                      properties:
 *                          street:
 *                              type: string
 *                              example: Tucuman
 *                          street_number:
 *                              type: string
 *                              example: 1164
 *                          extra:
 *                              type: string
 *                              example: 1B
 *                          city_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          province_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          country_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          description:
 *                              type: varchar
 *                              example: Oficina
 *                          latitude:
 *                              type: decimal
 *                              example: 11.21
 *                          longitude:
 *                              type: decimal
 *                              example: 12.12
 *      responses:
 *          201:
 *              description: Dirección agregada exitosamente.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Addresses'
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
 *              description: Entrada duplicada en el registro.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El address ya existe."
 *          500:
 *              description: Error interno del servidor.
 */
addressesRoutes.post("/", validateSchema(addressesSchema), addressesController.create);
/**
 * @swagger
 * /api/address/details/filtered:
 *  post:
 *      summary: Retorna una lista de todas las direcciones según los filtros proporcionados.
 *      tags: [Address]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          street:
 *                              type: string
 *                              example: Tucuman
 *                          street_number:
 *                              type: string
 *                              example: 1164
 *                          extra:
 *                              type: string
 *                              example: 1B
 *                          city_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          province_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          country_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          description:
 *                              type: varchar
 *                              example: Oficina
 *                          latitude:
 *                              type: decimal
 *                              example: 11.21
 *                          longitude:
 *                              type: decimal
 *                              example: 12.12
 *      responses:
 *          201:
 *              description: Direcciones que coinciden con los filtros proporcionados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Addresses'
 *          500:
 *              description: Error interno del servidor.
 */
addressesRoutes.post("/filtered", validateSchemaPartial(addressesSchema), addressesController.getAllByFilters);
/**
 * @swagger
 * /api/address/details:
 *   get:
 *     summary: Retorna una lista de todas las direcciones
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: Todas las direcciones.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Addresses'
 *       500:
 *          description: Error interno del servidor.
 */

addressesRoutes.get("/", addressesController.getAll);
/**
 * @swagger
 * /api/address/details/{id}:
 *   get:
 *     summary: Retorna una dirección por Id
 *     tags: [Address]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del address
 *     responses:
 *          200:
 *              description: La dirección del id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Addresses'
 *          404:
 *              description: La dirección con el id solicitado no existe.
 *          500:
 *              description: Error interno del servidor.
 */
addressesRoutes.get("/:id", addressesController.getById);
/**
 * @swagger
 * /api/address/details/{id}:
 *  patch:
 *      summary: Actualiza parcialmente una dirección por ID
 *      tags: [Address]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del address
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          street:
 *                              type: string
 *                              example: Tucuman
 *                          street_number:
 *                              type: string
 *                              example: 1164
 *                          extra:
 *                              type: string
 *                              example: 1B
 *                          city_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          province_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          country_id:
 *                              type: binary
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          description:
 *                              type: varchar
 *                              example: Oficina
 *                          latitude:
 *                              type: decimal
 *                              example: 11.21
 *                          longitude:
 *                              type: decimal
 *                              example: 12.12
 *      responses:
 *          200:
 *              description: La dirección fue editada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Addresses'
 *          400:
 *              description: Se debe enviar al menos un campo para actualizar.
 *          404:
 *              description: La dirección con el ID no existe.
 *          409:
 *              description: Error al editar la dirección.
 *          500:
 *              description: Error interno del servidor.
 */
addressesRoutes.patch("/:id", validateSchemaPartial(addressesSchema), addressesController.editById);
/**
 * @swagger
 * /api/address/details/{id}:
 *  delete:
 *      summary: Elimina una dirección por ID
 *      tags: [Address]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              format: uuid
 *          required: true
 *          description: El id del address
 *      responses:
 *          200:
 *              description: La dirección fue eliminada con éxito.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: True
 *          404:
 *              description: Error al eliminar. La dirección con el ID no existe.
 *          500:
 *              description: Error interno del servidor.
 */
addressesRoutes.delete("/:id", addressesController.deleteById);


