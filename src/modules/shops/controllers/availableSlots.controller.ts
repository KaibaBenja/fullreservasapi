import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let result;

    if (shop_id && typeof shop_id === 'string') {
      if (!validateUUID(shop_id, res)) return;

      result = await shopsServices.availableSlots.getAllByShopId({ shop_id });
    } else {
      result = await shopsServices.availableSlots.getAll();
    };

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;
    if (!validateUUID(shop_id, res)) return;

    const result = await shopsServices.availableSlots.getAllByFilters({ shop_id, ...req.body });

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.availableSlots.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El espacio disponible con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await shopsServices.availableSlots.getById({ id }))) {
      return handleErrorResponse(res, 404, `El espacio disponible con el id: ${id} no existe.`);
    };

    if (!(await shopsServices.availableSlots.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar el espacio disponbile.`);
    };

    const result = await shopsServices.availableSlots.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el espacio disponible actualizado.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.availableSlots.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El espacio disponible con el id: ${id} no existe.`);

    if (!(await shopsServices.availableSlots.deleteById({ id }))) return handleErrorResponse(res, 404, `Error al eliminar el espacio disponible.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { getAll, getAllByFilters, getById, editById, deleteById };

