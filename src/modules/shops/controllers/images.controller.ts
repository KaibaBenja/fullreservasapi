import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { R2 } from "../../../config/dotenv.config";
import { deleteFileR2 } from "../../../middlewares/upload";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;
    const files = req.files as Express.MulterS3.File[];

    if (!files || files.length === 0) return handleErrorResponse(res, 400, "Debe subir un archivo.");

    const imagesCreated = await Promise.all(
      files.map(async (file: Express.MulterS3.File) => {
        const imageUrl = `${R2.CLOUDFLARE_R2_PUBLIC_URL}/${file.key}`;

        const imageCreated = await shopsServices.images.add({
          shop_id,
          image_url: imageUrl,
        });

        if (!imageCreated) {
          throw new Error(
            `Error al guardar la referencia de la imagen en la base de datos.`
          );
        };

        return imageCreated;
      })
    );

    if (!imagesCreated.length) return handleErrorResponse(res, 400, "Error al registrar las imágenes");

    const imagesExists = await shopsServices.images.getByShopId(shop_id);
    if (!imagesExists) return handleErrorResponse(res, 404, `Error al encontrar las imagenes subidas.`)

    res.status(201).json({
      message: "Imágenes agregadas exitosamente",
      images: imagesExists,
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
    const file = req.file as Express.MulterS3.File;

    if (!validateUUID(id, res)) return;

    if ((!req.body || Object.keys(req.body).length === 0) && !file) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound) return handleErrorResponse(res, 404, `La imagen con el id: ${id} no existe.`);


    let image_url = imageFound.image_url;
    if (file) {
      if (image_url) {
        if (!(await deleteFileR2(image_url))) return handleErrorResponse(res, 500, "Error al eliminar la imagen anterior.");
      };

      image_url = `${R2.CLOUDFLARE_R2_PUBLIC_URL}/${file.key}`;
    }

    const result = await shopsServices.images.editById({ id, image_url });
    if (!result) return handleErrorResponse(res, 400, "No se pudo actualizar la imagen.");

    const imageUpdated = await shopsServices.images.getById(id);
    if (!imageUpdated) return handleErrorResponse(res, 404, "Error al encontrar la imagen actualizada.");

    res.status(200).json({
      message: "Imagen editada exitosamente", image: imageUpdated
    });
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


    if (imageFound.image_url && !(await deleteFileR2(imageFound.image_url))) {
      return handleErrorResponse(res, 500, "Error al eliminar la imagen anterior.");
    };

    const result = await shopsServices.images.deleteById(id);
    if (!result) return handleErrorResponse(res, 404, "Error al eliminar la imagen de la base de datos.");

    res.status(200).json({
      message: "Imagen eliminada exitosamente", image: imageFound
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const deleteAllByShopId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;
    if (!validateUUID(shop_id, res)) return;

    const images = await shopsServices.images.getByShopId(shop_id);

    if (!images || images.length === 0) return handleErrorResponse(res, 404, `No se encontraron imágenes de esta tienda.`);

    const deleteResults = await Promise.all(
      images.map(async (image) => {
        try {
          if (image.image_url) {
            const deleted = await deleteFileR2(image.image_url);
            return { id: image.id, deleted: deleted };
          };
          return { id: image.id, deleted: false };
        } catch (error) {
          return { id: image.id, deleted: false };
        };
      })
    );

    const result = await shopsServices.images.deleteByShopId(shop_id);
    if (!result || !result.success) return handleErrorResponse(res, 500, "Se eliminaron algunos archivos pero hubo un error al eliminar los registros de la base de datos.");


    const successCount = deleteResults.filter(r => r.deleted).length;
    const failCount = deleteResults.length - successCount;

    res.status(200).json({
      message: `Imágenes eliminadas exitosamente. (${successCount} eliminadas, ${failCount} con errores)`,
      shop_id: shop_id,
      deletedCount: result.deletedCount || successCount,
      failedCount: failCount
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};



export default { create, getAll, getById, editById, deleteById, deleteAllByShopId };
