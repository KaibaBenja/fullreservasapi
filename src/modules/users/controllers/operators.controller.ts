import { Request, Response } from "express";
import * as usersServices from "../services";
import * as shopsServices from "../../shops/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, shop_id } = req.body;

    if (!await usersServices.users.getById({ id: user_id })) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    if (!await shopsServices.shops.getById(shop_id)) {
      return handleErrorResponse(res, 400, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (await usersServices.operators.getByUserAndShop(req.body)) {
      return handleErrorResponse(res, 400, `El operador ya existe.`);
    };

    if (!await usersServices.operators.add(req.body)) {
      return handleErrorResponse(res, 400, `Error al crear el operador.`);
    };

    const role = await usersServices.roles.getByName({ name: "OPERATOR" });
    if (!role) return handleErrorResponse(res, 409, `El rol OPERATOR no existe.`);

    const roleFound = await usersServices.userRoles.getAllByFilters({
      user_id: user_id,
      role_id: role.id.toString("utf-8")
    });
    if (roleFound) return handleErrorResponse(res, 409, `El usuario ya posee el rol OPERATOR.`);

    if (!(await usersServices.userRoles.add({
      user_id, role_id: role.id.toString("utf-8")
    }))) return handleErrorResponse(res, 404, `Error al asignar el rol OPERATOR.`);

    const result = await usersServices.operators.getByUserAndShop(req.body);
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el operaddor agregado.`);

    res.status(201).json({
      message: "Operador creado exitosamente.",
      operator: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let result;

    if (shop_id && typeof shop_id === "string") {
      if (!validateUUID(shop_id, res)) return;

      if (!(await shopsServices.shops.getById(shop_id))) {
        return handleErrorResponse(res, 404, `No existe el negocio con el id: ${shop_id}`)
      };

      result = await usersServices.operators.getAllByShopId({ shop_id });
    } else {
      result = await usersServices.operators.getAll();
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

    const result = await usersServices.operators.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!validateUUID(id, res)) return;

    if ((!req.body || Object.keys(req.body).length === 0) || !user_id) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    const operatorToUpdate = await usersServices.operators.getById({ id });
    if (!operatorToUpdate) {
      return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);
    };

    if (!(await usersServices.users.getById({ id: user_id }))) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
    };

    const existingOperator = await usersServices.operators.getByUserId({ user_id });
    if (existingOperator) {
      return handleErrorResponse(res, 409, `El usuario con el id: ${user_id} ya es operador.`);
    };

    if (user_id !== operatorToUpdate.user_id.toString("utf-8")) {
      const role = await usersServices.roles.getByName({ name: "OPERATOR" });
      if (!role) return handleErrorResponse(res, 409, `El rol OPERATOR no existe.`);

      const oldUserRoles = await usersServices.userRoles.getAllByFilters({
        user_id: operatorToUpdate.user_id.toString("utf-8"),
        role_id: role.id.toString("utf-8")
      });

      if (oldUserRoles && oldUserRoles.length > 0) {
        const userRoleId = Object.values(oldUserRoles[0])[0];
        if (!(await usersServices.userRoles.deleteById({
          id: userRoleId
        }))) return handleErrorResponse(res, 404, `Error al eliminar el rol OPERATOR del usuario anterior.`);
      }

      const newUserRoles = await usersServices.userRoles.getAllByFilters({
        user_id: user_id,
        role_id: role.id.toString("utf-8")
      });

      if (!newUserRoles || newUserRoles.length === 0) {
        if (!(await usersServices.userRoles.add({
          user_id, role_id: role.id.toString("utf-8")
        }))) return handleErrorResponse(res, 404, `Error al asignar el rol OPERATOR al nuevo usuario.`);
      }
    }

    if (!(await usersServices.operators.editById({ id, user_id }))) {
      return handleErrorResponse(res, 404, `Error al editar el operador.`);
    };

    const result = await usersServices.operators.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el operador editado.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await usersServices.operators.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);

    const role = await usersServices.roles.getByName({ name: "OPERATOR" });
    if (!role) return handleErrorResponse(res, 409, `El rol OPERATOR no existe.`);

    const roleFound = await usersServices.userRoles.getAllByFilters({
      user_id: result.user_id.toString("utf-8"),
      role_id: role.id.toString("utf-8")
    });
    if (!roleFound || roleFound.length === 0 || roleFound === null) {
      return handleErrorResponse(res, 409, `El usuario no posee el rol OPERATOR.`);
    };
    const userRoleId = Object.values(roleFound[0])[0];

    if (!(await usersServices.userRoles.deleteById({
      id: userRoleId
    }))) return handleErrorResponse(res, 404, `Error al eliminar el rol OPERATOR del usuario.`);

    if (!(await usersServices.operators.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar el operador.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

