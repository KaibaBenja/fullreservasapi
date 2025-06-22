import { Request, Response } from "express";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import * as usersServices from "../../users/services/";
import * as shopsServices from "../services";
import { validateTimes } from "../utils/formatTime";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, subcategory_id, shift_type, average_stay_time, capacity, open_time1, close_time1, open_time2, close_time2 } = req.body;

    const user = (await usersServices.users.getById({ id: user_id }));
    if (!user) return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);

    const role = await usersServices.roles.getByName({ name: "MERCHANT" });
    if (!role) return handleErrorResponse(res, 409, `El rol MERCHANT no existe.`);

    if (!(await usersServices.userRoles.getAllByFilters({ user_id, role_id: role.id.toString("utf-8") }))) {
      return handleErrorResponse(res, 409, `El usuario no posee el rol MERCHANT.`);
    };

    if (!(await shopsServices.subcategories.getById({ id: subcategory_id }))) {
      return handleErrorResponse(res, 404, `La subcategoría con el id: ${subcategory_id} no existe.`);
    };

    // Validamos por las dudas que el user tenga estos campos
    if (!(user[0].membership) || !(user[0].membership.membership_plan)) {
      return handleErrorResponse(res, 404, "Error inesperado.");
    };

    // Los asignamos a una variable para mayor legibilidad
    const membershipPlan = user[0].membership.membership_plan;

    // Buscamos si existe el shop
    const shopsExists = await shopsServices.shops.getAllByFilters({ user_id });

    // Validamos que no haya superado el límite de shops permitidos
    const shopCount = shopsExists?.length || 0;

    if (shopCount >= membershipPlan.quantity) {
      return handleErrorResponse(res, 409, `Debido a la membresía: ${membershipPlan.tier_name}, no puedes tener más de ${membershipPlan.quantity} negocios.`);
    };

    if (shift_type === "DOUBLESHIFT" && (!open_time1 || !close_time1 || !open_time2 || !close_time2)) {
      return handleErrorResponse(res, 409, `Faltan datos para el ingreso de horarios para el caso de doble turno.`);
    };

    // Primero armo los schedules sin shop_id
    const schedules = shift_type === "DOUBLESHIFT"
      ? [
        { open_time: open_time1, close_time: close_time1 },
        { open_time: open_time2, close_time: close_time2 }
      ]
      : [{ open_time: open_time1, close_time: close_time1 }];

    // Validación de horarios antes de crear el shop
    for (const [index, schedule] of schedules.entries()) {
      const validationError = validateTimes(schedule.open_time, schedule.close_time);
      if (validationError) {
        return handleErrorResponse(res, 400, `Error en turno ${index + 1}: ${validationError}`);
      }
    }

    if (!(await shopsServices.shops.add(req.body))) {
      return handleErrorResponse(res, 500, `Error al agregar el negocio.`);
    }

    const result = await shopsServices.shops.getAllByFilters({ user_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar el negocio agregado.`);

    const shopId = Object.values(result[0])[0];

    // Agrego shop_id a cada schedule
    const schedulesWithShopId = schedules.map(schedule => ({
      shop_id: shopId,
      ...schedule,
    }));

    const scheduleResults = await Promise.all(schedulesWithShopId.map(schedule => shopsServices.schedules.add(schedule)));

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
    const {
      user_id, subcategory_id, shift_type, average_stay_time, capacity,
      open_time1, close_time1, open_time2, close_time2
    } = req.body;

    if (!validateUUID(id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    }

    // Verificar si el shop existe
    if (!(await shopsServices.shops.getById({ id }))) {
      return handleErrorResponse(res, 404, `El negocio con el id: ${id} no existe.`);
    };

    // Validaciones de usuario si se proporciona
    if (user_id) {
      if (!validateUUID(user_id, res)) return;

      if (!(await usersServices.users.getById({ id: user_id }))) {
        return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
      };

      // Verificar si el usuario tiene rol MERCHANT
      const role = await usersServices.roles.getByName({ name: "MERCHANT" });
      if (!role) return handleErrorResponse(res, 409, `El rol MERCHANT no existe.`);

      if (!(await usersServices.userRoles.getAllByFilters({
        user_id,
        role_id: role.id.toString("utf-8")
      }))) {
        return handleErrorResponse(res, 409, `El usuario no posee el rol MERCHANT.`);
      };
    };

    // Validación de subcategoría si se proporciona
    if (subcategory_id) {
      if (!validateUUID(subcategory_id, res)) return;

      if (!(await shopsServices.subcategories.getById({ id: subcategory_id }))) {
        return handleErrorResponse(res, 404, `La subcategoría con el id: ${subcategory_id} no existe.`);
      };
    };

    // Validación para horarios en caso de doble turno
    if (shift_type === "DOUBLESHIFT" && (!open_time1 || !close_time1 || !open_time2 || !close_time2)) {
      return handleErrorResponse(res, 409, `Faltan datos para el ingreso de horarios para el caso de doble turno.`);
    }

    // Actualizar el shop
    if (!(await shopsServices.shops.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar el negocio.`);
    }

    // Si se están actualizando horarios o capacity o average_stay_time
    if (shift_type || average_stay_time || capacity || open_time1 || close_time1 || open_time2 || close_time2) {
      // Eliminar schedules y available slots existentes
      if (!(await shopsServices.schedules.deleteByShopId({ shop_id: id }))) {
        return handleErrorResponse(res, 500, `Error al eliminar los horarios existentes.`);
      };

      if (!(await shopsServices.availableSlots.deleteByShopId({ shop_id: id }))) {
        return handleErrorResponse(res, 500, `Error al eliminar los espacios disponibles existentes.`);
      };

      // VALIDACIÓN DE SCHEDULES

      // Crear nuevos schedules
      const schedules = shift_type === "DOUBLESHIFT"
        ? [
          { shop_id: id, open_time: open_time1, close_time: close_time1 },
          { shop_id: id, open_time: open_time2, close_time: close_time2 }
        ]
        : [{ shop_id: id, open_time: open_time1, close_time: close_time1 }];

      const scheduleResults = await Promise.all(schedules.map(schedule =>
        shopsServices.schedules.add(schedule)
      ));

      const failedSchedules = scheduleResults.filter(result => !result);
      if (failedSchedules.length > 0) {
        return handleErrorResponse(res, 400, `Error al agregar uno o más horarios del negocio.`);
      };

      // Crear nuevos available slots
      let available_slots: any[] = [];
      for (const schedule of schedules) {
        try {
          const slots = await shopsServices.availableSlots.add({
            shop_id: id,
            start_time: schedule.open_time,
            end_time: schedule.close_time,
            average_stay_time,
            capacity
          });

          if (slots) available_slots.push(...slots);
        } catch (err) {
          return handleErrorResponse(
            res,
            400,
            `Error al agregar espacios libres para el horario de ${schedule.open_time} a ${schedule.close_time}.`
          );
        };
      };

      if (available_slots.length === 0) {
        return handleErrorResponse(res, 400, `Error al agregar los espacios libres.`);
      };
    };

    // Obtener el shop actualizado
    const result = await shopsServices.shops.getById({ id });
    if (!result) {
      return handleErrorResponse(res, 400, `Error al encontrar el negocio actualizado.`);
    };

    res.status(200).json({
      message: "Negocio actualizado exitosamente",
      shop: result
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
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
    const shops = await shopsServices.shops.getAllByFiltersUser({ none: true });

    if (!shops) return handleErrorResponse(res, 400, "?");

    const shopsWithRatings = await Promise.all(
      shops.map(async (shop: any) => {
        try {
          const ratings = await shopsServices.ratings.getAllByFiltersShopId({ shop_id: shop.id, status: 'COMPLETED' });

          // Calcular promedio si hay ratings
          let average_rating: number | null = null;
          let ratingCount: number = 0;
          if (ratings && ratings.length > 0) {
            const total = ratings.reduce((acc, curr) => {
              const rating = typeof curr.rating === 'string' ? parseFloat(curr.rating) : curr.rating;
              return acc + rating;
            }, 0);
            ratingCount = ratings.length;
            average_rating = parseFloat((total / ratings.length).toFixed(2)); // promedio con 2 decimales
          };

          return { ...shop, average_rating, ratingCount };
        } catch (e) {
          // En caso de error, devolver el shop sin rating
          return { ...shop, average_rating: null, ratingCount: 0 };
        }
      })
    );

    shopsWithRatings.sort((a, b) => {
      const ratingA = a.average_rating ?? 0;
      const ratingB = b.average_rating ?? 0;
      return ratingB - ratingA;
    });

    res.status(200).json(shopsWithRatings);
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

