import express from "express";
import shopsController from "../controllers/shops.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { shopsSchema, filterShopSchema, filterShopSchemaUser } from "../schemas/shops.schema";

export const shopRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Shops:
 *          type: object
 *          required:
 *              - id
 *              - user_id
 *              - subcategory_id
 *              - name
 *              - phone_number
 *              - shift_type
 *              - average_stay_time
 *              - price_range
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              user_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              subcategory_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              name:
 *                  type: string
 *                  example: Lo de Pepe
 *              phone_number:
 *                  type: string
 *                  example: 3764877665
 *              shift_type:
 *                  type: string2181ea1a18e3
 *                  enum: [SINGLESHIFT, DOUBLESHIFT, CONTINUOUS]
 *                  example: SINGLESHIFT
 *              average_stay_time:
 *                  type: integer
 *                  example: 30
 *              capacity:
 *                  type: integer
 *                  example: 100
 *              legal_info:
 *                  type: string
 *                  example: 00-00000000-0
 *              bank_info:
 *                  type: string
 *                  example: 00000000000000000000000000
 *              description:
 *                  type: string
 *                  example: La mejor cafetería de la zona. Servicio de alta calidad y café de especialidad
 *              price_range:
 *                  type: integer
 *                  enum: [1, 2, 3]
 *                  example: 2
 *              created_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *              updated_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              user_id: 550e8400-e29b-41d4-a716-446655440000
 *              subcategory_id: 550e8400-e29b-41d4-a716-446655440000
 *              name: Lo de Pepe
 *              phone_number: 3764877665
 *              shift_type: SINGLESHIFT
 *              average_stay_time: 30
 *              capacity: 100
 *              legal_info: 00-00000000-0
 *              bank_info: 00000000000000000000000000
 *              description: La mejor cafetería de la zona. Servicio de alta calidad y café de especialidad
 *              price_range: 2
 *              created_at: 2025-05-09 20:07:47.000000
 *              updated_at: 2025-05-09 20:07:47.000000
 */

/**
 * @swagger
 * tags:
 *  name: Shop
 *  description: Comercios
 */

/**
 * @swagger
 * /api/shops/details:
 *   post:
 *     summary: Crear un nuevo comercio
 *     description: Crea un nuevo negocio en el sistema. Valida horarios de atención según el tipo de turno. Genera espacios disponibles según capacidad y tiempo medio de permanencia. 
 *     tags: [Shop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *                 - user_id
 *                 - subcategory_id
 *                 - name
 *                 - phone_numer   
 *                 - shift_type
 *                 - average_stay_time
 *                 - capacity
 *                 - legal_info
 *                 - bank_info
 *                 - price_range
 *                 - open_time1
 *                 - close_time1
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: b6b88c6c-d1a4-4d2c-84f9-5b0fc02c9c3e
 *               subcategory_id:
 *                 type: string
 *                 format: uuid
 *                 example: 3e8b2bda-e4fc-46b7-9f32-2181ea1a18e3
 *               name:
 *                 type: string
 *                 example: Lo de Pepe
 *               phone_number:
 *                 type: string
 *                 example: +543769877665
 *               shift_type:
 *                 type: string
 *                 enum: [SINGLESHIFT, DOUBLESHIFT, CONTINUOUS]
 *                 example: DOUBLESHIFT
 *               average_stay_time:
 *                 type: integer
 *                 example: 30
 *               capacity:
 *                 type: integer
 *                 example: 100
 *               legal_info:
 *                 type: string
 *                 example: 00-00000000-0
 *               bank_info:
 *                 type: string
 *                 example: 00000000000000000000000000
 *               description:
 *                 type: string
 *                 example: La mejor cafetería de la zona. Servicio de alta calidad y café de especialidad
 *               price_range:
 *                 type: integer
 *                 example: 2
 *               open_time1:
 *                 type: string
 *                 example: 07:00
 *               close_time1:
 *                 type: string
 *                 example: 11:30
 *               open_time2:
 *                 type: string
 *                 example: 17:00
 *               close_time2:
 *                 type: string
 *                 example: 22:00
 *     responses:
 *       201:
 *         description: Negocio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Negocio agregado exitosamente
 *                 shop:
 *                   $ref: '#/components/schemas/Shops'
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Usuario o subcategoría no encontrada
 *       409:
 *         description: Conflicto en los datos (ej. negocio ya existe)
 *       500:
 *         description: Error interno del servidor
 */
