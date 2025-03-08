import { Request, Response } from "express";
import * as usersServices from "../service";
import * as shopsServices from "../../shops/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, shop_id } = req.body;

    if (!await usersServices.users.getById(user_id)) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    }

    if (!await shopsServices.shops.getById(shop_id)) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    }

    if (await usersServices.operators.getByUserAndShop(req.body)) {
      return handleErrorResponse(res, 400, `El operador ya existe.`);
    }

    if (!await usersServices.operators.add(req.body)) {
      return handleErrorResponse(res, 400, `Error al crear el operador.`);
    }

    const operatorExists = await usersServices.operators.getByUserAndShop(req.body);
    if (!operatorExists) return handleErrorResponse(res, 404, `Error al encontrar el merchant agregado.`);

    res.status(201).json({
      message: "Operador creado exitosamente",
      user: operatorExists,
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let message;
    let result;

    if (shop_id && typeof shop_id === "string") {
      if (!validateUUID(shop_id, res)) return;

      const shopFound = await usersServices.operators.getAllByShopId(shop_id);
      if (!shopFound) {
        return handleErrorResponse(res, 404, `El el negocio con el id ${shop_id} no existe.`);
      };

      message = `Operadores por negocio obtenido exitosamente.`;
      result = shopFound;
    } else {
      result = await usersServices.operators.getAll();
      message = `Operadores obtenidos exitosamente.`;
    };

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron merchants.");
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

    const operatorFound = await usersServices.operators.getById(id);
    if (!operatorFound) {
      return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Operador encontrado exitosamente.",
      operator: operatorFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, shop_id } = req.body;

    if (!validateUUID(id, res)) return;

    if ((!req.body || Object.keys(req.body).length === 0)) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await usersServices.operators.getById(id))) {
      return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);
    };

    if (user_id) {
      if (!(await usersServices.users.getById(user_id))) {
        return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
      };

      if (await usersServices.operators.getByUserId(user_id)) {
        return handleErrorResponse(res, 404, `El operador con el id de usuario: ${user_id} ya esta asignado.`);
      };
    }

    if (user_id && shop_id && await usersServices.operators.getByUserAndShop(req.body)) {
      return handleErrorResponse(res, 400, `El operador ya existe.`);
    };

    if (!(await usersServices.operators.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 404, `Error al editar el operador.`);
    };

    const operatorExist = await usersServices.operators.getById(id);
    if (!operatorExist) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    res.status(200).json({
      message: "Operaodr editado exitosamente.",
      operator: operatorExist,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const operatorFound = await usersServices.operators.getById(id);
    if (!operatorFound) {
      return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);
    };

    if (!(await usersServices.operators.deleteById(id))) {
      return handleErrorResponse(res, 404, `Error al eliminar el merchant.`);
    };

    res.status(200).json({
      message: "Operador eliminado exitosamente.",
      merchant: operatorFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

