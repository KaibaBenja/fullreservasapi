import { Request, Response } from "express";
import * as usersServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, role_id } = req.body;

    if (!await usersServices.users.getById({ id: user_id })) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    if (!await usersServices.roles.getById({ id: role_id })) {
      return handleErrorResponse(res, 400, `El rol con el id: ${role_id} no existe.`);
    };

    if (await usersServices.userRoles.getAllByFilters({ user_id, role_id })) {
      return handleErrorResponse(res, 400, `El rol asignado con el id de rol: ${role_id} ya existe.`);
    };

    if (!(await usersServices.userRoles.add({ user_id, role_id }))) {
      return handleErrorResponse(res, 500, `Error al agregar el rol al usuario.`);
    };

    const result = await usersServices.userRoles.getAllByFilters({ user_id, role_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el rol asignado al usuario.`)

    res.status(200).json({
      message: "Rol asignado exitosamente.",
      userrole: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, role_id } = req.query;
    let result;

    if (user_id && typeof user_id === "string") {
      if (!validateUUID(user_id, res)) return;

      if (!(await usersServices.users.getById({ id: user_id }))) {
        return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
      };

      result = await usersServices.userRoles.getAllByFilters({ user_id });
    } else if (role_id && typeof role_id === "string") {
      if (!validateUUID(role_id, res)) return;

      if (!(await usersServices.roles.getById({ id: role_id }))) {
        return handleErrorResponse(res, 400, `El rol con el id: ${role_id} no existe.`);
      };

      result = await usersServices.userRoles.getAllByFilters({ role_id });
    } else {
      result = await usersServices.userRoles.getAll();
    };

    res.status(200).json(result ? result : []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await usersServices.userRoles.getById({ id });
    if (!result) {
      return handleErrorResponse(res, 404, `El rol asignado con el id: ${id} no existe.`);
    };

    if (!await usersServices.userRoles.deleteById({ id })) {
      return handleErrorResponse(res, 500, `Error al eliminar el rol asignado.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, deleteById };

