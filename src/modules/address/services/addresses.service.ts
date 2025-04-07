import { IAddresses } from "../types/addresses.types";
import Addresses from "../models/addresses.model";
import { formatName } from "../../../utils/formatName";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";


const add = async ({ street, street_number, extra, city_id, province_id, country_id, description, latitude, longitude }: IAddresses) => {
  try {
    const result = await Addresses.create({
      street: formatName(street),
      street_number: street_number.toUpperCase(),
      extra: extra,
      city_id: uuidToBuffer(city_id),
      province_id: uuidToBuffer(province_id),
      country_id: uuidToBuffer(country_id),
      latitude: latitude,
      longitude: longitude,
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la dirección.");
  };
};

const getAll = async () => {
  try {
    const result = await Addresses.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'street',
        'street_number',
        'extra',
        [sequelize.literal('BIN_TO_UUID(city_id)'), 'city_id'],
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id'],
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id'],
        'description',
        'latitude',
        'longitude',
        'created_at',
        'updated_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las direcciones.");
  };
};

const getById = async ({ id }: Pick<IAddresses, "id">) => {
  try {
    const result = await Addresses.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'street',
        'street_number',
        'extra',
        [sequelize.literal('BIN_TO_UUID(city_id)'), 'city_id'],
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id'],
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id'],
        'description',
        'latitude',
        'longitude',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la dirección por id.');
  };
};

const getAllByFilters = async (filters: Partial<IAddresses>) => {
  try {
    const { street, street_number, extra, city_id, province_id, country_id, description, latitude, longitude } = filters;

    const whereConditions: Record<string, any> = {};

    if (street) whereConditions.street = street;
    if (street_number) whereConditions.street_number = street_number;
    if (extra) whereConditions.extra = extra;
    if (city_id) whereConditions.city_id = uuidToBuffer(city_id);
    if (province_id) whereConditions.province_id = uuidToBuffer(province_id);
    if (country_id) whereConditions.country_id = uuidToBuffer(country_id);
    if (description) whereConditions.description = description;

    if (latitude && longitude) {
      whereConditions.latitude = latitude;
      whereConditions.longitude = longitude;
    }

    const result = await Addresses.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'street',
        'street_number',
        'extra',
        [sequelize.literal('BIN_TO_UUID(city_id)'), 'city_id'],
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id'],
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id'],
        'description',
        'latitude',
        'longitude',
        'created_at',
        'updated_at'
      ],
      where: whereConditions
    });
    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las direcciones con los filtros proporcionados.');
  }
};

const editById = async ({ id, street, street_number, extra, description, latitude, longitude }: IAddresses) => {
  try {
    const updateData: any = {};

    if (street) updateData.street = formatName(street);
    if (street_number) updateData.street_number = street_number.toUpperCase();
    if (extra) updateData.extra = extra;
    if (description) updateData.description = description;

    if (latitude && longitude) {
      updateData.latitude = latitude;
      updateData.longitude = longitude;
    }

    const [updatedRowsCount] = await Addresses.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la dirreción.');
  };
};

const deleteById = async ({ id }: Pick<IAddresses, "id">) => {
  try {
    const result = await Addresses.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la dirección.");
  };
};


export default { add, getAll, getById, getAllByFilters, editById, deleteById };
