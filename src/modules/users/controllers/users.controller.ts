import { Request, Response } from "express";
import * as usersServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role_id } = req.query;
    let result;

    if (role_id && typeof role_id === "string") {
      if (!validateUUID(role_id, res)) return;

      if (!(await usersServices.roles.getById({ id: role_id }))) {
        return handleErrorResponse(res, 404, `El rol con el id: ${role_id} no existe.`);
      };

      result = await usersServices.users.getByRole(role_id);
    } else {
      result = await usersServices.users.getAll();
    };

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await usersServices.users.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!validateUUID(id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await usersServices.users.getById({ id }))) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    if (email && await usersServices.users.getByEmail({ email })) {
      return handleErrorResponse(res, 409, `El usuario con el email: ${email} ya existe.`);
    }

    if (!(await usersServices.users.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `Error al editar el usuario.`);
    };

    const result = await usersServices.users.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el usuario actualizado.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await usersServices.users.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);

    if (!(await usersServices.users.deleteById({ id }))) {
      return handleErrorResponse(res, 500, `Error al eliminar el usuario.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};


export default { getAll, getById, editById, deleteById };

