import { Request, Response } from "express";
import * as usersServices from "../service";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (await usersServices.users.getByEmail(email)) {
      return handleErrorResponse(res, 409, `El usuario con el email: ${email} ya existe..`);
    };

    if (!await usersServices.users.add(req.body)) {
      return handleErrorResponse(res, 400, `Error al crear el usuario.`);
    };

    const userExists = await usersServices.users.getByEmail(email);
    if (!userExists) return handleErrorResponse(res, 404, `Error al encontrar el usuario.`);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: userExists,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role_id } = req.query;
    let message;
    let result;

    if (role_id && typeof role_id === "string") {
      if (!validateUUID(role_id, res)) return;

      if (!(await usersServices.roles.getById(role_id))) {
        return handleErrorResponse(res, 404, `El rol con el id: ${role_id} no existe.`);
      };

      result = await usersServices.users.getByRole(role_id);
      message = `Usuarios con el id de rol: ${role_id} obtendidos existosamente.`;
    } else {
      result = await usersServices.users.getAll();
      message = `Roles obtenidos exitosamente.`;
    }

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron roles.");
    };

    res.status(200).json({ message, users: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const userFound = await usersServices.users.getById(id);
    if (!userFound) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Usuario encontrado exitosamente.",
      user: userFound,
    });
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

    if (!(await usersServices.users.getById(id))) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    if (email && await usersServices.users.getByEmail(email)) {
      return handleErrorResponse(res, 404, `El usuario con el email: ${email} ya existe.`);
    };

    if (await usersServices.users.editById({ id, ...req.body })) {
      return handleErrorResponse(res, 404, `Error al editar el usuario.`);
    };

    const userExist = await usersServices.users.getById(id);
    if (!userExist) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    res.status(200).json({
      message: "Usuario editado exitosamente.",
      user: userExist,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const userFound = await usersServices.users.getById(id);
    if (!userFound) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    if (!await usersServices.users.deleteById(id)) {
      return handleErrorResponse(res, 404, `Error al eliminar el usuario.`);
    };

    res.status(200).json({
      message: "Usuario eliminado exitosamente.",
      user: userFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

