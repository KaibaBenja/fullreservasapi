import { Request, Response } from "express";
import * as shopsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if ((await shopsServices.subcategories.getByName({ name }))) {
      return handleErrorResponse(res, 409, `La subcategoría: ${name} ya existe.`);
    };

    if (!(await shopsServices.subcategories.add(req.body))) {
      return handleErrorResponse(res, 400, `Error al agregar la subcategoría.`);
    };

    const result = await shopsServices.subcategories.getByName({ name });
    if (!result) {
      return handleErrorResponse(res, 404, `Error al encontrar la subcategoría agregada.`);
    };

    res.status(201).json({
      message: "subcategoría agregada exitosamente",
      subcategory: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { main_category } = req.query;
    let result;

    if (main_category && typeof main_category === "string") {
      const formattedCategory = main_category.toUpperCase() as "COMMERCE" | "SERVICE";

      if (!["COMMERCE", "SERVICE"].includes(formattedCategory)) {
        return handleErrorResponse(res, 400, "main_category inválido.");
      }

      result = await shopsServices.subcategories.getAllByMainCategory({ main_category: formattedCategory });
    } else {
      result = await shopsServices.subcategories.getAll();
    };

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.subcategories.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La subcategoría con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {  
  try {
    const { id } = req.params;
    const { name, main_category } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await shopsServices.subcategories.getById({ id }))) {
      return handleErrorResponse(res, 404, `No se encontró una subcategoría con el id: ${id}.`)
    };

    if (name && (await shopsServices.subcategories.getByName({ name }))) {
      return handleErrorResponse(res, 404, `La subcategoría ${name} ya existe.`);
    };

    if (!(await shopsServices.subcategories.editById({ id, name, main_category }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la subcategoría.`);
    };

    const result = await shopsServices.subcategories.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la subcategoría actualizada.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await shopsServices.subcategories.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La subcategoría con el id: ${id} no existe.`);

    if (!(await shopsServices.subcategories.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar la subcategoría.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

