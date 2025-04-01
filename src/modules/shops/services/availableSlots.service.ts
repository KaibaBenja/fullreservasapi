import { IAvailableSlots } from "../types/availableSlots.types";
import AvailableSlots from "../models/availableSlots.model";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { IShops } from "../types/shops.types";


function parseTime(time: string): number {
  if (!/^\d{2}:\d{2}$/.test(time)) throw new Error(`Formato incorrecto: ${time}`);
  
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`; // Agregamos ":00"
};

const add = async ({
  shop_id,
  start_time,
  end_time,
  capacity,
  average_stay_time,
}: IAvailableSlots & Pick<IShops, 'average_stay_time'>) => {
  try {
    const slots: any[] = [];
    let currentTime = parseTime(start_time);
    const endTime = parseTime(end_time);
    const averageStayTime = Number(average_stay_time); 

    while (currentTime < endTime) {
      const nextTime = currentTime + averageStayTime;

      if (nextTime > endTime) break;

      const startFormatted = formatTime(currentTime);
      const endFormatted = formatTime(nextTime);

      const slot = await AvailableSlots.create({
        shop_id: uuidToBuffer(shop_id),
        start_time: startFormatted,
        end_time: endFormatted,
        capacity
      });

      if (slot) {
        slots.push(slot);  
      }
      currentTime = nextTime; 
    }

    return slots.length ? slots : null; 
  } catch (error) {
    throw new Error("Error al agregar los espacios disponibles.");
  }
};

const getAll = async () => {
  try {
    const result = await AvailableSlots.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'start_time',
        'end_time',
        'capacity',
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener los espacios disponibles.");
  };
};

const getById = async ({ id }: Pick<IAvailableSlots, "id">) => {
  try {
    const result = await AvailableSlots.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'start_time',
        'end_time',
        'capacity',
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el espacio disponible por id.');
  };
};

const getAllByFilters = async ({ shop_id, start_time, end_time, capacity }: Pick<IAvailableSlots, 'shop_id'> & Partial<Pick<IAvailableSlots, 'start_time' | 'end_time' | 'capacity'>>) => {
  try {
    const whereConditions: Record<string, any> = {
      shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
    };

    if (start_time) whereConditions.start_time = start_time;
    if (end_time) whereConditions.end_time = end_time;
    if (capacity) whereConditions.capacity = capacity;

    const result = await AvailableSlots.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'start_time',
        'end_time',
        'capacity',
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener los espacios disponibles con los filtros proporcionados.');
  };
};

const getAllByShopId = async ({ shop_id }: Pick<IAvailableSlots, 'shop_id'>) => {
  try {
    const result = await AvailableSlots.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'start_time',
        'end_time',
        'capacity',
      ],
      where: {
        shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
      }
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener el espacio disponible por el id de negocio.');
  };
};

const editById = async ({ id, start_time, end_time, capacity }: IAvailableSlots) => {
  try {
    const updateData: any = {};

    if (start_time) updateData.start_time = start_time;
    if (end_time) updateData.end_time = end_time;
    if (capacity) updateData.capacity = capacity;

    const [updatedRowsCount] = await AvailableSlots.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el espacio disponible.');
  };
};

const deleteById = async ({ id }: Pick<IAvailableSlots, "id">) => {
  try {
    const result = await AvailableSlots.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el espacio disponible.");
  };
};


export default { add, getAll, getById, getAllByFilters, getAllByShopId, editById, deleteById };
