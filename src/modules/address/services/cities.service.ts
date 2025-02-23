import { ICities } from "../types/cities.types";
import City from "../models/cities.model";
import { formatName } from "../utils/formatName";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequalize.config";

const add = async ({ name, zip_code, province_id }: ICities) => {
  try {
    const newCity = await City.create({
      name: formatName(name),
      zip_code: zip_code,
      province_id: uuidToBuffer(province_id)
    });

    if (!newCity) {
      return null;
    };

    return { name: newCity.name };
  } catch (error) {
    throw new Error("Error al agregar la nueva ciudad");
  };
};

const getAll = async () => {
  try {
    const cities = await City.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'zip_code',
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id']
      ],
    });

    if (!cities || cities.length === 0) {
      return null;
    }

    return cities.map(city => city.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las ciudades");
  };
};

const getById = async (id: string) => {
  try {
    const city = await City.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'zip_code',
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id']
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!city) {
      return null;
    };

    return city.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la ciudad por id');
  };
};

const getByName = async (name: string) => {
  try {
    const city = await City.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "=",
        name.toLowerCase()
      ),
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'zip_code',
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id']
      ],
    });

    if (!city) {
      return null;
    };

    return city.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la ciudad por el nombre');
  };
};

const editById = async ({ id, name, zip_code, province_id }: ICities) => {
  try {
    const updateData: any = {};

    if (name) updateData.name = formatName(name);
    if (zip_code) updateData.zip_code = zip_code.toUpperCase();
    if (province_id) updateData.province_id = sequelize.literal(`UUID_TO_BIN(${sequelize.escape(province_id)})`);

    const [updatedRowsCount] = await City.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar la ciudad');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await City.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la ciudad");
  };
};


export default {
  add,
  getAll,
  getById,
  getByName,
  editById,
  deleteById
};