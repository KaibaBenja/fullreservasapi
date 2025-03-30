import { Request, Response } from "express";
import * as usersServices from "../services";
import * as shopsServices from "../../shops/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, password, shop_id } = req.body;

    // Validaciones
    if (await usersServices.users.getByEmail({ email: full_name })) {
      return handleErrorResponse(res, 409, `El usuario con el nombre: ${full_name} ya está registrado.`);
    };

    if (!await shopsServices.shops.getById({ id: shop_id })) {
      return handleErrorResponse(res, 400, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (await usersServices.operators.getByShopId({ shop_id })) {
      return handleErrorResponse(res, 400, `El operador del negocio con id: ${shop_id} ya existe.`);
    };

    

    const user = await usersServices.users.getByEmail({ email: full_name });
    if (!user) return handleErrorResponse(res, 404, `No se encontro el usuarió por email.`);

    // Asignr rol operador
    const operatorRole = await usersServices.roles.getByName({ name: "OPERATOR" });
    if (!operatorRole) return handleErrorResponse(res, 409, `El rol OPERATOR no existe.`);

    if (!(await usersServices.userRoles.add({
      user_id: user.id.toString("utf-8"),
      role_id: operatorRole.id.toString("utf-8")
    }))) return handleErrorResponse(res, 404, `Error al asignar el rol OPERATOR.`);

    // Asignar usuario a operators
    if (!await usersServices.operators.add({
      user_id: user.id.toString("utf-8"),
      shop_id,
    })) return handleErrorResponse(res, 400, `Error al crear el operador.`);

    const result = await usersServices.operators.getByUserAndShop({
      user_id: user.id.toString("utf-8"),
      shop_id,
    });

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

      if (!(await shopsServices.shops.getById({ id: shop_id }))) {
        return handleErrorResponse(res, 404, `No existe el negocio con el id: ${shop_id}`)
      };

      result = await usersServices.operators.getByShopId({ shop_id });
    } else {
      result = await usersServices.operators.getAll();
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

    const result = await usersServices.operators.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const op = await usersServices.operators.getById({ id });
    if (!op) return handleErrorResponse(res, 404, `El operador con el id: ${id} no existe.`);

    const result = await usersServices.users.getById({ id: op.user_id.toString("utf-8") });
    if (!result) return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);

    const userId = Object.values(result[0])[0];

    if (!(await usersServices.users.deleteById({ id: userId }))) {
      return handleErrorResponse(res, 500, `Error al eliminar el usuario.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, deleteById };

