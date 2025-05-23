import { Request, Response } from "express";
import * as usersServices from "../../users/services";
import * as shopsServices from "../services";
import * as bookingsServices from "../../bookings/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, shop_id, booking_id } = req.body;

    if (!await shopsServices.shops.getById({ id: shop_id })) {
      return handleErrorResponse(res, 400, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (!await usersServices.users.getById({ id: user_id })) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    if (!(await bookingsServices.bookings.getById({ id: booking_id }))) {
      return handleErrorResponse(res, 404, `La reserva con el id: ${booking_id} no existe.`);
    };

    if (await shopsServices.ratings.getAllByFilters({ user_id, shop_id, booking_id })) {
      return handleErrorResponse(res, 400, `La reseña ya fue creada.`);
    };

    if (!await shopsServices.ratings.add(req.body)) {
      return handleErrorResponse(res, 400, `Error al crear la reseña.`);
    };

    const result = await shopsServices.ratings.getAllByFilters(req.body);
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la reseña creada.`);

    res.status(201).json({
      message: "Reseña creada exitosamente.",
      rating: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.ratings.getAll();

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFiltersUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!validateUUID(user_id, res)) return;

    if (!await usersServices.users.getById({ id: user_id })) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    const result = await shopsServices.ratings.getAllByFiltersUserId({ user_id, ...req.body });

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFiltersShopId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.params;

    if (!validateUUID(shop_id, res)) return;

    if (!await shopsServices.shops.getById({ id: shop_id })) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${shop_id} no existe.`);
    };

    const result = await shopsServices.ratings.getAllByFiltersShopId({ shop_id, ...req.body });

    res.status(201).json(result ?? []);
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    if (id && !validateUUID(id, res)) return;

    const result = await shopsServices.ratings.getAllByFilters(req.body);

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.ratings.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La reseña con el id: ${id} no existe.`);

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

    if (!(await shopsServices.ratings.getById({ id }))) {
      return handleErrorResponse(res, 404, `La reserva con el id: ${id} no existe.`);
    };

    if (!(await shopsServices.ratings.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la reseña.`);
    };

    const result = await shopsServices.ratings.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la reseña actualizada.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const result = await shopsServices.ratings.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La reserva con el id: ${id} no existe.`);

    if (!(await shopsServices.ratings.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar la mesa reseña.`);
    };

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFiltersUserId, getAllByFiltersShopId, getAllByFilters, getById, editById, deleteById };

