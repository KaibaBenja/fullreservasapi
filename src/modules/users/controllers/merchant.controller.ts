import { Request, Response } from "express";
import * as usersServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import { R2 } from "../../../config/dotenv.config";
import { deleteFileR2 } from "../../../middlewares/upload";
import * as shopsServices from "../../shops/services";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.body;
    const file = req.file as Express.MulterS3.File;

    if (!await usersServices.users.getById({ id: user_id })) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    if (await usersServices.merchants.getByUserAndCategory(req.body)) {
      return handleErrorResponse(res, 400, `El comerciante ya existe.`);
    };

    const role = await usersServices.roles.getByName({ name: "MERCHANT" });
    if (!role) return handleErrorResponse(res, 409, `El rol MERCHANT no existe.`);

    if (!(await usersServices.userRoles.getAllByFilters({ user_id, role_id: role.id.toString("utf-8") }))) {
      return handleErrorResponse(res, 409, `El usuario no posee el rol MERCHANT.`);
    };

    let logo_url: string | undefined;
    if (file) logo_url = `${R2.CLOUDFLARE_R2_PUBLIC_URL}/${file.key}`;

    const data = { ...req.body, logo_url };

    if (!await usersServices.merchants.add(data)) {
      return handleErrorResponse(res, 400, `Error al crear el comerciante.`);
    };

    const result = await usersServices.merchants.getByUserAndCategory(req.body);
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el comerciante agregado.`);

    res.status(201).json({
      message: "Comerciante creado exitosamente",
      merchant: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, shop_id } = req.query;
    let result;
    if (user_id && shop_id) {
      return handleErrorResponse(res, 400, "No se pueden enviar ambos parametros (user_id y shop_id) al mismo tiempo.");
    } else if (user_id && typeof user_id === "string") {
      if (!validateUUID(user_id, res)) return;

      if (!(await usersServices.users.getById({ id: user_id }))) {
        return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
      };

      result = await usersServices.merchants.getByUserId({ user_id });
    } else if (shop_id && typeof shop_id === "string") {
      if (!validateUUID(shop_id, res)) return;

      if (!(await shopsServices.shops.getById({ id: shop_id }))) {
        return handleErrorResponse(res, 404, `La tienda con el id: ${shop_id} no existe.`);
      };

      result = await usersServices.merchants.getByShopId(shop_id);
    } else {
      result = await usersServices.merchants.getAll();
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

    const result = await usersServices.merchants.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El comerciante con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file as Express.MulterS3.File;

    if (!validateUUID(id, res)) return;

    if ((!req.body || Object.keys(req.body).length === 0) && !file) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    const merchantFound = await usersServices.merchants.getById({ id });
    if (!merchantFound) {
      return handleErrorResponse(res, 404, `El comerciante con el id: ${id} no existe.`);
    };

    let imageUrl = merchantFound.logo_url;
    if (file) {
      if (imageUrl) {
        if (!(await deleteFileR2(imageUrl))) return handleErrorResponse(res, 500, "Error al eliminar la imagen anterior.");
      };

      imageUrl = `${R2.CLOUDFLARE_R2_PUBLIC_URL}/${file.key}`;
    };

    if (!(await usersServices.merchants.editById({ id, ...req.body, logo_url: imageUrl }))) {
      return handleErrorResponse(res, 404, `Error al editar el comerciante.`);
    };

    const result = await usersServices.merchants.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el comerciante editado.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await usersServices.merchants.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El comerciante con el id: ${id} no existe.`);

    if (result.logo_url) {
      if (!(await deleteFileR2(result.logo_url))) return handleErrorResponse(res, 500, "Error al eliminar la imagen.");
    };

    if (!await usersServices.merchants.deleteById({ id })) {
      return handleErrorResponse(res, 400, `Error al eliminar el comerciante.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

