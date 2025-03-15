import { IBookedTables } from "../types/bookedTables.types";
import Bookedtable from "../models/bookedTables.model";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";


const add = async ({ booking_id, table_id, tables_booked, guests }: IBookedTables) => {
  try {
    const result = await Bookedtable.create({
      booking_id: uuidToBuffer(booking_id),
      table_id: uuidToBuffer(table_id),
      tables_booked: tables_booked,
      guests: guests,
    });

    if (!result) {
      return null;
    };

    return result;
  } catch (error) {
    throw new Error("Error al agregar la mesa resevada.");
  };
};

const getAll = async () => {
  try {
    const result = await Bookedtable.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        [sequelize.literal('BIN_TO_UUID(table_id)'), 'table_id'],
        'tables_booked',
        'guests',
      ],
    });

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las mesas reservadas.");
  };
};

const getById = async ({ id }: Pick<IBookedTables, "id">) => {
  try {
    const result = await Bookedtable.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        [sequelize.literal('BIN_TO_UUID(table_id)'), 'table_id'],
        'tables_booked',
        'guests',
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!result) {
      return null;
    };

    return result.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la mesa reservada por id.');
  };
};

const getAllByFiltersBookingId = async ({
  booking_id, table_id, tables_booked, guests
}: Pick<IBookedTables, 'booking_id'> & Partial<Pick<IBookedTables, 'table_id' | 'tables_booked' | 'guests'>>) => {
  try {
    const whereConditions: Record<string, any> = {
      booking_id: sequelize.fn('UUID_TO_BIN', booking_id)
    };

    if (table_id) whereConditions.table_id = uuidToBuffer(table_id);
    if (tables_booked) whereConditions.tables_booked = tables_booked;
    if (guests) whereConditions.guests = guests;

    const result = await Bookedtable.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        [sequelize.literal('BIN_TO_UUID(table_id)'), 'table_id'],
        'tables_booked',
        'guests',
      ],
      where: whereConditions
    });

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());

  } catch (error) {
    throw new Error('Error al obtener las mesas reservadas con los filtros proporcionados.');
  };
};

const getAllByFilters = async (filters: Partial<IBookedTables>) => {
  try {
    const { booking_id, table_id, tables_booked, guests } = filters;

    const whereConditions: Record<string, any> = {};

    if (booking_id) whereConditions.booking_id = uuidToBuffer(booking_id);
    if (table_id) whereConditions.table_id = uuidToBuffer(table_id);
    if (tables_booked) whereConditions.tables_booked = tables_booked;
    if (guests) whereConditions.guests = guests;

    const result = await Bookedtable.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        [sequelize.literal('BIN_TO_UUID(table_id)'), 'table_id'],
        'tables_booked',
        'guests',
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las mesas reservadas con los filtros proporcionados.');
  }
};

const editById = async ({ id, tables_booked, guests }: IBookedTables) => {
  try {
    const updateData: any = {};

    if (tables_booked) updateData.tables_booked = tables_booked;
    if (guests) updateData.guests = guests;

    const [updatedRowsCount] = await Bookedtable.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar la mesa reservada.');
  };
};

const deleteById = async ({ id }: Pick<IBookedTables, "id">) => {
  try {
    const result = await Bookedtable.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la mesa reservada.");
  };
};


export default { add, getAll, getById, getAllByFiltersBookingId, getAllByFilters, editById, deleteById };
