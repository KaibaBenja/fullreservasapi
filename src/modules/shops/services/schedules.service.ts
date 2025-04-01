import { ISchedules } from "../types/schedules.types";
import Schedules from "../models/schedules.model";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";


const add = async ({ shop_id, open_time, close_time }: ISchedules) => {
  try {
    const result = await Schedules.create({
      shop_id: uuidToBuffer(shop_id),
      open_time: open_time,
      close_time: close_time
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar el horario.");
  };
};

const getAll = async () => {
  try {
    const result = await Schedules.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'open_time',
        'close_time'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener el horario.");
  };
};

const getById = async ({ id }: Pick<ISchedules, "id">) => {
  try {
    const result = await Schedules.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'open_time',
        'close_time'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el horario.');
  };
};

const getByShopId = async ({ shop_id }: Pick<ISchedules, "shop_id">) => {
  try {
    const result = await Schedules.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'open_time',
        'close_time'
      ],
      where: sequelize.literal(`shop_id = UUID_TO_BIN(?)`),
      replacements: [shop_id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el horario por el id de negocio.');
  };
};

const editById = async ({ id, open_time, close_time }: ISchedules) => {
  try {
    const updateData: any = {};

    if (open_time) updateData.open_time = open_time;
    if (close_time) updateData.close_time = close_time;

    const [updatedRowsCount] = await Schedules.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el horario disponible.');
  };
};

const deleteById = async ({ id }: Pick<ISchedules, "id">) => {
  try {
    const result = await Schedules.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el horario.");
  };
};


export default { add, getAll, getById, getByShopId, editById, deleteById };
