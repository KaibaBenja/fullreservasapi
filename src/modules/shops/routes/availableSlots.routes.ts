import express from "express";
import { validateSchemaPartial } from "../../../middlewares/validateSchema";
import availableSlotsController from "../controllers/availableSlots.controller";
import { availableSlotsSchema } from "../schemas/availableSlots.schema";

export const availableSlotsRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Available_slots:
 *          type: object
 *          required:
 *              - id
 *              - shop_id
 *              - start_time
 *              - end_time
 *              - capacity
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              start_time:
 *                  type: time
 *                  pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                  format: "HH:MM:SS"
 *                  example: "12:00:00"
 *              end_time:
 *                  type: time
 *                  pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                  format: "HH:MM:SS"
 *                  example: "18:30:00"
 *              capacity:
 *                  type: integer
 *                  example: 100
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id: 550e8400-e29b-41d4-a716-446655440000
 *              start_time: 12:00:00
 *              end_time: 18:30:00
 *              capacity: 100
 */

/**
 * @swagger
 * tags:
 *  name: AvailableSlot
 *  description: Horarios de disponibilidad de comercios fraccionados por tiempo medio de permanencia
 */
/**
 * @swagger
 * /api/shops/availableSlots:
 *   get:
 *     summary: Obtiene todos los espacios disponibles o los de un negocio específico
 *     tags:
 *       - AvailableSlot
 *     parameters:
 *       - in: query
 *         name: shop_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del negocio (UUID) para filtrar los espacios disponibles
 *     responses:
 *       200:
 *         description: Lista de espacios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Available_slots'
 *       400:
 *         description: El parámetro shop_id no es un UUID válido
 *       500:
 *         description: Error interno del servidor
 */
availableSlotsRoutes.get("/", availableSlotsController.getAll);
/**
 * @swagger
 * /api/shops/availableSlots/filtered/{shop_id}:
 *   post:
 *     summary: Obtiene espacios disponibles filtrados por negocio
 *     tags:
 *       - AvailableSlot
 *     parameters:
 *       - in: path
 *         name: shop_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del negocio (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                 example: "12:00:00"
 *               end_time:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                 example: "18:00:00"
 *               capacity:
 *                 type: integer
 *                 maximum: 50
 *                 example: 30
 *     responses:
 *       201:
 *         description: Lista de espacios disponibles filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Available_slots'
 *       400:
 *         description: Datos inválidos o faltantes en el cuerpo de la solicitud
 *       500:
 *         description: Error interno del servidor
 */
availableSlotsRoutes.post("/filtered/:shop_id", validateSchemaPartial(availableSlotsSchema), availableSlotsController.getAllByFilters);
/**
 * @swagger
 * /api/shops/availableSlots/{id}:
 *   get:
 *     summary: Obtiene un espacio disponible por su ID
 *     tags:
 *       - AvailableSlot
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del espacio disponible (UUID)
 *     responses:
 *       201:
 *         description: Espacio disponible encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Available_slots'
 *       404:
 *         description: No se encontró el espacio disponible con ese ID
 *       500:
 *         description: Error interno del servidor
 */
availableSlotsRoutes.get("/:id", availableSlotsController.getById);
/**
 * @swagger
 * /api/shops/availableSlots/{id}:
 *   patch:
 *     summary: Edita un espacio disponible por su ID
 *     tags:
 *       - AvailableSlot
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del espacio disponible (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_id:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               start_time:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                 example: "10:00:00"
 *               end_time:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                 example: "18:00:00"
 *               capacity:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Espacio disponible actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Available_slots'
 *       400:
 *         description: Error de validación o datos inválidos
 *       404:
 *         description: No se encontró el espacio disponible con ese ID
 *       500:
 *         description: Error interno del servidor
 */
availableSlotsRoutes.patch("/:id", validateSchemaPartial(availableSlotsSchema), availableSlotsController.editById);
/**
 * @swagger
 * /api/shops/availableSlots/{shop_id}:
 *   delete:
 *     summary: Elimina todos los espacios disponibles de un negocio por su shop_id
 *     tags:
 *       - AvailableSlot
 *     parameters:
 *       - in: path
 *         name: shop_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del negocio (shop)
 *     responses:
 *       200:
 *         description: Espacios disponibles eliminados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Available_slots'
 *       404:
 *         description: No se encontraron espacios disponibles con ese shop_id
 *       500:
 *         description: Error interno del servidor
 */
availableSlotsRoutes.delete("/:id", availableSlotsController.deleteById);
