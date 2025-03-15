import { Request, Response } from "express";
import * as usersServices from "../../users/service";
import * as shopsServices from "../../shops/services";
import * as bookingsServices from "../service";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, shop_id, booked_slot_id } = req.body;

    if (!await usersServices.users.getById(user_id)) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    if (!await shopsServices.shops.getById(shop_id)) {
      return handleErrorResponse(res, 400, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (!await shopsServices.availableSlots.getById({ id: booked_slot_id })) {
      return handleErrorResponse(res, 400, `El espacio disponible con el id: ${booked_slot_id} no existe.`);
    };

    if (!await bookingsServices.bookings.add(req.body)) {
      return handleErrorResponse(res, 400, `Error al crear la reserva.`);
    };

    const result = await bookingsServices.bookings.getAllByFiltersUserId(req.body);
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la reserva.`);

    res.status(201).json({
      message: "Reserva creado exitosamente",
      booking: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await bookingsServices.bookings.getAll();

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron reservas.");
    };

    res.status(201).json({
      message: "Reservas encontradas exitosamente.",
      bookings: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFiltersUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!validateUUID(user_id, res)) return;

    if (!await usersServices.users.getById(user_id)) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    const result = await bookingsServices.bookings.getAllByFiltersUserId({ user_id, ...req.body });
    if (!result) return handleErrorResponse(res, 404, `Las reservas con los filtros no existen.`);

    res.status(201).json({
      message: "Reservas encontradas exitosamente.",
      bookings: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFiltersShopId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;

    if (!validateUUID(shop_id, res)) return;

    if (!await shopsServices.shops.getById(shop_id)) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${shop_id} no existe.`);
    };

    const result = await bookingsServices.bookings.getAllByFiltersShopId({ shop_id, ...req.body });
    if (!result) return handleErrorResponse(res, 404, `Las reservas con los filtros no existen.`);

    res.status(201).json({
      message: "Reservas encontradas exitosamente.",
      bookings: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    if (id && !validateUUID(id, res)) return;

    const result = await bookingsServices.bookings.getAllByFilters(req.body);
    if (!result) return handleErrorResponse(res, 404, `Las reservas con los filtros no existen.`);

    res.status(201).json({
      message: "Reservas encontradas exitosamente.",
      bookings: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await bookingsServices.bookings.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La reserva con el id: ${id} no existe.`);

    res.status(201).json({
      message: "Reserva encontradas exitosamente.",
      booking: result,
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

    if (!(await bookingsServices.bookings.getById({ id }))) return handleErrorResponse(res, 404, `La reserva con el id: ${id} no existe.`);

    if (!(await bookingsServices.bookings.editById({id, ...req.body}))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la reserva.`);
    };

    const result = await bookingsServices.bookings.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la reserva actualizada.`);

    res.status(201).json({
      message: "Reserva actualizada exitosamente.",
      booking: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await bookingsServices.bookings.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La reserva con el id: ${id} no existe.`);

    if (!(await bookingsServices.bookings.deleteById({ id }))) return handleErrorResponse(res, 404, `Error al eliminar la mesa reservada.`);

    res.status(201).json({
      message: "Reserva eliminada exitosamente.",
      booking: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFiltersUserId, getAllByFiltersShopId, getAllByFilters, getById, editById, deleteById };

