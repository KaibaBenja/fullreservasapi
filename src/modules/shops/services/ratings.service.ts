import { IRatings } from "../types/ratings.types";
import Rating from "../models/ratings.model";
import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import User from "../../users/models/users.model";


const add = async ({ shop_id, user_id, booking_id, rating, status, comment }: IRatings) => {
  try {
    const result = await Rating.create({
      user_id: uuidToBuffer(user_id),
      shop_id: uuidToBuffer(shop_id),
      booking_id: uuidToBuffer(booking_id),
      rating: rating,
      status: status,
      comment: comment ?? undefined,
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la reseña.");
  };
};

const getAll = async () => {
  try {
    const result = await Rating.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        'rating',
        'status',
        'comment',
        'created_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las reseñas.");
  };
};

const getById = async ({ id }: Pick<IRatings, "id">) => {
  try {
    const result = await Rating.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        'rating',
        'status',
        'comment',
        'created_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la reseña por id.');
  };
};

const getAllByFiltersShopId = async ({
  shop_id, user_id, booking_id, rating, status, comment
}: Pick<IRatings, 'shop_id'> & Partial<Pick<IRatings, 'user_id' | 'booking_id' | 'rating' | 'status' | 'comment'>>) => {
  try {
    const whereConditions: Record<string, any> = {
      shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
    };

    if (user_id) whereConditions.user_id = uuidToBuffer(user_id);
    if (booking_id) whereConditions.booking_id = uuidToBuffer(booking_id);
    if (rating) whereConditions.rating = rating;
    if (status) whereConditions.status = status;
    if (comment) whereConditions.comment = comment;

    const result = await Rating.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Rating.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Rating.shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(Rating.user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(Rating.booking_id)'), 'booking_id'],
        'rating',
        'status',
        'comment',
        'created_at'
      ],
      include: [
        {
          model: User,
          attributes: [
            "full_name",
          ],
        },
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener las reseñas con los filtros proporcionados.');
  };
};

const getAllByFiltersUserId = async ({
  shop_id, user_id, booking_id, rating, status, comment
}: Pick<IRatings, 'user_id'> & Partial<Pick<IRatings, 'shop_id' | 'booking_id' | 'rating' | 'status' | 'comment'>>) => {
  try {
    const whereConditions: Record<string, any> = {
      user_id: sequelize.fn('UUID_TO_BIN', user_id)
    };

    if (shop_id) whereConditions.shop_id = uuidToBuffer(shop_id);
    if (booking_id) whereConditions.booking_id = uuidToBuffer(booking_id);
    if (rating) whereConditions.rating = rating;
    if (status) whereConditions.status = status;
    if (comment) whereConditions.comment = comment;

    const result = await Rating.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        'rating',
        'status',
        'comment',
        'created_at'
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las reseñas con los filtros proporcionados.');
  };
};

const getAllByFilters = async (filters: Partial<IRatings>) => {
  try {
    const { id, shop_id, user_id, booking_id, rating, status, comment } = filters;

    const whereConditions: Record<string, any> = {};

    if (id) whereConditions.id = uuidToBuffer(id);
    if (shop_id) whereConditions.shop_id = uuidToBuffer(shop_id);
    if (user_id) whereConditions.user_id = uuidToBuffer(user_id);
    if (booking_id) whereConditions.booking_id = uuidToBuffer(booking_id);
    if (rating) whereConditions.rating = rating;
    if (status) whereConditions.status = status;
    if (comment) whereConditions.comment = comment;

    const result = await Rating.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(booking_id)'), 'booking_id'],
        'rating',
        'status',
        'comment',
        'created_at'
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las reseñas con los filtros proporcionados.');
  }
};

const editById = async ({ id, rating, status, comment }: IRatings) => {
  try {
    const updateData: any = {};

    if (rating) updateData.rating = rating;
    if (status) updateData.status = status;
    if (comment) updateData.comment = comment;

    const [updatedRowsCount] = await Rating.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la reseña.');
  };
};

const deleteById = async ({ id }: Pick<IRatings, "id">) => {
  try {
    const result = await Rating.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la reserva.");
  };
};


export default { add, getAll, getById, getAllByFiltersShopId, getAllByFiltersUserId, getAllByFilters, editById, deleteById };
