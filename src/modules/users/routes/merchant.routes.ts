import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { merchantsSchema } from "../schemas/merchants.schema";
import merchantsController from "../controllers/merchant.controller";
import { upload } from "../../../middlewares/upload";

export const merchantsRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Merchant_settings:
 *          type: object
 *          required:
 *              - id
 *              - user_id
 *              - main_category
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              user_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              logo_url:
 *                  type: string
 *                  format: uri
 *                  example: https://example.com/logos/merchant2.png
 *              main_category:
 *                  type: string
 *                  enum: [COMMERCE, SERVICE]
 *                  example: SERVICE
 *              created_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *              updated_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              user_id: 550e8400-e29b-41d4-a716-446655440000
 *              logo_url: https://example.com/logos/merchant2.png
 *              main_category: SERVICE
 *              created_at: 2025-05-09 20:07:47.000000
 *              updated_at: 2025-05-09 20:07:47.000000
 */

/**
 * @swagger
 * tags:
 *  name: Merchant
 *  description: Configuración de Comerciantes
 */

/**
 * @swagger
 * /api/users/merchants:
 *  post:
 *      summary: Registra/Crea un nuevo comerciante
 *      tags: [Merchant]
 *      consumes:
 *          - multipart/form-data
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - user_id
 *                          - main_category
 *                      properties:
 *                          logo_url:
 *                              type: string
 *                              format: binary
 *                              description: Logo opcional del comerciante
 *                          user_id:
 *                              type: string
 *                              format: uuid
 *                              example: 550e8400-e29b-41d4-a716-446655440000
 *                          main_category:
 *                              type: string
 *                              enum: [COMMERCE, SERVICE]
 *                              example: SERVICE
 *      responses:
 *          201:
 *              description: Comerciante creado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Comerciante creado exitosamente.
 *                              merchant_settings:
 *                                  $ref: '#/components/schemas/Merchant_settings'
 *                                          
 *          400:
 *              description: Error de validación o datos incorrectos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El comerciante ya existe"
 *          404:
 *              description: Comerciante no encontrado luego de crearlo
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Error al encontrar el comerciante agregado.
 *          409:
 *              description: Conflicto con el rol MERCHANT
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "El usuario no posee el rol MERCHANT"
 *          500:
 *              description: Error interno del servidor.
 * 
 */
merchantsRoutes.post("/", upload("merchants").single("logo_url"), validateSchema(merchantsSchema), merchantsController.create);
/**
 * @swagger
 * /api/users/merchants:
 *   get:
 *     summary: Obtiene todos los comerciantes o uno específico por user_id
 *     tags: [Merchant]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *           description: El id del usuario
 *     responses:
 *       200:
 *         description: Lista de comerciantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/Users'
 *                   merchant_settings:
 *                     $ref: '#/components/schemas/Merchant_settings'
 *       404:
 *         description: El merchant no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El usuario con el id no existe."
 *       500:
 *         description: Error interno del servidor
 */
merchantsRoutes.get("/", merchantsController.getAll);
/**
 * @swagger
 * /api/users/merchants/{id}:
 *   get:
 *     summary: Obtiene un comerciante por su ID
 *     tags: [Merchant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del comerciante
 *     responses:
 *       200:
 *         description: Comerciante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Merchant_settings'
 *       404:
 *         description: Comerciante no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El comerciante con el id no existe.
 *       500:
 *         description: Error interno del servidor
 */
merchantsRoutes.get("/:id", merchantsController.getById);
/**
 * @swagger
 * /api/users/merchants/{id}:
 *   patch:
 *     summary: Edita un comerciante por su ID
 *     tags: [Merchant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del comerciante
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               main_category:
 *                 type: string
 *                 enum: [COMMERCE, SERVICE]
 *               logo_url:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Comerciante actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Merchant_settings'
 *       400:
 *         description: Solicitud inválida (campos faltantes o inválidos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe enviar al menos un campo para actualizar.
 *       404:
 *         description: Comerciante no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El comerciante con el id no existe.
 *       500:
 *         description: Error interno del servidor
 */
merchantsRoutes.patch("/:id", upload("merchants").single("logo_url"), validateSchemaPartial(merchantsSchema), merchantsController.editById);
/**
 * @swagger
 * /api/users/merchants/{id}:
 *   delete:
 *     summary: Elimina un comerciante por su ID
 *     tags: [Merchant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del comerciante a eliminar
 *     responses:
 *       200:
 *         description: Comerciante eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Merchant_settings'
 *       400:
 *         description: Error al eliminar el comerciante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el comerciante.
 *       404:
 *         description: Comerciante no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El comerciante con el id no existe.
 *       500:
 *         description: Error interno del servidor
 */
merchantsRoutes.delete("/:id", merchantsController.deleteById);
