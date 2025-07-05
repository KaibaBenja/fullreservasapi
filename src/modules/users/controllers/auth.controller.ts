import { RequestHandler, Request, Response } from "express";
import admin from "../../../config/firebase";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import * as membershipsServices from "../../memberships/services/";
import * as usersServices from "../services/";
import { sendEmail } from "../../../config/nodemailer.config";
import { htmlResetPassword } from "../utils/emails-templates/reset-password.template";
import { htmlPasswordChanged } from "../utils/emails-templates/password-changed.template";
import { DateTime } from "luxon";
import authService from "../services/auth.service";
import { loginGoogleSchema } from "../schemas/users.schema";

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

    if (!await usersServices.auth.registerUser({ ...req.body, id: userRecord.uid })) {
      return handleErrorResponse(res, 400, `No se pudo crear el usuario.`);
    }

    const user = await usersServices.users.getByEmail({ email });
    if (!user) return handleErrorResponse(res, 404, `No se encontro el usuarió por email.`);
    const userIdBuffer = user[0]?.id;
    if (!userIdBuffer) return handleErrorResponse(res, 500, `El usuario no tiene un ID válido.`);
    const userId = userIdBuffer.toString("utf-8");
    const clientRole = await usersServices.roles.getByName({ name: "CLIENT" });
    if (!clientRole) return handleErrorResponse(res, 409, `El rol CLIENT no existe.`);

    if (!(await usersServices.userRoles.add({
      user_id: userId,
      role_id: clientRole.id.toString("utf-8")
    }))) return handleErrorResponse(res, 404, `Error al asignar el rol CLIENT.`);

    if (merchant) {
      const merchantRole = await usersServices.roles.getByName({ name: "MERCHANT" });
      if (!merchantRole) return handleErrorResponse(res, 409, `El rol MERCHANT no existe.`);

      if (!(await usersServices.userRoles.add({
        user_id: userId,
        role_id: merchantRole.id.toString("utf-8")
      }))) return handleErrorResponse(res, 404, `Error al asignar el rol MERCHANT.`);

      const freePlan = await membershipsServices.membershipsPlans.getAllByFilters({ tier_name: 'FREE' });
      if (!freePlan) return handleErrorResponse(res, 404, "Plan de membresía no encontrado.")

      if (!(await membershipsServices.memberships.add({
        user_id: userId,
        tier: freePlan[0].id.toString('utf-8'),
        status: "EXPIRED"
      }))) return handleErrorResponse(res, 404, `Error al asignar la membresia.`);
    }

    const result = await usersServices.users.getById({ id: userId });
    if (!result) return handleErrorResponse(res, 404, `No se pudo encontrar el usuario después de la creación.`);

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

