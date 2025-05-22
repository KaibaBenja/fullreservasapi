import { ITables } from "../types/tables.types";
import Tables from "../models/tables.model";
import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";


const add = async ({ shop_id, location_type, floor, roof_type, capacity, quantity }: ITables) => {
  try {
    const result = await Tables.create({
      shop_id: uuidToBuffer(shop_id),
      location_type: location_type,
      floor: floor,
      roof_type: roof_type,
      capacity: capacity,
      quantity: quantity,
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la mesa.");
  };
};

const getAll = async () => {
  try {
    const result = await Tables.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'location_type',
        'floor',
        'roof_type',
        'capacity',
        'quantity'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las mesas.");
  };
};

const getById = async ({ id }: Pick<ITables, "id">) => {
  try {
    const result = await Tables.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'location_type',
        'floor',
        'roof_type',
        'capacity',
        'quantity'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la mesa por id.');
  };
};

const getAllByFilters = async (filters: Partial<ITables>) => {
  try {
    const { shop_id, location_type, floor, roof_type } = filters;

    const whereConditions: Record<string, any> = {};

    if (shop_id) whereConditions.shop_id = uuidToBuffer(shop_id);
    if (location_type) whereConditions.location_type = location_type;
    if (floor) whereConditions.floor = floor;
    if (roof_type) whereConditions.roof_type = roof_type;

    const result = await Tables.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'location_type',
        'floor',
        'roof_type',
        'capacity',
        'quantity'
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las mesas con los filtros proporcionados.');
  }
};

const getAllByFiltersShopId = async ({ shop_id, location_type, floor, roof_type }: Pick<ITables, 'shop_id'> & Partial<Pick<ITables, 'location_type' | 'floor' | 'roof_type'>>) => {
  try {
    const whereConditions: Record<string, any> = {
      shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
    };

    if (location_type) whereConditions.location_type = location_type;
    if (floor) whereConditions.floor = floor;
    if (roof_type) whereConditions.roof_type = roof_type;

    const result = await Tables.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'location_type',
        'floor',
        'roof_type',
        'capacity',
        'quantity'
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las mesas con los filtros proporcionados.');
  }
};

const editById = async ({ id, location_type, floor, roof_type, capacity, quantity }: ITables) => {
  try {
    const updateData: any = {};

    if (location_type) updateData.location_type = location_type;
    if (floor) updateData.floor = floor;
    if (roof_type) updateData.roof_type = roof_type;
    if (capacity) updateData.capacity = capacity;
    if (quantity) updateData.quantity = quantity;

    const [updatedRowsCount] = await Tables.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la mesa.');
  };
};

const deleteById = async ({ id }: Pick<ITables, "id">) => {
  try {
    const result = await Tables.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la mesa.");
  };
};


export default { add, getAll, getById, getAllByFilters, getAllByFiltersShopId, editById, deleteById };
