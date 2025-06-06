import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import AvailableSlot from "../../shops/models/availableSlots.model";
import Rating from "../../shops/models/ratings.model";
import Shop from "../../shops/models/shops.model";
import Booking from "../models/bookings.model";
import { IBookings } from "../types/bookings.types";


const add = async ({ user_id, shop_id, booked_slot_id, date, guests, location_type, floor, roof_type, status, booking_code }: IBookings) => {
  try {
    const result = await Booking.create({
      user_id: uuidToBuffer(user_id),
      shop_id: uuidToBuffer(shop_id),
      booked_slot_id: uuidToBuffer(booked_slot_id),
      date: date,
      guests: guests,
      location_type: location_type,
      floor: floor,
      roof_type: roof_type,
      booking_code: booking_code
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la reserva.");
  };
};

const getAll = async () => {
  try {
    const result = await Booking.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(booked_slot_id)'), 'booked_slot_id'],
        'date',
        'guests',
        'location_type',
        'floor',
        'roof_type',
        'status',
        'booking_code'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las reservas.");
  };
};

const getById = async ({ id }: Pick<IBookings, "id">) => {
  try {
    const result = await Booking.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(booked_slot_id)'), 'booked_slot_id'],
        'date',
        'guests',
        'location_type',
        'floor',
        'roof_type',
        'status',
        'booking_code'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la reserva por id.');
  };
};

const getAllByFiltersShopId = async ({
  user_id, shop_id, booked_slot_id, date, guests, location_type, floor, roof_type, booking_code, status
}: Pick<IBookings, 'shop_id'> & Partial<Pick<IBookings, 'user_id' | 'booked_slot_id' | 'date' | 'guests' | 'location_type' | 'floor' | 'roof_type' | 'booking_code' | 'status'>>) => {
  try {
    const whereConditions: Record<string, any> = {
      shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
    };

    if (user_id) whereConditions.user_id = uuidToBuffer(user_id);
    if (booked_slot_id) whereConditions.booked_slot_id = uuidToBuffer(booked_slot_id);
    if (date) whereConditions.date = date;
    if (guests) whereConditions.guests = guests;
    if (location_type) whereConditions.location_type = location_type;
    if (floor) whereConditions.floor = floor;
    if (roof_type) whereConditions.roof_type = roof_type;
    if (booking_code) whereConditions.booking_code = booking_code;
    if (status) whereConditions.status = status;

    const result = await Booking.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(booked_slot_id)'), 'booked_slot_id'],
        'date',
        'guests',
        'location_type',
        'floor',
        'roof_type',
        'status',
        'booking_code'
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las reservas con los filtros proporcionados.');
  };
};

const getAllByFiltersUserId = async ({
  user_id, shop_id, booked_slot_id, date, guests, location_type, floor, roof_type, booking_code, status
}: Pick<IBookings, 'user_id'> & Partial<Pick<IBookings, 'shop_id' | 'booked_slot_id' | 'date' | 'guests' | 'location_type' | 'floor' | 'roof_type' | 'booking_code' | 'status'>>) => {
  try {
    const whereConditions: Record<string, any> = {
      user_id: sequelize.fn('UUID_TO_BIN', user_id)
    };

    if (shop_id) whereConditions.shop_id = uuidToBuffer(shop_id);
    if (booked_slot_id) whereConditions.booked_slot_id = uuidToBuffer(booked_slot_id);
    //if (date) whereConditions.date = date;
    if (guests) whereConditions.guests = guests;
    if (location_type) whereConditions.location_type = location_type;
    if (floor) whereConditions.floor = floor;
    if (roof_type) whereConditions.roof_type = roof_type;
    if (booking_code) whereConditions.booking_code = booking_code;
    if (status) whereConditions.status = status;

    const result = await Booking.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Booking.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Booking.user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(Booking.shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(Booking.booked_slot_id)'), 'booked_slot_id'],
        'date',
        'guests',
        'location_type',
        'floor',
        'roof_type',
        'status',
        'booking_code'
      ],
      where: whereConditions,
      include: [
        {
          model: Shop,
          attributes: ['name'],
        },
        {
          model: AvailableSlot,
          attributes: ['start_time'],
        },
        {
          model: Rating,
          as: 'rating',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(rating.id)'), 'id'],
            [sequelize.literal('BIN_TO_UUID(rating.shop_id)'), 'shop_id'],
            [sequelize.literal('BIN_TO_UUID(rating.user_id)'), 'user_id'],
            [sequelize.literal('BIN_TO_UUID(rating.booking_id)'), 'booking_id'],
            'rating',
            'status',
            'comment'
          ],
        }
      ],
      order: [['date', 'ASC']]
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las reservas con los filtros proporcionados.');
  };
};

const getAllByFilters = async (filters: Partial<IBookings>) => {
  try {
    const { user_id, shop_id, booked_slot_id, date, guests, location_type, floor, roof_type, booking_code, status } = filters;

    const whereConditions: Record<string, any> = {};

    if (user_id) whereConditions.user_id = uuidToBuffer(user_id);
    if (shop_id) whereConditions.shop_id = uuidToBuffer(shop_id);
    if (booked_slot_id) whereConditions.booked_slot_id = uuidToBuffer(booked_slot_id);
    if (date) whereConditions.date = date;
    if (guests) whereConditions.guests = guests;
    if (location_type) whereConditions.location_type = location_type;
    if (floor) whereConditions.floor = floor;
    if (roof_type) whereConditions.roof_type = roof_type;
    if (booking_code) whereConditions.booking_code = booking_code;
    if (status) whereConditions.status = status;

    const result = await Booking.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(booked_slot_id)'), 'booked_slot_id'],
        'date',
        'guests',
        'location_type',
        'floor',
        'roof_type',
        'status',
        'booking_code'
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las reservas con los filtros proporcionados.');
  }
};

const editById = async (data: Partial<IBookings>) => {
  try {
    const { id, date, guests, location_type, floor, roof_type, status } = data;
    const updateData: any = {};

    if (date) updateData.date = date;
    if (guests) updateData.guests = guests;
    if (location_type) updateData.location_type = location_type;
    if (floor) updateData.floor = floor;
    if (roof_type) updateData.roof_type = roof_type;
    if (status) updateData.status = status;

    // Si el nuevo status es CONFIRMED, obtenemos la reserva
    let bookingData: any = null;
    if (status === 'CONFIRMED') {
      bookingData = await Booking.findOne({
        where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`),
        attributes: [
          [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
          [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
          [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        ],
        raw: true
      });

      if (!bookingData) throw new Error("No se encontró la reserva para confirmar.");
    }

    const [updatedRowsCount] = await Booking.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (status === 'CONFIRMED') {
      await Rating.create({
        booking_id: uuidToBuffer(bookingData.id),
        user_id: uuidToBuffer(bookingData.user_id),
        shop_id: uuidToBuffer(bookingData.shop_id),
        rating: 0.0,
        status: 'PENDING',
        comment: undefined
      });
    }

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la reserva.');
  };
};

const deleteById = async ({ id }: Pick<IBookings, "id">) => {
  try {
    const result = await Booking.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la reserva.");
  };
};


export default { add, getAll, getById, getAllByFiltersShopId, getAllByFiltersUserId, getAllByFilters, editById, deleteById };
