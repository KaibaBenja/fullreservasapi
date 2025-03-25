import { RequestHandler } from "express";
import admin from "../../../config/firebase";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import * as usersServices from "../services/";
import * as membershipsServices from "../../memberships/services/";

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, merchant } = req.body;

    if (await usersServices.users.getByEmail({ email })) {
      return handleErrorResponse(res, 409, `El usuario con el email: ${email} ya está registrado.`);
    };

    const { full_name, password } = req.body;
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: full_name,
    });

    if(!await usersServices.auth.registerUser({ ...req.body, id: userRecord.uid })){
      return handleErrorResponse(res, 400, `No se pudo crear el usuario.`);
    }
    
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

export const login: RequestHandler = async (req, res) => {
  try {
    const user = await usersServices.auth.loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error logging in",
    });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    await usersServices.auth.logoutUser(req.body);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};
