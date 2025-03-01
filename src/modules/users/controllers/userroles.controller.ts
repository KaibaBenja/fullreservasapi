import { Request, Response } from "express";
import * as usersServices from "../service";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, role_id } = req.body;

    if (!await usersServices.users.getById(user_id)) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    if (!await usersServices.roles.getById(role_id)) {
      return handleErrorResponse(res, 400, `El rol con el id: ${role_id} no existe.`);
    };

    if (await usersServices.userRoles.getByUserAndRole({ user_id, role_id })) {
      return handleErrorResponse(res, 400, `El rol asignado con el id de rol: ${role_id} ya existe.`);
    };

    if (!await usersServices.userRoles.add({ user_id, role_id })) {
      return handleErrorResponse(res, 400, `Error al agregar el rol al usuario.`);
    };

    const result = await usersServices.userRoles.getByUserAndRole({ user_id, role_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el rol asignado al usuario.`)

    res.status(200).json({
      message: "Rol asignado exitosamente",
      userrole: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, role_id } = req.params;
    let result;
    let message;

    if (user_id && typeof user_id === "string") {
      if (!validateUUID(user_id, res)) return;
      if (!await usersServices.users.getById(user_id)) {
        return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
      };

      result = await usersServices.userRoles.getByUserId(user_id);
      message = `Roles del usuario con el id: ${user_id} obtenidos exitosamente.`;
    } else if (role_id && typeof role_id === "string") {
      if (!validateUUID(role_id, res)) return;
      if (!await usersServices.roles.getById(role_id)) {
        return handleErrorResponse(res, 400, `El rol con el id: ${role_id} no existe.`);
      };

      result = await usersServices.userRoles.getByRoleId(role_id);
      message = `Roles asignados con el id de rol: ${role_id} obtenidos exitosamente.`;
    } else {
      result = await usersServices.userRoles.getAll();
      message = `Roles obtenidos exitosamente.`;
    };

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron roles.");
    };

    res.status(200).json({ message, shops: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const userroleFound = await usersServices.userRoles.getById(id);
    if (!userroleFound) {
      return handleErrorResponse(res, 404, `El rol asignado con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Rol asignado encontrado exitosamente.",
      role: userroleFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    }

    if (await usersServices.userRoles.getByUserAndRole({ user_id: id, role_id })) {
      return handleErrorResponse(res, 400, `El rol asignado con el id de rol: ${role_id} ya existe.`);
    }

    if (!(await usersServices.userRoles.getById(id))) {
      return handleErrorResponse(res, 404, `El rol asignado con el id: ${id} no existe.`);
    }

    if (role_id && !(await usersServices.roles.getById(role_id))) {
      return handleErrorResponse(res, 400, `El rol con el id: ${role_id} no existe.`);
    }

    if (!( await usersServices.userRoles.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 404, `Error al editar el rol asignado.`);
    }

    const userRoleExist = await usersServices.userRoles.getById(id);
    if (!userRoleExist) {
      return handleErrorResponse(res, 404, `Error al buscar el rol asignado.`);
    }

    res.status(200).json({
      message: "Rol asignado editado exitosamente.",
      userrol: userRoleExist,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};


const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const userrolesFound = await usersServices.userRoles.getById(id);
    if (!userrolesFound) {
      return handleErrorResponse(res, 404, `El rol asignado con el id: ${id} no existe.`);
    };

    if (!await usersServices.userRoles.deleteById(id)) {
      return handleErrorResponse(res, 404, `Error al eliminar el rol asignado.`);
    };

    res.status(200).json({
      message: "Rol asignado eliminado exitosamente.",
      user: userrolesFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

