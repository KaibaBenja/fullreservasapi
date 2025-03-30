import { Request, Response } from "express";
import * as shopsServices from "../services";
import * as  usersServices from "../../users/services/";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, subcategory_id } = req.body;

    if (!(await usersServices.users.getById({ id: user_id }))) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
    };

    const role = await usersServices.roles.getByName({ name: "MERCHANT" });
    if (!role) return handleErrorResponse(res, 409, `El rol MERCHANT no existe.`);

    if (!(await usersServices.userRoles.getAllByFilters({ user_id, role_id: role.id.toString("utf-8") }))) {
      return handleErrorResponse(res, 409, `El usuario no posee el rol MERCHANT.`);
    };

    if (!(await shopsServices.subcategories.getById({ id: subcategory_id }))) {
      return handleErrorResponse(res, 404, `La subcategoría con el id: ${subcategory_id} no existe.`);
    };

    if (await shopsServices.shops.getAllByFilters({ user_id })) {
      return handleErrorResponse(res, 404, `El negocio ya existe.`);
    };

    if (!(await shopsServices.shops.add(req.body))) return handleErrorResponse(res, 500, `Error al agregar el negocio.`);

    const result = await shopsServices.shops.getAllByFiltersUser({ user_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el negocio agregado.`);

    res.status(201).json({
      message: "Negocio agregado exitosamente",
      shop: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, `Error interno del servidor.`);
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.shops.getAll();

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.shops.getAllByFilters(req.body);

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.shops.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El negocio con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, subcategory_id } = req.body;

    if (!validateUUID(id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (user_id && validateUUID(user_id, res)) {
      if (!(await usersServices.users.getById(user_id))) {
        return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
      };
    };

    if (subcategory_id && validateUUID(subcategory_id, res)) {
      if (!(await usersServices.users.getById(user_id))) {
        return handleErrorResponse(res, 404, `La subcategoría con el id: ${subcategory_id} no existe.`);
      };
    };

    if (!(await shopsServices.shops.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar el negocio.`);
    };

    const result = await shopsServices.shops.getById({ id });
    if (!result) handleErrorResponse(res, 400, `Error al encontrar el negocio actualizado.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.shops.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El negocio con el id: ${id} no existe.`);

    if (!(await shopsServices.shops.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar el negocio.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


const getAllByFiltersUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.shops.getAllByFiltersUser(req.body);

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.shops.getAllByFiltersUser({ none: true });

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getByIdPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.shops.getAllByFiltersUser({ id });
    if (!result) return handleErrorResponse(res, 404, `El negocio con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};




export default { create, getAll, getAllByFilters, getAllByFiltersUser, getAllPublic, getById, getByIdPublic, editById, deleteById };