export const registerWithGoogle: RequestHandler = async (req, res) => {
  try {
    const { idToken, merchant } = req.body;

    if (!idToken) {
      return handleErrorResponse(res, 400, "Falta el token de autenticación de Google.");
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name: full_name } = decoded;

    if (!email || !uid || !full_name) {
      return handleErrorResponse(res, 400, "El token de Google no contiene información suficiente.");
    }

    if (await usersServices.users.getByEmail({ email })) {
      return handleErrorResponse(res, 409, `El usuario con el email: ${email} ya está registrado.`);
    }

    const registered = await usersServices.auth.registerUser({
      id: uid,
      email,
      full_name,
      password: 'GOOGLE_PASSWORD'
    });

    if (!registered) {
      return handleErrorResponse(res, 400, "No se pudo registrar el usuario en la base de datos.");
    }

    const user = await usersServices.users.getByEmail({ email });
    if (!user) return handleErrorResponse(res, 404, "Usuario no encontrado después de registrarse.");

    const userIdBuffer = user[0]?.id;
    if (!userIdBuffer) return handleErrorResponse(res, 500, "El usuario no tiene un ID válido.");
    const userId = userIdBuffer.toString("utf-8");

    const clientRole = await usersServices.roles.getByName({ name: "CLIENT" });
    if (!clientRole) return handleErrorResponse(res, 409, "El rol CLIENT no existe.");

    const addedClient = await usersServices.userRoles.add({
      user_id: userId,
      role_id: clientRole.id.toString("utf-8")
    });
    if (!addedClient) return handleErrorResponse(res, 404, "No se pudo asignar el rol CLIENT.");

    if (merchant) {
      const merchantRole = await usersServices.roles.getByName({ name: "MERCHANT" });
      if (!merchantRole) return handleErrorResponse(res, 409, "El rol MERCHANT no existe.");

      const addedMerchant = await usersServices.userRoles.add({
        user_id: userId,
        role_id: merchantRole.id.toString("utf-8")
      });
      if (!addedMerchant) return handleErrorResponse(res, 404, "No se pudo asignar el rol MERCHANT.");

      const freePlan = await membershipsServices.membershipsPlans.getAllByFilters({ tier_name: 'FREE' });
      if (!freePlan || !freePlan[0]) return handleErrorResponse(res, 404, "Plan de membresía FREE no encontrado.");

      const addedMembership = await membershipsServices.memberships.add({
        user_id: userId,
        tier: freePlan[0].id.toString("utf-8"),
        status: "EXPIRED"
      });
      if (!addedMembership) return handleErrorResponse(res, 404, "No se pudo asignar la membresía.");
    }

    const result = await usersServices.users.getById({ id: userId });
    if (!result) return handleErrorResponse(res, 404, "No se pudo obtener el usuario luego de crear.");

    res.status(201).json({
      message: "Usuario creado exitosamente con Google.",
      user: result
    });

  } catch (error) {
    console.error("Error en registro con Google:", error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

export const loginWithGoogle: RequestHandler = async (req, res) => {
  try {
    const parsed = loginGoogleSchema.safeParse(req.body);
    if (!parsed.success) {
      return handleErrorResponse(res, 400, parsed.error.errors[0].message);
    }

    const { idToken } = parsed.data;

    const user = await usersServices.auth.loginUserWithGoogle({ idToken });

    if (!user) {
      return handleErrorResponse(res, 404, "Usuario no registrado.");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error en login con Google:", error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
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

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await usersServices.users.getByEmail({ email });
    if (!user) return handleErrorResponse(res, 404, `El usuario con el email: ${email} no existe.`);

    const user_id = user[0].id.toString("utf-8");
    const user_mail = user[0].email;
    const result = await usersServices.resetToken.add({ user_id });
    if (!result) return handleErrorResponse(res, 409, "Error al crear el token.");

    const url = `https://full-reservas-web.vercel.app/auth/reset-password?token=${result.token}`;
    const html = htmlResetPassword(url, user_mail);

    await sendEmail({
      name: "Fullreservas Soporte",
      context: "recovery-noreply",
      to: user[0].email,
      subject: "Restablecimiento de contraseña de tu cuenta en Fullreservas",
      htmlContent: html
    });

    res.status(201).json({
      message: "Token creado exitosamente.",
      token: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (!token || typeof token !== 'string') {
      return handleErrorResponse(res, 400, 'El token es requerido en la query.');
    };

    const tokenFound = await usersServices.resetToken.getByToken({ token });
    if (!tokenFound) return handleErrorResponse(res, 404, `El token no existe.`);

    if (tokenFound.used) {
       return handleErrorResponse(res, 400, `El token ya fue utilizado.`);
    };

    const expires = DateTime.fromJSDate(tokenFound.expires_at, { zone: 'America/Argentina/Buenos_Aires' }).toUTC();
    const now = DateTime.utc();

    if (expires < now) {
      return handleErrorResponse(res, 404, `El token ha expirado.`);
    };

    if (!(await usersServices.resetToken.editById({
        id: tokenFound.id.toString("utf-8"),
        used: true,
      }))) {
      return handleErrorResponse(res, 404, `Error al marcar el token como usado.`);
    }; 

    if (!(await usersServices.users.editById({
      id: tokenFound.user_id.toString("utf-8"),
      password
    }))) {
      return handleErrorResponse(res, 404, `Error al cambiar la contraseña.`);
    };
    const local_now = now.setLocale("es");
    const rawMonth = local_now.toFormat("LLLL");
    const capitalizedMonth = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);

    let formatted = `${local_now.toFormat("d")} de ${capitalizedMonth}, ${local_now.toFormat("yyyy - hh:mm a")}`;
    formatted = formatted.replace("a. m.", "AM").replace("p. m.", "PM").replace("a.m.", "AM").replace("p.m.", "PM");
    const html = htmlPasswordChanged(tokenFound.user!.email, formatted);
    await sendEmail({
      name: "Fullreservas Soporte",
      context: "recovery-noreply",
      to: tokenFound.user!.email,
      subject: "¡Tu contraseña fue restablecida con éxito!",
      htmlContent: html
    });
       
    res.status(201).json({
      message: "Contraseña restablecida exitosamente.",
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
}
