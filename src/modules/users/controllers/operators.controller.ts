import { Request, Response } from "express";
import * as usersServices from "../services";
import * as shopsServices from "../../shops/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import admin from "../../../config/firebase";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, password, shop_id } = req.body;

    const shop = await shopsServices.shops.getById({ id: shop_id });
    if (!shop)
      return handleErrorResponse(
        res,
        400,
        `El negocio con el id: ${shop_id} no existe.`
      );

    const sanitizedUsername = full_name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

    const sanitizedShopName = shop.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

    const email = `${sanitizedUsername}@${sanitizedShopName}.com`
      .toLowerCase()
      .replace(/\s+/g, "");

    if (await usersServices.users.getByEmail({ email: email })) {
      return handleErrorResponse(
        res,
        409,
        `El usuario con el nombre: ${full_name} ya está registrado.`
      );
    }

    if (await usersServices.operators.getByShopId({ shop_id })) {
      return handleErrorResponse(
        res,
        400,
        `El operador del negocio con id: ${shop_id} ya existe.`
      );
    }

    let userFirebase = null;
    try {
      userFirebase = await admin.auth().getUserByEmail(email);
    } catch (err: any) {
      if (err.code !== "auth/user-not-found") {
        throw err;
      }
    }
    if (userFirebase)
      return handleErrorResponse(
        res,
        409,
        `El usuario con el email ya existe en Firebase.`
      );

    // Crear usuario
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: full_name,
    });

    if (
      !(await usersServices.auth.registerUser({
        id: userRecord.uid,
        email: email,
        full_name: full_name,
        password,
      }))
    )
      return handleErrorResponse(res, 400, `No se pudo crear el usuario.`);

    const user = await usersServices.users.getByEmail({ email });
    if (!user)
      return handleErrorResponse(
        res,
        404,
        `No se encontro el usuarió por email.`
      );

    // Asignr rol operador
    const operatorRole = await usersServices.roles.getByName({
      name: "OPERATOR",
    });
    if (!operatorRole)
      return handleErrorResponse(res, 409, `El rol OPERATOR no existe.`);

    if (
      !(await usersServices.userRoles.add({
        user_id: user.id.toString("utf-8"),
        role_id: operatorRole.id.toString("utf-8"),
      }))
    )
      return handleErrorResponse(res, 404, `Error al asignar el rol OPERATOR.`);

    // Asignar usuario a operators
    if (
      !(await usersServices.operators.add({
        user_id: user.id.toString("utf-8"),
        shop_id,
      }))
    )
      return handleErrorResponse(res, 400, `Error al crear el operador.`);

    const result = await usersServices.operators.getByUserAndShop({
      user_id: user.id.toString("utf-8"),
      shop_id,
    });

    if (!result)
      return handleErrorResponse(
        res,
        404,
        `Error al encontrar el operaddor agregado.`
      );

    res.status(201).json({
      message: "Operador creado exitosamente.",
      operator: result,
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;
    let result;

    if (shop_id && typeof shop_id === "string") {
      if (!validateUUID(shop_id, res)) return;

      if (!(await shopsServices.shops.getById({ id: shop_id }))) {
        return handleErrorResponse(
          res,
          404,
          `No existe el negocio con el id: ${shop_id}`
        );
      }

      result = await usersServices.operators.getByShopId({ shop_id });
    } else {
      result = await usersServices.operators.getAll();
    }

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await usersServices.operators.getById({ id });
    if (!result)
      return handleErrorResponse(
        res,
        404,
        `El operador con el id: ${id} no existe.`
      );

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const op = await usersServices.operators.getById({ id });
    if (!op)
      return handleErrorResponse(
        res,
        404,
        `El operador con el id: ${id} no existe.`
      );

    const result = await usersServices.users.getById({
      id: op.user_id.toString("utf-8"),
    });
    if (!result)
      return handleErrorResponse(
        res,
        404,
        `El usuario con el id: ${id} no existe.`
      );

    const userId = Object.values(result[0])[0];

    if (!(await usersServices.users.deleteById({ id: userId }))) {
      return handleErrorResponse(res, 500, `Error al eliminar el usuario.`);
    }

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

export default { create, getAll, getById, deleteById };