shopRoutes.post("/", validateSchema(shopsSchema), shopsController.create);
/**
 * @swagger
 * /api/shops/details/filtered:
 *   post:
 *     summary: Obtener negocios por filtros
 *     tags: [Shop]
 *     description: Obtiene una lista de negocios aplicando los filtros proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: b6b88c6c-d1a4-4d2c-84f9-5b0fc02c9c3e
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: b6b88c6c-d1a4-4d2c-84f9-5b0fc02c9c3e
 *               subcategory_id:
 *                 type: string
 *                 format: uuid
 *                 example: b6b88c6c-d1a4-4d2c-84f9-5b0fc02c9c3e
 *               name:
 *                 type: string
 *                 example: Lo de Pepe
 *               phone_number:
 *                 type: string
 *                 example: +543769877665
 *               shift_type:
 *                 type: string
 *                 enum: [SINGLESHIFT, DOUBLESHIFT, CONTINUOUS]
 *                 example: DOUBLESHIFT
 *               average_stay_time:
 *                 type: integer
 *                 example: 30
 *               capacity:
 *                 type: integer
 *                 example: 100
 *               legal_info:
 *                 type: string
 *                 example: 00-00000000-0
 *               bank_info:
 *                 type: string
 *                 example: 00000000000000000000000000
 *               description:
 *                 type: string
 *                 example: La mejor cafetería de la zona. Servicio de alta calidad y café de especialidad
 *               price_range:
 *                 type: number
 *                 example: 2
 *               subcategory_name:
 *                 type: string
 *                 example: Cafetería de Especialidad
 *               main_category:
 *                 type: string
 *                 enum: [COMMERCE, SERVICE]
 *                 example: COMMERCE
 *     responses:
 *       201:
 *         description: Lista de negocios que cumplen con los filtros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: b6b88c6c-d1a4-4d2c-84f9-5b0fc02c9c3e
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                     example: b6b88c6c-d1a4-4d2c-84f9-5b0fc02c9c3e
 *                   name:
 *                     type: string
 *                     example: Lo de Pepe
 *                   phone_number:
 *                     type: string
 *                     example: +543769877665
 *                   shift_type:
 *                     type: string
 *                     example: DOUBLESHIFT
 *                   average_stay_time:
 *                     type: integer
 *                     example: 30
 *                   capacity:
 *                     type: integer
 *                     example: 100
 *                   legal_info:
 *                     type: string
 *                     example: 00-00000000-0
 *                   bank_info:
 *                     type: string
 *                     example: 00000000000000000000000000
 *                   description:
 *                     type: string
 *                     example: La mejor cafetería de la zona. Servicio de alta calidad y café de especialidad
 *                   price_range:
 *                     type: integer
 *                     example: 2
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-05-09 20:07:47.000000
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-05-09 20:07:47.000000
 *                   subcategory:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: b6b88c6c-d1a4-4d2c-84f9-5b0fc02c9c3e
 *                       name:
 *                         type: string
 *                         example: Cafetería de Especialidad
 *                       main_category:
 *                         type: string
 *                         example: COMMERCE
 *                   schedules:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         open_time:
 *                           type: string
 *                           example: "07:00:00"
 *                         close_time:
 *                           type: string
 *                           example: "11:30:00"
 *       500:
 *         description: Error interno del servidor
 */
shopRoutes.post("/filtered", validateSchemaPartial(filterShopSchema), shopsController.getAllByFilters);
shopRoutes.post("/filtered-user", validateSchemaPartial(filterShopSchemaUser), shopsController.getAllByFiltersUser);
shopRoutes.get("/", shopsController.getAll);
shopRoutes.get("/public", shopsController.getAllPublic);
shopRoutes.get("/public/:id", shopsController.getByIdPublic);
shopRoutes.get("/:id", shopsController.getById);
shopRoutes.patch("/:id", validateSchemaPartial(shopsSchema), shopsController.editById);
shopRoutes.delete("/:id", shopsController.deleteById);



