import { Request, Response } from "express";
import * as shopsServices from "../../shops/services";
import * as bookingsServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { booking_id, table_id } = req.body;

    if (!(await bookingsServices.bookings.getById({ id: booking_id }))) {
      return handleErrorResponse(res, 404, `La reserva con el id: ${booking_id} no existe.`);
    };

    if (!await shopsServices.tables.getById({ id: table_id })) {
      return handleErrorResponse(res, 400, `La mesa con el id: ${table_id} no existe.`);
    };

    if (!await bookingsServices.bookedTables.add(req.body)) {
      return handleErrorResponse(res, 400, `Error al crear la mesa reservada.`);
    };

    const result = await bookingsServices.bookedTables.getAllByFilters(req.body);
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la mesa reservada.`);

    res.status(201).json({
      message: "Mesa reservada creada exitosamente",
      bookedTable: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await bookingsServices.bookedTables.getAll();

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFiltersBookingId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { booking_id } = req.params;

    if (!validateUUID(booking_id, res)) return;

    if (!await bookingsServices.bookings.getById({ id: booking_id })) {
      return handleErrorResponse(res, 400, `La reserva con el id: ${booking_id} no existe.`);
    };

    const result = await bookingsServices.bookedTables.getAllByFiltersBookingId({ booking_id, ...req.body });

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    if (id && !validateUUID(id, res)) return;

    const result = await bookingsServices.bookedTables.getAllByFilters(req.body);

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await bookingsServices.bookedTables.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La mesa reservada con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await bookingsServices.bookedTables.getById({ id }))) return handleErrorResponse(res, 404, `La mesa reservada con el id: ${id} no existe.`);

    if (!(await bookingsServices.bookedTables.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la mesa reservada.`);
    };

    const result = await bookingsServices.bookedTables.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la mesa reservada actualizada.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await bookingsServices.bookedTables.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La mesa reservada con el id: ${id} no existe.`);

    if (!(await bookingsServices.bookedTables.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar la mesa reservada.`);
    };

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFiltersBookingId, getAllByFilters, getById, editById, deleteById };

