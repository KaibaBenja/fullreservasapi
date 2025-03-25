import { Request, Response } from "express";
import * as addressServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if ((await addressServices.countries.getByName({ name }))) {
      return handleErrorResponse(res, 409, `El país: ${name} ya existe.`);
    };

    if (!(await addressServices.countries.add({ name }))) {
      return handleErrorResponse(res, 404, `Error al agregar el país.`);
    };

    const result = await addressServices.countries.getByName({ name });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el país agregado.`);

    res.status(201).json({
      message: "País agregado exitosamente.",
      country: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await addressServices.countries.getAll();

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.countries.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El país con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!validateUUID(id, res)) return;

    if (!(await addressServices.countries.getById({ id }))) {
      return handleErrorResponse(res, 404, `El país con el id: ${id} no existe.`);
    };

    if ((await addressServices.countries.getByName({ name }))) {
      return handleErrorResponse(res, 409, `El país: ${name} ya existe.`);
    };

    if (!(await addressServices.countries.editById({ id, name }))) {
      return handleErrorResponse(res, 400, `Error al editar el país.`);
    };

    const result = await addressServices.countries.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el país editado.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.countries.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El país con el id: ${id} no existe.`);

    if (!(await addressServices.countries.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar el país.`)
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

