import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { uploadFileToS3, deleteFileFromS3 } from "../../../middlewares/upload";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;
    const files = req.files as Express.MulterS3.File[];

    if (!files) return handleErrorResponse(res, 400, "Debe subir un archivo.");

    const filesUploaded = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const fileUploaded = await uploadFileToS3(file);

        if (!fileUploaded) throw new Error(`Error al subir la imagen: ${file.originalname}.`);

        await shopsServices.images.add({
          shop_id,
          image_url: fileUploaded.signedUrl,
        });

        return fileUploaded;
      })
    );

    if (!filesUploaded.length) return handleErrorResponse(res, 400, "Error al subir TODOS los archivos");

    const imagesExists = await Promise.all(
      filesUploaded.map(async (image) => {
        const imageExists = await shopsServices.images.lastCreatedEntry({
          shop_id,
          image_url: image.signedUrl,
        });

        if (!imageExists) throw new Error("Error al encontrar la imagen agregada.");

        return imageExists;
      })
    );

    res.status(201).json({ message: "Imagen agregada exitosamente", images: imagesExists });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let result;

    if (shop_id && typeof shop_id === "string") {
      if (!validateUUID(shop_id, res)) return;

      const shopFound = await shopsServices.shops.getById(shop_id);
      if (!shopFound) return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);

      result = await shopsServices.images.getByShopId(shop_id);
    } else { result = await shopsServices.images.getAll(); };

    if (!result) return handleErrorResponse(res, 204, "No se encontraron imágenes.");

    res.status(200).json({ message: "Imágenes obtenidas exitosamente", images: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound) return handleErrorResponse(res, 404, `La imagen con el id: ${id} no existe.`);


    res.status(200).json({ message: "Imagen encontrada exitosamente", image: imageFound });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { shop_id } = req.body;
    const file = req.file;

    if (!validateUUID(id, res)) return;

    if ((!req.body || Object.keys(req.body).length === 0) && !file) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound) return handleErrorResponse(res, 404, `La imagen con el id: ${id} no existe.`);


    if (shop_id && !(await shopsServices.shops.getById(shop_id))) {
      return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);
    };

    let imageUrl = imageFound.image_url;
    if (file) {
      const imageDeleted = await deleteFileFromS3(imageFound.image_url);
      if (!imageDeleted) return handleErrorResponse(res, 500, "Error al eliminar la imagen anterior.");

      const fileUploaded = await uploadFileToS3(file);
      if (!fileUploaded) return handleErrorResponse(res, 500, `Error al subir la nueva imagen: ${file.originalname}.`);

      imageUrl = fileUploaded.signedUrl;
    };

    const result = await shopsServices.images.editById({ id, shop_id, image_url: imageUrl });
    if (!result) return handleErrorResponse(res, 400, "No se pudo actualizar la imagen.");

    const imageUpdated = await shopsServices.images.getById(id);
    if (!imageUpdated) return handleErrorResponse(res, 404, "Error al encontrar la imagen actualizada.");

    res.status(200).json({ message: "Imagen editada exitosamente", image: imageUpdated });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound) return handleErrorResponse(res, 404, `La imagen con el id: ${id} no existe.`);

    if (!(await deleteFileFromS3(imageFound.image_url))) {
      return handleErrorResponse(res, 500, "Error al eliminar la imagen.");
    };

    const result = await shopsServices.images.deleteById(id);
    if (!result) return handleErrorResponse(res, 404, "Error al eliminar la imagen.");

    res.status(200).json({ message: "Imagen eliminada exitosamente", image: imageFound });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

export default { create, getAll, getById, editById, deleteById };
