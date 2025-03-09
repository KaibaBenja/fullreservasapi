import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { ITables } from "../types/tables.types";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;

    if (!(await shopsServices.shops.getById(shop_id))) return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);

    if (!(await shopsServices.tables.add(req.body))) return handleErrorResponse(res, 400, `Error al agregar la mesa.`);

    const result = await shopsServices.tables.getAllByShopId({ shop_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la mesa agregada.`);

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
    const { location_type, floor, roof_type, shop_id } = req.query;
    let result;
    let message;

    if (location_type && typeof location_type === 'string') {
      const formatedData = location_type.toUpperCase() as ITables["location_type"];

      if (!['INSIDE', 'OUTSIDE'].includes(formatedData)) {
        return handleErrorResponse(res, 400, `location_type inválido`);
      };

      result = await shopsServices.tables.getAllByLocationType({ location_type: formatedData });
      message = `Mesas ubicadas: ${formatedData} obtenidas exitosamente.`;
    }
    else if (floor && typeof floor === 'string') {
      const formatedData = floor.toUpperCase() as ITables["floor"];

      if (!['GROUND LEVEL', 'UPPER LEVEL'].includes(formatedData)) {
        return handleErrorResponse(res, 400, `floor inválido`);
      };

      result = await shopsServices.tables.getAllByFloor({ floor: formatedData });
      message = `Mesas en el piso: ${formatedData} obtenidas exitosamente.`;
    }
    else if (roof_type && typeof roof_type === 'string') {
      const formatedData = roof_type.toUpperCase() as ITables["roof_type"];

      if (!['COVERED', 'UNCOVERED'].includes(formatedData)) {
        return handleErrorResponse(res, 400, `roof_type inválido`);
      };

      result = await shopsServices.tables.getAllByRoofType({ roof_type: formatedData });
      message = `Mesas con el techo: ${formatedData} obtenidas exitosamente.`;
    }
    else if (shop_id && typeof shop_id === 'string') {
      if (!validateUUID(shop_id, res)) return;

      if (!(await shopsServices.shops.getById(shop_id))) return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);

      result = await shopsServices.tables.getAllByShopId({ shop_id: shop_id });
      message = `Mesas del negocio con id: ${shop_id} obtenidas exitosamente.`;
    }
    else {
      result = await shopsServices.tables.getAll();
      message = "Mesas obtenidas exitosamente.";
    };

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron mesas.");
    };

    res.status(200).json({ message, tables: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;
    if (!validateUUID(shop_id, res)) return;

    const result = await shopsServices.tables.getAllByFilters({ shop_id, ...req.body });
    if (!result) return handleErrorResponse(res, 404, `Las mesas con los filtros no existe.`);

    res.status(201).json({
      message: "Mesas encontradas exitosamente.",
      table: result,
    });
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

    res.status(201).json({
      message: "Mesa encontrada exitosamente.",
      table: result,
    });
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

    if (!(await shopsServices.tables.getById({ id }))) return handleErrorResponse(res, 404, `La mesa con el id: ${id} no existe.`);


    if (!(await shopsServices.tables.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la mesa.`);
    };

    const result = await shopsServices.tables.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la mesa actualizada.`);

    res.status(200).json({
      message: "Mesa editada exitosamente",
      subcategory: result,
    });
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

    if (!(await shopsServices.tables.deleteById({ id }))) return handleErrorResponse(res, 404, `Error al eliminar la mesa.`);

    res.status(200).json({
      message: "Mesa eliminada exitosamente.",
      table: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFilters, getById, editById, deleteById };

