import express from "express";
import { validateSchemaPartial } from "../../../middlewares/validateSchema";
import schedulesController from "../controllers/schedules.controller";
import { schedulesSchema } from "../schemas/schedules.schema ";

export const schedulesRoutes = express.Router();
/**
 * @swagger
 * tags:
 *  name: Schedule
 *  description: Imagenes de comercios
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      Schedules:
 *          type: object
 *          required:
 *              - id
 *              - shop_id
 *              - open_time
 *              - close_time
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              open_time:
 *                  type: time
 *                  pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                  format: "HH:MM:SS"
 *                  example: "12:00:00"
 *              close_time:
 *                  type: time
 *                  pattern: "^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
 *                  format: "HH:MM:SS"
 *                  example: "18:30:00"
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id: 550e8400-e29b-41d4-a716-446655440000
 *              open_time: "12:00:00"
 *              close_time: "18:30:00"
 */
/**
 * @swagger
 * /api/shops/schedules:
 *   get:
 *     summary: Obtiene todos los horarios o los de un negocio específico si se pasa shop_id
 *     tags:
 *       - Schedule
 *     parameters:
 *       - in: query
 *         name: shop_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del negocio (shop) para filtrar los horarios
 *     responses:
 *       200:
 *         description: Lista de horarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedules'
 *       400:
 *         description: shop_id inválido (si no es UUID)
 *       500:
 *         description: Error interno del servidor
 */
schedulesRoutes.get("/", schedulesController.getAll);
/**
 * @swagger
 * /api/shops/schedules/{id}:
 *   get:
 *     summary: Obtiene un horario específico por su ID
 *     tags:
 *       - Schedule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del horario a obtener
 *     responses:
 *       201:
 *         description: Horario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedules'
 *       400:
 *         description: ID inválido (no es un UUID)
 *       404:
 *         description: No se encontró un horario con ese ID
 *       500:
 *         description: Error interno del servidor
 */
schedulesRoutes.get("/:id", schedulesController.getById);
/**
 * @swagger
 * /api/shops/schedules/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un horario por su ID
 *     tags:
 *       - Schedule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del horario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               open_time:
 *                 type: string
 *                 example: "08:00:00"
 *                 description: Hora de apertura (formato HH:mm:ss)
 *               close_time:
 *                 type: string
 *                 example: "18:00:00"
 *                 description: Hora de cierre (formato HH:mm:ss)
 *     responses:
 *       200:
 *         description: Horario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedules'
 *       400:
 *         description: Datos inválidos o no se pudo actualizar
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
schedulesRoutes.patch("/:id", validateSchemaPartial(schedulesSchema), schedulesController.editById);
/**
 * @swagger
 * /api/shops/schedules/{shop_id}:
 *   delete:
 *     summary: Elimina todos los horarios de un negocio por su shop_id
 *     tags:
 *       - Schedule
 *     parameters:
 *       - in: path
 *         name: shop_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del negocio del cual eliminar los horarios
 *     responses:
 *       200:
 *         description: Horarios eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedules'
 *       404:
 *         description: No se encontraron horarios para el shop_id especificado o error al eliminar
 *       500:
 *         description: Error interno del servidor
 */
schedulesRoutes.delete("/:id", schedulesController.deleteById);