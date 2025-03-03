import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { R2 } from "../../../config/dotenv.config";
import { CloudFlareS3 } from "../../../config/cloudflare.config";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;
    const files = req.files as Express.MulterS3.File[];

    if (!files || files.length === 0)
      return handleErrorResponse(res, 400, "Debe subir un archivo.");

    const imagesCreated = await Promise.all(
      files.map(async (file: Express.MulterS3.File) => {
        // Obtenemos la URL del archivo con la función auxiliar del middleware
        const imageUrl = file.location;

        const imageCreated = await shopsServices.images.add({
          shop_id,
          image_url: imageUrl,
        });

        if (!imageCreated)
          throw new Error(
            `Error al guardar la referencia de la imagen en la base de datos.`
          );

        return imageCreated;
      })
    );

    if (!imagesCreated.length)
      return handleErrorResponse(res, 400, "Error al registrar las imágenes");

    res.status(201).json({
      message: "Imágenes agregadas exitosamente",
      images: imagesCreated,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let result;

    if (shop_id && typeof shop_id === "string") {
      if (!validateUUID(shop_id, res)) return;

      const shopFound = await shopsServices.shops.getById(shop_id);
      if (!shopFound)
        return handleErrorResponse(
          res,
          404,
          `El negocio con el id: ${shop_id} no existe.`
        );

      result = await shopsServices.images.getByShopId(shop_id);
    } else {
      result = await shopsServices.images.getAll();
    }

    if (!result)
      return handleErrorResponse(res, 204, "No se encontraron imágenes.");

    res
      .status(200)
      .json({ message: "Imágenes obtenidas exitosamente", images: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound)
      return handleErrorResponse(
        res,
        404,
        `La imagen con el id: ${id} no existe.`
      );

    res
      .status(200)
      .json({ message: "Imagen encontrada exitosamente", image: imageFound });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { shop_id } = req.body;
    const file = req.file as Express.MulterS3.File;

    if (!validateUUID(id, res)) return;

    if ((!req.body || Object.keys(req.body).length === 0) && !file) {
      return handleErrorResponse(
        res,
        400,
        "Debe enviar al menos un campo para actualizar."
      );
    }

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound)
      return handleErrorResponse(
        res,
        404,
        `La imagen con el id: ${id} no existe.`
      );

    if (shop_id && !(await shopsServices.shops.getById(shop_id))) {
      return handleErrorResponse(
        res,
        404,
        `El negocio con el id: ${shop_id} no existe.`
      );
    }

    let imageUrl = imageFound.image_url;
    if (file) {
      // Si hay un nuevo archivo, primero eliminamos el anterior
      // Extrae el nombre del archivo de la URL (ahora incluye timestamp)
      const urlParts = imageFound.image_url.split("/");
      const oldFileName = urlParts[urlParts.length - 1];

      // Preparamos parámetros para eliminar
      const deleteParams = {
        Bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: `uploads/${oldFileName}`,
      };

      try {
        // Eliminamos el archivo anterior
        await CloudFlareS3.send(new DeleteObjectCommand(deleteParams));

        // El archivo nuevo ya está subido gracias al middleware upload
        imageUrl = file.location;
      } catch (error) {
        console.error("Error al eliminar imagen antigua:", error);
        // Continuamos aunque falle la eliminación, para actualizar con la nueva imagen
      }
    }

    const result = await shopsServices.images.editById({
      id,
      shop_id,
      image_url: imageUrl,
    });
    if (!result)
      return handleErrorResponse(res, 400, "No se pudo actualizar la imagen.");

    const imageUpdated = await shopsServices.images.getById(id);
    if (!imageUpdated)
      return handleErrorResponse(
        res,
        404,
        "Error al encontrar la imagen actualizada."
      );

    res
      .status(200)
      .json({ message: "Imagen editada exitosamente", image: imageUpdated });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound)
      return handleErrorResponse(
        res,
        404,
        `La imagen con el id: ${id} no existe.`
      );

    // Extrae el nombre del archivo de la URL (ahora incluye timestamp)
    const urlParts = imageFound.image_url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    // Preparamos parámetros para eliminar
    const deleteParams = {
      Bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: `uploads/${fileName}`,
    };

    try {
      // Eliminamos el archivo
      await CloudFlareS3.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      console.error("Error al eliminar imagen de S3:", error);
      return handleErrorResponse(
        res,
        500,
        "Error al eliminar la imagen de S3."
      );
    }

    const result = await shopsServices.images.deleteById(id);
    if (!result)
      return handleErrorResponse(
        res,
        404,
        "Error al eliminar la imagen de la base de datos."
      );

    res
      .status(200)
      .json({ message: "Imagen eliminada exitosamente", image: imageFound });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

export default { create, getAll, getById, editById, deleteById };
