import { ITables } from "../types/tables.types";
import Tables from "../models/tables.model";
import { sequelize } from "../../../config/sequalize.config";
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

    if (!result) {
      return null;
    };

    return result;
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

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());
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

    if (!result) {
      return null;
    };

    return result.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la subcategoria por id');
  };
};

const getAllByLocationType = async ({ location_type }: Pick<ITables, 'location_type'>) => {
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
      where: { location_type: location_type }
    });

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());
  } catch (error) {
    throw new Error('Error al obtener la mesa por ubicación.');
  };
};

const getAllByFloor = async ({ floor }: Pick<ITables, 'floor'>) => {
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
      where: { floor: floor }
    });

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());
  } catch (error) {
    throw new Error('Error al obtener la mesa por el piso.');
  };
};

const getAllByRoofType = async ({ roof_type }: Pick<ITables, 'roof_type'>) => {
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
      where: { roof_type: roof_type }
    });

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());
  } catch (error) {
    throw new Error('Error al obtener la mesa por el tipo de techo.');
  };
};

const getAllByFilters = async ({ shop_id, location_type, floor, roof_type }: Pick<ITables, 'shop_id'> & Partial<Pick<ITables, 'location_type' | 'floor' | 'roof_type'>>) => {
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

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());

  } catch (error) {
    throw new Error('Error al obtener las mesas con los filtros proporcionados.');
  }
};

const getAllByShopId = async ({ shop_id }: Pick<ITables, 'shop_id'>) => {
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
      where: {
        shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
      }
    });

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());
  } catch (error) {
    throw new Error('Error al obtener la mesa por el id de negocio.');
  };
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

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar la mesa.');
  };
};

const deleteById = async ({ id }: Pick<ITables, "id">) => {
  try {
    const result = await Tables.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la mesa.");
  };
};


export default { add, getAll, getById, getAllByLocationType, getAllByFloor, getAllByRoofType, getAllByFilters, getAllByShopId, editById, deleteById };
