import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import shopsAddressesController from "../controllers/shopsAddresses.controller";
import { shopsAddressesSchema } from "../schemas/shopsAddresses.schema";

export const shopsAddressesRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Shopsaddresses:
 *          type: object
 *          required:
 *              - id
 *              - address_id
 *              - shop_id
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              user_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              address_id: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id: 550e8400-e29b-41d4-a716-446655440000
 */

/**
 * @swagger
 * tags:
 *  name: ShopAddress
 *  description: Direcciones de los Comercios
 */
/**
 * @swagger
 * /api/shops/addresses:
 *   post:
 *     summary: Asocia una dirección existente a un negocio
 *     tags: [ShopAddress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shop_id
 *               - address_id
 *             properties:
 *               shop_id:
 *                 type: string
 *                 format: uuid
 *                 example: 6bf0d3f6-2f62-11f0-9510-a2aa39943847
 *               address_id:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Dirección del negocio agregada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dirección del negocio agregada exitosamente.
 *                 shopAddress:
 *                   $ref: '#/components/schemas/Shopsaddresses'
 *       400:
 *         description: Error al agregar la dirección del negocio
 *       404:
 *         description: El negocio o la dirección no existen, o no se encontró la dirección agregada
 *       409:
 *         description: La dirección del negocio ya existe
 *       500:
 *         description: Error interno del servidor
 */
shopsAddressesRoutes.post("/", validateSchema(shopsAddressesSchema), shopsAddressesController.create);
/**
 * @swagger
 * /api/shops/addresses:
 *   get:
 *     summary: Obtiene todas las direcciones asociadas a negocios
 *     tags: [ShopAddress]
 *     responses:
 *       201:
 *         description: Lista de direcciones de negocios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shopsaddresses'
 *       500:
 *         description: Error interno del servidor
 */
shopsAddressesRoutes.get("/", shopsAddressesController.getAll);
/**
 * @swagger
 * /api/shops/addresses/{id}:
 *   get:
 *     summary: Obtiene una dirección de negocio por ID
 *     tags: [ShopAddress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dirección del negocio
 *     responses:
 *       201:
 *         description: Dirección del negocio encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shopsaddresses'
 *       404:
 *         description: Dirección del negocio no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La dirección de negocio con el id no existe.
 *       500:
 *         description: Error interno del servidor
 */
shopsAddressesRoutes.get("/:id", shopsAddressesController.getById);
/**
 * @swagger
 * /api/shops/addresses/{id}:
 *   patch:
 *     summary: Edita una dirección de negocio por ID
 *     tags: [ShopAddress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dirección del negocio a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_id:
 *                 type: string
 *                 format: uuid
 *                 example: 67ae1593-9b26-4f52-b4f0-37661fdc80a2
 *     responses:
 *       200:
 *         description: Dirección del negocio actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shopsaddresses'
 *       400:
 *         description: Error en la solicitud o datos inválidos
 *       404:
 *         description: Dirección de negocio no encontrada
 *       500:
 *         description: Error interno del servidor
 */

shopsAddressesRoutes.patch("/:id", validateSchemaPartial(shopsAddressesSchema), shopsAddressesController.editById);
/**
 * @swagger
 * /api/shops/addresses/{id}:
 *   delete:
 *     summary: Elimina una dirección de negocio por ID
 *     tags: [ShopAddress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dirección del negocio a eliminar
 *     responses:
 *       200:
 *         description: Dirección del negocio eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shopsaddresses'
 *       404:
 *         description: Dirección del negocio no encontrada
 *       400:
 *         description: Error al eliminar la dirección del negocio
 *       500:
 *         description: Error interno del servidor
 */
shopsAddressesRoutes.delete("/:id", shopsAddressesController.deleteById);


