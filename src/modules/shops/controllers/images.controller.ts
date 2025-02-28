import { Request, Response } from "express";
import * as shopsServices from "../services";
import {
  handleErrorResponse,
  validateUUID,
} from "../../../utils/uuidValidator";
import {
  deleteFileFromS3,
  uploadFileMiddleware,
} from "../../../middlewares/upload";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;
    if (!req.file)
      return handleErrorResponse(res, 400, "No se pudo subir la imagen.");
    const { signedUrl } = await uploadFileMiddleware(req);
    const shopFound = await shopsServices.shops.getById(shop_id);
    if (!shopFound)
      return handleErrorResponse(
        res,
        404,
        `El negocio con el id: ${shop_id} no existe.`
      );

    const result = await shopsServices.images.add({
      shop_id,
      image_url: signedUrl,
    });
    if (!result)
      return handleErrorResponse(res, 400, "Error al agregar la imagen.");

    const imageExists = await shopsServices.images.lastCreatedEntry({
      shop_id,
      image_url: signedUrl,
    });
    if (!imageExists)
      return handleErrorResponse(
        res,
        404,
        "Error al encontrar la imagen agregada."
      );

    res
      .status(201)
      .json({ message: "Imagen agregada exitosamente", image: imageExists });
  } catch (error) {
    console.error(error);
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
    const { shop_id, image_url } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(
        res,
        400,
        "Debe enviar al menos un campo para actualizar."
      );
    }

    if (!validateUUID(id, res)) return;

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

    if (image_url && (await shopsServices.images.getByImageUrl(image_url))) {
      return handleErrorResponse(res, 409, "La imagen ya existe.");
    }

    const result = await shopsServices.images.editById({ id, ...req.body });
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

    try {
      await deleteFileFromS3(imageFound.image_url);
    } catch (error) {
      return handleErrorResponse(res, 500, "Error al eliminar la imagen.");
    }

    const result = await shopsServices.images.deleteById(id);
    if (!result)
      return handleErrorResponse(res, 404, "Error al eliminar la imagen.");

    res
      .status(200)
      .json({ message: "Imagen eliminada exitosamente", image: imageFound });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

export default { create, getAll, getById, editById, deleteById };
