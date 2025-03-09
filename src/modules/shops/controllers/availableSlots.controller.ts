import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;

    if (!(await shopsServices.shops.getById(shop_id))) return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);

    if (!(await shopsServices.availableSlots.add(req.body))) return handleErrorResponse(res, 400, `Error al agregar el espacio disponible.`);

    const result = await shopsServices.availableSlots.getAllByShopId({ shop_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el espacio disponible agregado.`);

    res.status(201).json({
      message: "Espacio disponible agregada exitosamente.",
      tables: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let result;
    let message;

    if (shop_id && typeof shop_id === 'string') {
      if (!validateUUID(shop_id, res)) return;

      if (!(await shopsServices.shops.getById(shop_id))) return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);

      result = await shopsServices.availableSlots.getAllByShopId({ shop_id: shop_id });
      message = `Espacios disponbiles del negocio con id: ${shop_id} obtenidos exitosamente.`;
    }
    else {
      result = await shopsServices.availableSlots.getAll();
      message = "Espacios disponibles obtenidos exitosamente.";
    };

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron espacios disponibles.");
    };

    res.status(200).json({ message, availableSlots: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;

    if (!validateUUID(shop_id, res)) return;

    const result = await shopsServices.availableSlots.getAllByFilters({ shop_id, ...req.body });
    if (!result) return handleErrorResponse(res, 404, `Los espacios disponibles con los filtros no existe.`);

    res.status(201).json({
      message: "Espacios disponibles encontrados exitosamente.",
      availableSlots: result,
    });
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

    res.status(201).json({
      message: "Espacio disponible encontrado exitosamente.",
      availableSlot: result,
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

    if (!(await shopsServices.availableSlots.getById({ id }))) return handleErrorResponse(res, 404, `El espacio disponible con el id: ${id} no existe.`);


    if (!(await shopsServices.availableSlots.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar el espacio disponbile.`);
    };

    const result = await shopsServices.availableSlots.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el espacio disponible actualizado.`);

    res.status(200).json({
      message: "Espacio disponible editado exitosamente",
      availableSlot: result,
    });
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

    res.status(200).json({
      message: "Espacio disponible eliminado exitosamente.",
      table: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFilters, getById, editById, deleteById };

