import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import ClosedDay from "../models/closedDays.model";
import { IClosedDays } from "../types/closedDays.types";

const add = async ({ shop_id, day_of_week }: IClosedDays) => {
  try {
    // Primero buscamos los días ya existentes para ese shop
    const existing = await ClosedDay.findAll({
      where: {
        shop_id: uuidToBuffer(shop_id),
        day_of_week: day_of_week, // Sequelize se encarga de manejar arrays en `IN`
      },
    });

    // Obtenemos solo los días que aún no están cargados
    const existingDays = new Set(existing.map(e => e.day_of_week));
    const newDays = day_of_week.filter(day => !existingDays.has(day));

    // Si no hay días nuevos, retornamos null o similar
    if (newDays.length === 0) return null;

    const records = newDays.map(day => ({
      shop_id: uuidToBuffer(shop_id),
      day_of_week: day,
    }));

    const result = await ClosedDay.bulkCreate(records);
    return result;
  } catch (error) {
    throw new Error("Error al agregar el día cerrado.");
  }
};

const getAll = async () => {
  try {
    const result = await ClosedDay.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'day_of_week',
        'created_at',
        'updated_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener los días cerrados.");
  };
};

const getByShopId = async ({ shop_id }: Pick<IClosedDays, "shop_id">) => {
  try {
    const result = await ClosedDay.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'day_of_week',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`shop_id = UUID_TO_BIN(?)`),
      replacements: [shop_id],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener los días cerrados por id de negocio.');
  };
};

const getById = async ({ id }: Pick<IClosedDays, "id">) => {
  try {
    const result = await ClosedDay.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'day_of_week',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el día cerrado por id');
  };
};

const editById = async ({ id, day_of_week }: IClosedDays) => {
  try {
    const updateData: any = {};

    if (day_of_week) updateData.day_of_week = day_of_week;

    const [updatedRowsCount] = await ClosedDay.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });
    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el día cerrado.');
  };
};

const deleteById = async ({ id }: Pick<IClosedDays, "id">) => {
  try {
    const result = await ClosedDay.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el día cerrado.");
  };
};

const deleteByShopId = async ({ shop_id }: Pick<IClosedDays, "shop_id">) => {
  try {
    const result = await ClosedDay.destroy({
      where: { shop_id: sequelize.fn('UUID_TO_BIN', shop_id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar los días cerrados por id de negocio.");
  };
};

export default { add, getAll, getByShopId, getById, editById, deleteById, deleteByShopId };