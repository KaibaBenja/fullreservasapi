import express from "express";
import subcategoriesController from "../controllers/subcategories.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { subcategoriesSchema } from "../schemas/subcategories.schema";
import { upload } from "../../../middlewares/upload";

export const subcategoriesRoutes = express.Router();
/**
 * @swagger
 * tags:
 *  name: Subcategory
 *  description: Subcategorías de comercios
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      Subcategories:
 *          type: object
 *          required:
 *              - id
 *              - name
 *              - main_category
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              name:
 *                  type: string
 *                  example: Restaurante Italiano
 *              main_category:
 *                  type: string
 *                  enum: [COMMERCE, SERVICE]
 *                  example: COMMERCE
 *              logo_url:
 *                  type: string
 *                  format: uri
 *                  example: https://example.com/logos/merchant2.png
 *              created_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *              updated_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              name: Restaurante Italiano
 *              main_category: COMMERCE
 *              logo_url: https://example.com/logos/merchant2.png
 *              created_at: 2025-05-09 20:07:47.000000
 *              updated_at: 2025-05-09 20:07:47.000000
 */

/**
 * @swagger
 * /api/shops/subcategories:
 *   post:
 *     summary: Crea una nueva subcategoría
 *     tags: [Subcategory]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - main_category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Restaurante Italiano
 *               main_category:
 *                 type: string
 *                 enum: [COMMERCE, SERVICE]
 *                 example: COMMERCE
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Subcategoría agregada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: subcategoría agregada exitosamente
 *                 subcategory:
 *                   $ref: '#/components/schemas/Subcategories'
 *       400:
 *         description: Error al agregar la subcategoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al agregar la subcategoría.
 *       404:
 *         description: Error al encontrar la subcategoría agregada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al encontrar la subcategoría agregada.
 *       409:
 *         description: La subcategoría ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La subcategoría Restaurante italiano ya existe.
 *       500:
 *         description: Error interno del servidor
 */
subcategoriesRoutes.post("/",  upload("subcategories").single("logo"),  validateSchema(subcategoriesSchema), subcategoriesController.create);
/**
 * @swagger
 * /api/shops/subcategories:
 *   get:
 *     summary: Obtiene todas las subcategorías, opcionalmente filtradas por main_category
 *     tags: [Subcategory]
 *     parameters:
 *       - in: query
 *         name: main_category
 *         schema:
 *           type: string
 *           enum: [COMMERCE, SERVICE]
 *         description: Opcaional filtrar por tipo de categoría principal
 *     responses:
 *       200:
 *         description: Lista de subcategorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subcategories'
 *       400:
 *         description: main_category inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: main_category inválido.
 *       500:
 *         description: Error interno del servidor
 */
subcategoriesRoutes.get("/", subcategoriesController.getAll);
/**
 * @swagger
 * /api/shops/subcategories/{id}:
 *   get:
 *     summary: Obtiene una subcategoría por su ID
 *     tags: [Subcategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la subcategoría
 *     responses:
 *       200:
 *         description: Subcategoría encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategories'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID inválido.
 *       404:
 *         description: Subcategoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La subcategoría con el id {id} no existe.
 *       500:
 *         description: Error interno del servidor
 */
subcategoriesRoutes.get("/:id", subcategoriesController.getById);
/**
 * @swagger
 * /api/shops/subcategories/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una subcategoría por ID
 *     tags: [Subcategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la subcategoría a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Restaurante Italiano
 *               main_category:
 *                 type: string
 *                 enum: [COMMERCE, SERVICE]
 *                 example: COMMERCE
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Subcategoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategories'
 *       400:
 *         description: Petición inválida o error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe enviar al menos un campo para actualizar.
 *       404:
 *         description: Subcategoría no encontrada o nombre ya en uso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La subcategoría Moda ya existe.
 *       500:
 *         description: Error interno del servidor
 */
subcategoriesRoutes.patch("/:id", upload("subcategories").single("logo"), validateSchemaPartial(subcategoriesSchema), subcategoriesController.editById);
/**
 * @swagger
 * /api/shops/subcategories/{id}:
 *   delete:
 *     summary: Elimina una subcategoría por ID
 *     tags: [Subcategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la subcategoría a eliminar
 *     responses:
 *       200:
 *         description: Subcategoría eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategories'
 *       404:
 *         description: Subcategoría no encontrada o no se pudo eliminar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La subcategoría con el id {id} no existe.
 *       500:
 *         description: Error interno del servidor
 */
subcategoriesRoutes.delete("/:id", subcategoriesController.deleteById);


