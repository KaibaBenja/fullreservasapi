import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import bookingsController from "../controllers/bookings.controller";
import { bookingSchema, bookingSchemaFiter } from "../schemas/bookings.schema";

export const bookingRoutes = express.Router();
/**
 * 
 * @swagger
 * components:
 *   schemas:
 *     Bookings:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - shop_id
 *         - booked_slot_id
 *         - date
 *         - guests
 *         - location_type
 *         - floor
 *         - roof_type
 *         - status
 *         - booking_code
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: binary
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         user_id:
 *           type: binary
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         shop_id:
 *           type: binary
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         booked_slot_id:
 *           type: binary
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         date:
 *           type: datetime
 *           example: 25/05/2025 11:00:00.000
 *         guests:
 *           type: integer
 *           example: 2
 *         location_type:
 *           type: string
 *           enum: [INSIDE, OUTSIDE]
 *           example: INSIDE
 *         floor:
 *           type: string
 *           enum: [GROUND LEVEL, UPPER LEVEL]
 *           example: GROUND LEVEL
 *         roof_type:
 *           type: string
 *           enum: [COVERED, UNCOVERED]
 *           example: COVERED
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *           example: PENDING
 *         booking_code:
 *           type: integer
 *           example: 5431
 *         created_at:
 *           type: datetime
 *           example: 25/05/2025 11:00:00.000
 *         updated_at:
 *           type: datetime
 *           example: 25/05/2025 11:00:00.000
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440000
 *         user_id: 550e8400-e29b-41d4-a716-446655440000
 *         shop_id: 550e8400-e29b-41d4-a716-446655440000
 *         booked_slot_id: 550e8400-e29b-41d4-a716-446655440000
 *         date: 25-05-2025 11:00:00.000
 *         guests: 2
 *         location_type: INSIDE
 *         floor: GROUND LEVEL
 *         roof_type: COVERED
 *         status: PENDING
 *         booking_code: 5431
 *         created_at: 25-05-2025 11:00:00.000
 *         updated_at: 25-05-2025 11:00:00.000
 */

/**
 * @swagger
 * tags:
 *  name: Booking
 *  description: Reservas de comercios
 */

/**
 * @swagger
 * /api/bookings/details:
 *  post:
 *      summary: Crea una nueva reserva
 *      tags: [Booking]
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
 *                              type: string
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
bookingRoutes.post("/", validateSchema(bookingSchema), bookingsController.create);
bookingRoutes.post("/filtered", validateSchemaPartial(bookingSchemaFiter), bookingsController.getAllByFilters);
bookingRoutes.post("/filtered-shop/:shop_id", validateSchemaPartial(bookingSchemaFiter), bookingsController.getAllByFiltersShopId);
bookingRoutes.post("/filtered-user/:user_id", validateSchemaPartial(bookingSchemaFiter), bookingsController.getAllByFiltersUserId);
bookingRoutes.get("/", bookingsController.getAll);
bookingRoutes.get("/:id", bookingsController.getById);
bookingRoutes.patch("/:id", validateSchemaPartial(bookingSchemaFiter), bookingsController.editById);
bookingRoutes.patch("/confirm/:code", bookingsController.confirmByCode);
bookingRoutes.delete("/:id", bookingsController.deleteById);
