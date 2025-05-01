import { Request, Response } from "express";
import * as usersServices from "../../users/services";
import * as shopsServices from "../../shops/services";
import * as bookingsServices from "../services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import { generateBookingCode } from "../utils/generateBookingCode";
import { getAllCombinations } from "../utils/generateAllCombinations";
import { mapComboToTables, TableMapCombo } from "../utils/mapComboToTables";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, shop_id, booked_slot_id, date, guests, location_type, floor, roof_type } = req.body;

    if (!await usersServices.users.getById({ id: user_id })) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    // ✅✅
    const shop = await shopsServices.shops.getById({ id: shop_id })
    if (!shop) return handleErrorResponse(res, 400, `El negocio con el id: ${shop_id} no existe.`);

    // ✅✅
    if (!(await shopsServices.availableSlots.getById({ id: booked_slot_id }))) {
      return handleErrorResponse(res, 400, `El espacio disponible con el id: ${booked_slot_id} no existe.`);
    };

    // Buscar todos los bookings por fecha y hora en un mismo comercio 
    // ✅✅
    const currentBookings = await bookingsServices.bookings.getAllByFiltersShopId({ shop_id, date, booked_slot_id });
    console.log({ currentBookings: currentBookings });
    if (currentBookings) {
      let suma_guest = 0;

      // Cantidad de comensales reservados en horario y día
      for (const booking of currentBookings) {
        suma_guest += booking.guests;
      };

      // Se resta a la capacidad total los reservados obteniendo la DISPONIBILIDAD!
      const total_guests = shop.capacity - suma_guest;
      console.log({
        shopCapacity: shop.capacity,
        suma_guest: suma_guest,
        total_guests: total_guests,
      })
      // Si el resultado es menor, el comercio no tiene capacidad :c
      if (total_guests < guests) {
        return handleErrorResponse(res, 409, `El negocio no tiene disponibilidad para el horario y la cantidad de comensales.`);
      };
    };

    // ✅✅
    // Busqueda de mesas por lo solicitado del cliente 
    const filteredTables = await shopsServices.tables.getAllByFiltersShopId({
      shop_id,
      location_type,
      floor,
      roof_type
    });
    if (!filteredTables) return handleErrorResponse(res, 404, "El comercio no dispone de mesas con las características solicitadas.");


    // ✅✅
    // Mesas reservadas en el día y horario 
    const currentBookedTables = [];
    if (currentBookings) {
      for (const currentBooking of currentBookings) {
        // Se busca en bookedTables las mesas reservadas por cada reserva del día y horario (currentBookings)
        const bookedTables = await bookingsServices.bookedTables.getAllByFiltersBookingId({
          booking_id: currentBooking.id.toString("utf-8")
        });

        // Si hay resultado agregarlo al array :3
        if (bookedTables && bookedTables.length > 0) {
          currentBookedTables.push(...bookedTables);
        };
      };
    };
    console.log({ currentBookedTables: currentBookedTables })

    // ✅✅
    const availableTables = [];
    if (currentBookedTables.length > 0) {
      for (const filteredTable of filteredTables) {
        // Mesas reservadas en el día y horario con mismas características
        const CBT = currentBookedTables.filter(
          (item) => item.table_id === filteredTable.id
        );

        /*
          Se crea un array con la cantidad real de mesas disponibles.
          Para eso se toma la cantidad total de mesas de filteredTables 
          (siempre por table_id) y se resta la cantidad de mesas reservadas 
          en EqualCurrentBookedTables.
        */
        if (CBT.length > 0) {
          // Sumamos las mesas reservadas con el mismo table_id
          const totalBooked = CBT.reduce((sum, item) => sum + item.tables_booked, 0);

          const actualQuantity = filteredTable.quantity - totalBooked;

          /*
            Si la resta es mayor a cero, se guarda esa table_id y el 
            resultado de la resta (capacidad real = actualQuantity) 
            en availableTables(table_id, ActualQuantity)
          */
          if (actualQuantity > 0) {
            availableTables.push({
              table_id: filteredTable.id,
              remaining: actualQuantity,
              guests: filteredTable.capacity
            });
          };
        };
      };
    } else {
      for (const filteredTable of filteredTables) {
        availableTables.push({
          table_id: filteredTable.id,
          remaining: filteredTable.quantity,
          guests: filteredTable.capacity
        });
      }
    };
    if (!availableTables) {
      return handleErrorResponse(res, 409, "Todas las mesas con las características solicitadas se encuentran ocupadas.");
    };
    console.log({ availableTables: availableTables });


    // ✅✅
    /*
      Se desglosa las mesas disponibles en capacidades individuales y se guarda en un array. 
      Capacidad veces Cantidad.
      Ej: Si tengo 2 mesas de 4 personas y 3 mesas de 5 personas, el array sería asi: [4, 4, 5, 5, 5]
    */
    const actualTables = [];
    for (const table of availableTables) {
      for (let i = 0; i < table.remaining; i++) {
        actualTables.push(table.guests);
      };
    };
    console.log({ actualTables: actualTables });

    const sumaActualTables = actualTables.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    if (sumaActualTables < guests) {
      return handleErrorResponse(res, 409, "No hay mesas disponibles para la cantidad de comensales.");
    };

    // ✅✅
    const allCombinations = getAllCombinations(actualTables);
    console.log({ allCombinations: allCombinations })

    // ✅✅
    const validCombinations: number[][] = allCombinations.filter((combination: number[]) => {
      const totalSeats: number = combination.reduce((acc, val) => acc + val, 0);
      return totalSeats >= guests;
    });
    console.log({ PRESORTvalidCombinations: validCombinations });

    // ✅✅
    validCombinations.sort((a: number[], b: number[]): number => {
      if (a.length !== b.length) {
        return a.length - b.length;
      };

      const aWaste: number = a.reduce((acc, val) => acc + val, 0) - guests;
      const bWaste: number = b.reduce((acc, val) => acc + val, 0) - guests;

      return aWaste - bWaste;
    });
    console.log({ POSTSORTvalidCombinations: validCombinations });

    // ✅✅
    const bestTableCombination = validCombinations.length > 0 ? validCombinations[0] : null;
    if (!bestTableCombination) {
      return handleErrorResponse(res, 404, "No se encontró la combinación adecuada.");
    };
    console.log({ bestTableCombination: bestTableCombination });


    // ✅✅
    const formattedTables: TableMapCombo[] = availableTables.map((t) => ({
      table_id: t.table_id.toString("utf-8"),
      guests: t.guests,
      remaining: t.remaining
    }));
    console.log({ formattedTables: formattedTables });

    // ✅✅
    const tablesToBook = mapComboToTables(bestTableCombination, formattedTables);
    console.log({ tablesToBook: tablesToBook });

    let code: string;
    let exists: boolean;

    do {
      code = generateBookingCode();
      const existingBooking = await bookingsServices.bookings.getAllByFilters({ booking_code: code, status: "PENDING" }) ?? [];
      exists = existingBooking.length > 0 ? true : false;
    } while (exists);

    // Primero crear reserva
    if (!(await bookingsServices.bookings.add({ ...req.body, booking_code: code }))) {
      return handleErrorResponse(res, 400, `Error al crear la reserva.`);
    };

    const bookingCreated = await bookingsServices.bookings.getAllByFiltersUserId({ ...req.body, booking_code: code, status: "PENDING" });
    if (!bookingCreated) return handleErrorResponse(res, 404, `Error al encontrar la reserva.`);

    const bookingCreatedId = Object.values(bookingCreated[0])[0];

    // Segundo crear booked
    if (!tablesToBook) {
      return handleErrorResponse(res, 400, "Error inesperado.")
    };

    // ✅✅
    // Primero agrupar
    const groupedTables: Record<string, { tables_booked: number; guests: number }> = {};
    for (const t of tablesToBook) {
      if (!groupedTables[t.table_id]) {
        groupedTables[t.table_id] = { tables_booked: 0, guests: 0 };
      }

      groupedTables[t.table_id].tables_booked++;
      groupedTables[t.table_id].guests += t.guests;
    };

    // Luego insertar los registros agrupados
    for (const table_id in groupedTables) {
      const { tables_booked, guests } = groupedTables[table_id];
      console.log({ table_id: table_id });
      try {
        await bookingsServices.bookedTables.add({
          booking_id: bookingCreatedId.toString("utf-8"),
          table_id,
          tables_booked,
          guests,
        });
      } catch (err) {
        console.log(err);
        return handleErrorResponse(res, 400, "Error al crear las bookedTables.");
      };
    };

    const result = await bookingsServices.bookedTables.getAllByFiltersBookingId({
      booking_id: bookingCreatedId.toString("utf-8")
    });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la reserva.`);

    res.status(201).json({
      message: "Reserva creado exitosamente",
      result: { booking: bookingCreated, bookedTables: result },
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await bookingsServices.bookings.getAll();

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

    const result = await bookingsServices.bookings.getAllByFiltersUserId({ user_id, ...req.body });

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

    const result = await bookingsServices.bookings.getAllByFiltersShopId({ shop_id, ...req.body });

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    if (id && !validateUUID(id, res)) return;

    const result = await bookingsServices.bookings.getAllByFilters(req.body);

    res.status(201).json(result ?? []);
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

    if (!(await bookingsServices.bookings.getById({ id }))) return handleErrorResponse(res, 404, `La reserva con el id: ${id} no existe.`);

    if (!(await bookingsServices.bookings.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la reserva.`);
    };

    const result = await bookingsServices.bookings.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la reserva actualizada.`);

    res.status(201).json(result);
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

    if (!(await bookingsServices.bookings.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar la mesa reservada.`);
    };

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFiltersUserId, getAllByFiltersShopId, getAllByFilters, getById, editById, deleteById };

