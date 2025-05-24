import { Request, Response } from "express";
import * as membershipsServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tier_name } = req.body;

    if (await membershipsServices.membershipsPlans.getAllByFilters({ tier_name })) {
      return handleErrorResponse(res, 409, `El plan de membresia con el nivel: ${tier_name} ya existe.`);
    };

    if (!(await membershipsServices.membershipsPlans.add(req.body))) {
      return handleErrorResponse(res, 400, `Error al agregar el plan de membresia.`);
    };

    const result = await membershipsServices.membershipsPlans.getAllByFilters({ tier_name });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el plan de membresia agregada.`);

    res.status(201).json({
      message: "Plan de membresia agregada exitosamente.",
      membershipPlan: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await membershipsServices.membershipsPlans.getAll();

    res.status(200).json(result ?? []);
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await membershipsServices.membershipsPlans.getAllByFilters(req.body);

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await membershipsServices.membershipsPlans.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El plan de membresia con el id: ${id} no existe.`);

    res.status(201).json(result);
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

    if (!(await membershipsServices.membershipsPlans.getById({ id }))) {
      return handleErrorResponse(res, 404, `El plan de membresía con el id: ${id} no existe.`);
    };

    if (!(await membershipsServices.membershipsPlans.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo editar el plan de membresía con el id: ${id}.`);
    };

    const result = await membershipsServices.membershipsPlans.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al buscar el plan de membresia editada.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await membershipsServices.membershipsPlans.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `El plan de membresia con el id: ${id} no existe.`);

    if (!await membershipsServices.membershipsPlans.deleteById({ id })) {
      return handleErrorResponse(res, 404, `Error al eliminar el plan de membresia.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFilters, getById, editById, deleteById };

