import { Request, Response } from "express";
import * as usersServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await usersServices.roles.getAll();
    if (!result) return handleErrorResponse(res, 204, `No se encontraron roles.`);

    res.status(201).json(result ? result : []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await usersServices.roles.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El rol con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { getAll, getById };

