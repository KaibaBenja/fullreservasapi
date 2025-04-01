import { Request, Response } from "express";
import * as shopsServices from "../services";
import * as  usersServices from "../../users/services/";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, subcategory_id, shift_type, average_stay_time, capacity, open_time1, close_time1, open_time2, close_time2 } = req.body;

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
      return handleErrorResponse(res, 409, `El negocio ya existe.`);
    };

    if (shift_type === "DOUBLESHIFT" && (!open_time1 || !close_time1 || !open_time2 || !close_time2)) {
      return handleErrorResponse(res, 409, `Faltan datos para el ingreso de horarios para el caso de doble turno.`);
    };

    if (!(await shopsServices.shops.add(req.body))) {
      return handleErrorResponse(res, 500, `Error al agregar el negocio.`);
    }

    const result = await shopsServices.shops.getAllByFilters({ user_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el negocio agregado.`);

    const shopId = Object.values(result[0])[0];

    const schedules = shift_type === "DOUBLESHIFT"
      ? [
        { shop_id: shopId, open_time: open_time1, close_time: close_time1 },
        { shop_id: shopId, open_time: open_time2, close_time: close_time2 }
      ]
      : [{ shop_id: shopId, open_time: open_time1, close_time: close_time1 }];

    const scheduleResults = await Promise.all(schedules.map(schedule => shopsServices.schedules.add(schedule)));

    const failedSchedules = scheduleResults.filter(result => !result);
    if (failedSchedules.length > 0) {
      return handleErrorResponse(res, 400, `Error al agregar uno o más horarios del negocio.`);
    };

    let available_slots: any[] = [];
    for (const schedule of schedules) {
      try {
        const slots = await shopsServices.availableSlots.add({
          shop_id: shopId,
          start_time: schedule.open_time,
          end_time: schedule.close_time,
          average_stay_time,
          capacity
        });

        if (slots) available_slots.push(...slots);
      } catch (err) {
        return handleErrorResponse(res, 400, `Error al agregar espacios libres para el horario de ${schedule.open_time} a ${schedule.close_time}.`);
      };
    };

    if (available_slots.length === 0) {
      return handleErrorResponse(res, 400, `Error al agregar los espacios libres.`);
    };

    res.status(201).json({
      message: "Negocio agregado exitosamente",
      shop: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, `Error interno del servidor.`);
  };
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

