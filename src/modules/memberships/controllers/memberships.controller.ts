import { Request, Response } from "express";
import * as membershipsServices from "../services";
import * as usersServices from "../../users/services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.body;

    if (!(await usersServices.users.getById({ id: user_id }))) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
    };

    if (await membershipsServices.memberships.getAllByFilters({ user_id })) {
      return handleErrorResponse(res, 409, `La membresia con el id de usuario: ${user_id} ya existe.`);
    };

    if (!(await membershipsServices.memberships.add(req.body))) {
      return handleErrorResponse(res, 400, `Error al agregar la membresia.`);
    };

    const result = await membershipsServices.memberships.getAllByFilters({ user_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la membresia agregada.`);

    res.status(201).json({
      message: "Membresia agregada exitosamente.",
      membership: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await membershipsServices.memberships.getAll();

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await membershipsServices.memberships.getAllByFilters(req.body);

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await membershipsServices.memberships.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La membresia con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await membershipsServices.memberships.getById({ id }))) {
      return handleErrorResponse(res, 404, `La membresía con el id: ${id} no existe.`);
    };

    if (!(await membershipsServices.memberships.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo editar la membresía con el id: ${id}.`);
    };

    const result = await membershipsServices.memberships.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al buscar la membresia editada.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await membershipsServices.memberships.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La membresia con el id: ${id} no existe.`);


    if (!await membershipsServices.memberships.deleteById({ id })) {
      return handleErrorResponse(res, 404, `Error al eliminar la membresia.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFilters, getById, editById, deleteById };

