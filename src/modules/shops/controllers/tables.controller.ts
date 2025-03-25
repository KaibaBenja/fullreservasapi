import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;

    if (!(await shopsServices.shops.getById(shop_id))) {
      return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (!(await shopsServices.tables.add(req.body))) {
      return handleErrorResponse(res, 400, `No se pudo agregar la mesa.`);
    };

    const result = await shopsServices.tables.getAllByFiltersShopId({ shop_id });
    if (!result) return handleErrorResponse(res, 404, `No se encontró la mesa agregada.`);

    res.status(201).json({
      message: "Mesa agregada exitosamente.",
      tables: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.tables.getAll();

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllByFiltersShopId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;
    if (!validateUUID(shop_id, res)) return;

    if (!(await shopsServices.shops.getById({ id: shop_id }))) {
      return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);
    };

    const result = await shopsServices.tables.getAllByFiltersShopId({ shop_id, ...req.body });

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.tables.getAllByFilters(req.body);

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await shopsServices.tables.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La mesa con el id: ${id} no existe.`);

    res.status(200).json(result);
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

    if (!(await shopsServices.tables.getById({ id }))) {
      return handleErrorResponse(res, 404, `La mesa con el id: ${id} no existe.`);
    };

    if (!(await shopsServices.tables.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la mesa.`);
    };

    const result = await shopsServices.tables.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la mesa actualizada.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await shopsServices.tables.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La mesa con el id: ${id} no existe.`);

    if (!(await shopsServices.tables.deleteById({ id }))) {
      return handleErrorResponse(res, 400, `No se pudo eliminar la mesa.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFilters, getAllByFiltersShopId, getById, editById, deleteById };

