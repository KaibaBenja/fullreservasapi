import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if ((await shopsServices.subcategories.getByName(name))) {
      return handleErrorResponse(res, 404, `La subcategoria: ${name} ya existe.`);
    };

    if (!(await shopsServices.subcategories.add(req.body))) {
      return handleErrorResponse(res, 400, `Error al agregar la subcategoria.`);
    };

    const subcategoryExists = await shopsServices.subcategories.getByName(name);
    if (!subcategoryExists) {
      return handleErrorResponse(res, 404, `Error al encontrar la dirección agregada.`);
    };

    res.status(201).json({
      message: "Subcategoria agregada exitosamente",
      subcategory: subcategoryExists,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { main_category } = req.query;
    let result;
    let message;

    if (main_category && typeof main_category === 'string') {
      if (!["COMMERCE", "SERVICE"].includes(main_category.toUpperCase())) {
        return handleErrorResponse(res, 400, `main_category inválido`);
      };

      result = await shopsServices.subcategories.getAllByMainCategory(main_category);
      message = `Subcategorias de tipo ${main_category} obtenidos exitosamente.`;
    } else {
      result = await shopsServices.subcategories.getAll();
      message = "Subcategorias obtenidas exitosamente.";
    }

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron negocios.");
    }

    res.status(200).json({ message, subcategories: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const subcategoryFound = await shopsServices.subcategories.getById(id);
    if (!subcategoryFound) {
      return handleErrorResponse(res, 404, `La subcategoria con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Subcategoria encontrada exitosamente",
      subcategory: subcategoryFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await shopsServices.subcategories.getById(id))) {
      return handleErrorResponse(res, 404, `La subcategoria con el id: ${id} no existe.`)
    };

    if (name && (await shopsServices.subcategories.getByName(name))) {
      return handleErrorResponse(res, 404, `La subcategoria: ${name} ya existe.`);
    };

    if (!(await shopsServices.subcategories.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la subcategoria.`);
    };

    const addressUpdated = await shopsServices.subcategories.getById(id);
    if (!addressUpdated) {
      return handleErrorResponse(res, 404, `Error al encontrar la subcategoria actualizada.`);
    };

    res.status(200).json({
      message: "Subcategoria editada exitosamente",
      subcategory: addressUpdated,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const subcategoryFound = await shopsServices.subcategories.getById(id);
    if (!subcategoryFound) {
      return handleErrorResponse(res, 404, `La subcategoria con el id: ${id} no existe.`);
    };

    if (!(await shopsServices.subcategories.deleteById(id))) {
      return handleErrorResponse(res, 404, `Error al eliminar la subcategoria.`);
    };

    res.status(200).json({
      message: "Subcategoria eliminada exitosamente",
      subcategory: subcategoryFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

