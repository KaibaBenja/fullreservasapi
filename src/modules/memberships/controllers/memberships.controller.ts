import { Request, Response } from "express";
import * as membershipsServices from "../services";
import * as usersServices from "../../users/service/";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { zodValidateData } from "../../../utils/zodValidator";
import { tierSchema, statusSchema } from "../schemas/memberships.schema";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.body;

    if (!(await usersServices.users.getById(user_id))) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
    };

    if (await membershipsServices.memberships.getByUserId(user_id)) {
      return handleErrorResponse(res, 404, `La membresia con el id de usuario: ${user_id} ya existe.`);
    };

    if (!(await membershipsServices.memberships.add(req.body))) {
      return handleErrorResponse(res, 400, `Error al agregar la membresia.`);
    };

    const membershipExists = await membershipsServices.memberships.getByUserId(user_id);
    if (!membershipExists) {
      return handleErrorResponse(res, 404, `Error al encontrar la membresia agregada.`);
    };

    res.status(201).json({
      message: "Membresia agregada exitosamente.",
      membership: membershipExists,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, tier, status } = req.query;
    let message;
    let result;

    if (user_id && typeof user_id === "string") {
      if (!validateUUID(user_id, res)) return;

      if (!(await usersServices.users.getById(user_id))) {
        return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
      };

      result = await membershipsServices.memberships.getByUserId(user_id);
      message = `Membresia con el id de usuario: ${user_id} obtenida existosamente.`;
    }
    else if (tier && typeof tier === "string") {
      if (!zodValidateData(tierSchema, tier, res).isValid) return;

      result = await membershipsServices.memberships.getAllByTier(tier);
      message = `Membresias de nivel: ${tier} obtenidas existosamente.`;
    }
    else if (status && typeof status === "string") {
      if (!zodValidateData(statusSchema, status, res).isValid) return;

      result = await membershipsServices.memberships.getAllByStatus(status);
      message = `Membresias de estado: ${status} obtenidas existosamente.`;
    }
    else {
      result = await membershipsServices.memberships.getAll();
      message = `Membresias obtenidos exitosamente.`;
    };

    if (Array.isArray(result) && result.length === 0 && !result) { return handleErrorResponse(res, 404, "No se encontraron membresias."); };

    res.status(200).json({ message, memberships: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await membershipsServices.memberships.getById(id);
    if (!result) {
      return handleErrorResponse(res, 404, `La membresia con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Membresia encontrado exitosamente.",
      membership: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await membershipsServices.memberships.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo editar la membresía con el id: ${id}.`);
    };

    const updatedMembership = await membershipsServices.memberships.getById(id);
    if (!updatedMembership) {
      return handleErrorResponse(res, 404, `La membresía con el id: ${id} no existe.`);
    };

    res.status(200).json({
      message: "Membresía editada exitosamente.",
      user: updatedMembership,
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await membershipsServices.memberships.getById(id);
    if (!result) {
      return handleErrorResponse(res, 404, `La membresia con el id: ${id} no existe.`);
    };

    if (!await membershipsServices.memberships.deleteById(id)) {
      return handleErrorResponse(res, 404, `Error al eliminar la membresia.`);
    };

    res.status(200).json({
      message: "Membresia eliminada exitosamente.",
      membership: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

