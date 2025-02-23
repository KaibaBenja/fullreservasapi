import { IAddresses } from "../types/addresses.types";
import Addresses from "../models/addresses.model";
import { formatName } from "../utils/formatName";
import { sequelize } from "../../../config/sequalize.config";
import { Op, Sequelize } from "sequelize";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";

const add = async ({ street, street_number, extra, city_id, province_id, country_id, description }: IAddresses) => {
  try {
    const newAddress = await Addresses.create({
      street: formatName(street),
      street_number: street_number.toUpperCase(),
      extra: extra,
      city_id: uuidToBuffer(city_id),
      province_id: uuidToBuffer(province_id),
      country_id: uuidToBuffer(country_id),
      description: description
    });

    if (!newAddress) {
      return null;
    };

    return { street: newAddress.street, street_number: newAddress.street_number };
  } catch (error) {
    throw new Error("Error al agregar la dirección");
  };
};

const getAll = async () => {
  try {
    const addresses = await Addresses.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'street',
        'street_number',
        'extra',
        [sequelize.literal('BIN_TO_UUID(city_id)'), 'city_id'],
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id'],
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id'],
        'description',
        'created_at',
        'updated_at'
      ],
    });

    if (!addresses || addresses.length === 0) {
      return null;
    };

    return addresses.map(address => address.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las direcciones");
  };
};

const getById = async (id: string) => {
  try {
    const address = await Addresses.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'street',
        'street_number',
        'extra',
        [sequelize.literal('BIN_TO_UUID(city_id)'), 'city_id'],
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id'],
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id'],
        'description',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!address) {
      return null;
    };

    return address.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la dirección por id');
  };
};

const getByAddress = async (street: string, street_number: string) => {
  try {
    const address = await Addresses.findOne({
      where: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("street")), "=", street.toLowerCase()),
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("street_number")), "=", street_number.toLowerCase()),
        ],
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'street',
        'street_number',
        'extra',
        [sequelize.literal('BIN_TO_UUID(city_id)'), 'city_id'],
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id'],
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id'],
        'description',
        'created_at',
        'updated_at'
      ],
    });

    if (!address) {
      return null;
    };

    return address.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la dirección por la calle y el número');
  };
};

const editById = async ({ id, street, street_number, extra, city_id, province_id, country_id, description }: IAddresses) => {
  try {
    const updateData: any = {};

    if (street) updateData.street = formatName(street);
    if (street_number) updateData.street_number = street_number.toUpperCase();
    if (extra) updateData.extra = extra;
    if (city_id) updateData.city_id = sequelize.literal(`UUID_TO_BIN(${sequelize.escape(city_id)})`);
    if (province_id) updateData.province_id = sequelize.literal(`UUID_TO_BIN(${sequelize.escape(province_id)})`);
    if (country_id) updateData.country_id = sequelize.literal(`UUID_TO_BIN(${sequelize.escape(country_id)})`);
    if (description) updateData.description = description;

    const [updatedRowsCount] = await Addresses.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar la dirreción');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Addresses.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la dirección");
  };
};


export default{
  add,
  getAll,
  getById,
  getByAddress,
  editById,
  deleteById
};
