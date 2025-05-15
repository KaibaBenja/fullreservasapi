import express from "express";
import { upload } from "../../../middlewares/upload";
import { validateSchema } from "../../../middlewares/validateSchema";
import imagesController from "../controllers/images.controller";
import { imagesSchema } from "../schemas/images.schema";

export const imagesRoutes = express.Router();
/**
 * @swagger
 * tags:
 *  name: Images
 *  description: Imagenes de comercios
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      Images:
 *          type: object
 *          required:
 *              - id
 *              - shop_id
 *              - image_url
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              image_url:
 *                  type: string
 *                  format: uri
 *                  example: https://example.com/logos/merchant2.png
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id: 550e8400-e29b-41d4-a716-446655440000
 *              image_url: https://example.com/logos/merchant2.png
 */

/**
 * @swagger
 * /api/shops/images:
 *   post:
 *     summary: Sube una o varias imágenes asociadas a un negocio
 *     tags: [Images]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - shop_id
 *               - image_url
 *             properties:
 *               shop_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del negocio al que se asocian las imágenes
 *               image_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos de imagen a subir (máximo 5)
 *     responses:
 *       201:
 *         description: Imágenes subidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imágenes agregadas exitosamente
 *                 images:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Images'
 *       400:
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe subir un archivo.
 *       404:
 *         description: Las imágenes no pudieron ser recuperadas luego de la carga
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al encontrar las imagenes subidas.
 *       500:
 *         description: Error interno del servidor
 */
imagesRoutes.post("/", upload("images").array("image_url", 5), validateSchema(imagesSchema), imagesController.create);
/**
 * @swagger
 * /api/shops/images:
 *   get:
 *     summary: Obtiene todas las imágenes o solo las asociadas a un negocio específico
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: shop_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: ID del negocio para filtrar las imágenes
 *     responses:
 *       200:
 *         description: Lista de imágenes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Images'
 *       400:
 *         description: El parámetro shop_id no es un UUID válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El id proporcionado no es un UUID válido.
 *       500:
 *         description: Error interno del servidor
 */
imagesRoutes.get("/", imagesController.getAll);
/**
 * @swagger
 * /api/shops/images/{id}:
 *   get:
 *     summary: Obtiene una imagen específica por su ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la imagen
 *     responses:
 *       200:
 *         description: Imagen encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Images'
 *       400:
 *         description: El ID no es un UUID válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El id proporcionado no es un UUID válido.
 *       404:
 *         description: Imagen no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La imagen con el id {id} no existe.
 *       500:
 *         description: Error interno del servidor
 */
imagesRoutes.get("/:id", imagesController.getById);
/**
 * @swagger
 * /api/shops/images/{id}:
 *   patch:
 *     summary: Actualiza una imagen existente por su ID
 *     tags: [Images]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la imagen a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image_url:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen a subir (opcional)
 *     responses:
 *       200:
 *         description: Imagen actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Images'
 *       400:
 *         description: Error de validación o falta de datos para actualizar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se pudo actualizar la imagen.
 *       404:
 *         description: Imagen no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La imagen con el id {id} no existe.
 *       500:
 *         description: Error interno del servidor
 */
imagesRoutes.patch("/:id", upload("images").single("image_url"), imagesController.editById);
/**
 * @swagger
 * /api/shops/images/{id}:
 *   delete:
 *     summary: Elimina una imagen por ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la imagen a eliminar
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Images'
 *       404:
 *         description: Imagen no encontrada o error al eliminar de la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La imagen con el id {id} no existe.
 *       500:
 *         description: Error interno al eliminar la imagen o al eliminar el archivo en R2
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la imagen anterior.
 */
imagesRoutes.delete("/:id", imagesController.deleteById);
/**
 * @swagger
 * /api/shops/images/all/{shop_id}:
 *   delete:
 *     summary: Elimina todas las imágenes asociadas a una tienda
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: shop_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tienda (shop) de la cual se eliminarán todas las imágenes
 *     responses:
 *       200:
 *         description: Imágenes eliminadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Images'
 *       404:
 *         description: No se encontraron imágenes para esta tienda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontraron imágenes de esta tienda.
 *       500:
 *         description: Error interno al eliminar las imágenes o los archivos en R2
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor.
 */
imagesRoutes.delete("/all/:shop_id", imagesController.deleteAllByShopId);
