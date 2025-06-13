import { Request, Response } from "express";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import * as usersServices from "../services";
import * as membershipsServices from "../../memberships/services";


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
    const { email, password, current_password, merchant } = req.body;

    if (!validateUUID(id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await usersServices.users.getById({ id }))) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    if (email && await usersServices.users.getByEmail({ email })) {
      return handleErrorResponse(res, 409, `El usuario con el email: ${email} ya existe.`);
    };

    if (password) {
      if (!current_password) {
        return handleErrorResponse(res, 400, "Debe proporcionar la contraseña actual.");
      }
      if (!(await usersServices.users.verifyPassword({ id }, current_password))) {
        return handleErrorResponse(res, 401, "La contraseña actual es incorrecta.");
      }
    };

    if (merchant) {
      const merchantRole = await usersServices.roles.getByName({ name: "MERCHANT" });
      if (!merchantRole) return handleErrorResponse(res, 409, `El rol MERCHANT no existe.`);

      if (!(await usersServices.userRoles.add({
        user_id: id,
        role_id: merchantRole.id.toString("utf-8")
      }))) return handleErrorResponse(res, 404, `Error al asignar el rol MERCHANT.`);

      const freePlan = await membershipsServices.membershipsPlans.getAllByFilters({ tier_name: 'FREE' });
      if (!freePlan) return handleErrorResponse(res, 404, "Plan de membresía no encontrado.")

      if (!(await membershipsServices.memberships.add({
        user_id: id,
        tier: freePlan[0].id.toString('utf-8'),
        status: "EXPIRED"
      }))) return handleErrorResponse(res, 404, `Error al asignar la membresia.`);
    }

    const bodyKeys = Object.keys(req.body);
    if (!(bodyKeys.length === 1 && bodyKeys[0] === "merchant")) {
      const updateData = { ...req.body };

      if (password) {
        updateData.passwordChanged = false;
      }

      if (!(await usersServices.users.editById({ id, ...updateData }))) {
        return handleErrorResponse(res, 400, `Error al editar el usuario.`);
      }
    }

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

