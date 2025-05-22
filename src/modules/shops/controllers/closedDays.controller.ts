import { Request, Response } from "express";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import * as shopsServices from "../services";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id, day_of_week } = req.body;

    if (!(await shopsServices.shops.getById({ id: shop_id }))) {
      return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (!(await shopsServices.closedDays.add(req.body))) {
      return handleErrorResponse(res, 409, `No se pudo agregar los días cerrados o están repetidos`);
    };

    const closedDayExists = await shopsServices.closedDays.getByShopId({ shop_id });

    if (!closedDayExists) return handleErrorResponse(res, 404, `Error al encontrar los días cerrados.`);

    res.status(201).json({
      message: `Dias cerrados agregado con éxito ${day_of_week}.`,
      closed_days: closedDayExists
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
}

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let result;

    if (shop_id && typeof shop_id === "string") {
      if (!validateUUID(shop_id, res)) return;

      result = await shopsServices.closedDays.getByShopId({ shop_id });
    } else {
      result = await shopsServices.closedDays.getAll();
    }

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.closedDays.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El día cerrado con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await shopsServices.closedDays.getById({ id }))) {
      return handleErrorResponse(res, 404, `El día cerrado con el id: ${id} no existe.`);
    };

    if (!(await shopsServices.closedDays.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 409, `No se pudo actualizar el día cerrado`);
    };

    const result = await shopsServices.closedDays.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el día cerrado actualizado.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await shopsServices.closedDays.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El día cerrado con el id: ${id} no existe.`);

    if (!(await shopsServices.closedDays.deleteById({ id }))) {
      return handleErrorResponse(res, 409, `No se pudo eliminar el día cerrado.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteAllByShopId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;
    if (!validateUUID(shop_id, res)) return;

    const result = await shopsServices.closedDays.getByShopId({ shop_id });

    if (!result || result.length === 0) return handleErrorResponse(res, 404, `No se encontraron los días cerrados del comercio.`);

    if (!(await shopsServices.closedDays.deleteByShopId({ shop_id }))) {
      return handleErrorResponse(res, 500, "Error al eliminar los días cerrados del comercio.");
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

export default { create, getAll, getById, editById, deleteById, deleteAllByShopId };

