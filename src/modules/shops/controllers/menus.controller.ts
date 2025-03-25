import { Request, Response } from "express";
import * as shopsServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import { R2 } from "../../../config/dotenv.config";
import { deleteFileR2 } from "../../../middlewares/upload";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;
    const file = req.file as Express.MulterS3.File;

    if (!await shopsServices.shops.getById({ id: shop_id })) {
      return handleErrorResponse(res, 400, `El negocio con el id: ${shop_id} no existe.`);
    };

    const file_url = `${R2.CLOUDFLARE_R2_PUBLIC_URL}/${file.key}`;

    const data = { ...req.body, file_url };

    if (!await shopsServices.menus.add(data)) {
      return handleErrorResponse(res, 400, `Error al agregar el menú.`);
    };

    const result = await shopsServices.menus.getByImageUrl({ file_url });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el menú agregado.`);

    res.status(201).json({
      message: "Menú creado exitosamente.",
      menu: result,
    });
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

      result = await shopsServices.menus.getByShopId({ shop_id });
    } else {
      result = await shopsServices.menus.getAll();
    };

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.menus.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El menú con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file as Express.MulterS3.File;

    if (!validateUUID(id, res)) return;

    if (!file) return handleErrorResponse(res, 400, "Debe enviar un archivo para actualizar.");

    const dataFound = await shopsServices.menus.getById({ id });
    if (!dataFound) return handleErrorResponse(res, 404, `El menú con el id: ${id} no existe.`);

    if (!(await deleteFileR2(dataFound.file_url))) return handleErrorResponse(res, 500, "Error al eliminar el menú anterior.");

    const fileUrl = `${R2.CLOUDFLARE_R2_PUBLIC_URL}/${file.key}`;

    if (!(await shopsServices.menus.editById({ id, file_url: fileUrl }))) {
      return handleErrorResponse(res, 404, `Error al editar el menú.`);
    };

    const result = await shopsServices.menus.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El menú con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await shopsServices.menus.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El menú con el id: ${id} no existe.`);

    if (!(await deleteFileR2(result.file_url))) {
      return handleErrorResponse(res, 500, "Error al eliminar el menú.");
    };

    if (!await shopsServices.menus.deleteById({ id })) {
      return handleErrorResponse(res, 404, `Error al eliminar el menú.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteByShopId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;
    if (!validateUUID(shop_id, res)) return;

    const result = await shopsServices.menus.getByShopId({ shop_id });
    if (!result) return handleErrorResponse(res, 404, `El menú con el id de negocio: ${shop_id} no existe.`);

    if (!(await deleteFileR2(result.file_url))) {
      return handleErrorResponse(res, 500, "Error al eliminar el menú.");
    };

    if (!await shopsServices.menus.deleteByShopId({ shop_id })) {
      return handleErrorResponse(res, 404, `Error al eliminar el menú.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};


export default { create, getAll, getById, editById, deleteById, deleteByShopId };

