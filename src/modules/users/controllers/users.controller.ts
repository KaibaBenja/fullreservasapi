import { Request, Response } from "express";
import * as usersServices from "../services";
import * as membershipsServices from "../../memberships/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, merchant } = req.body;

    if (await usersServices.users.getByEmail({ email })) {
      return handleErrorResponse(res, 409, `El usuario con el email: ${email} ya está registrado.`);
    };

    if (!await usersServices.users.add(req.body)) {
      return handleErrorResponse(res, 400, `No se pudo crear el usuario.`);
    };

    const user = await usersServices.users.getByEmail({ email });
    if (!user) return handleErrorResponse(res, 404, `No se encontro el usuarió por email.`);

    const clientRole = await usersServices.roles.getByName({ name: "CLIENT" });
    if (!clientRole) return handleErrorResponse(res, 409, `El rol CLIENT no existe.`);

    if (!(await usersServices.userRoles.add({
      user_id: user.id.toString("utf-8"),
      role_id: clientRole.id.toString("utf-8")
    }))) return handleErrorResponse(res, 404, `Error al asignar el rol CLIENT.`);

    if (merchant) {
      const merchantRole = await usersServices.roles.getByName({ name: "MERCHANT" });
      if (!merchantRole) return handleErrorResponse(res, 409, `El rol MERCHANT no existe.`);

      if (!(await usersServices.userRoles.add({
        user_id: user.id.toString("utf-8"),
        role_id: merchantRole.id.toString("utf-8")
      }))) return handleErrorResponse(res, 404, `Error al asignar el rol MERCHANT.`);

      if (!(await membershipsServices.memberships.add({
        user_id: user.id.toString("utf-8"),
        tier: "FREE",
        status: "EXPIRED"
      }))) return handleErrorResponse(res, 404, `Error al asignar la membresia.`);
    }

    const result = await usersServices.users.getById({ id: user.id.toString("utf-8") });
    if (!result) return handleErrorResponse(res, 404, `No se pudo encontrar el usuario después de la creación.`);

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

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

    res.status(200).json(result ? result : []);
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


export default { create, getAll, getById, editById, deleteById };

