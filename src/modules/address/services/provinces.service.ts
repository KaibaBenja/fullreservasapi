import { IProvinces } from "../types/provinces.types";
import Province from "../models/provinces.model";
import { formatName } from "../utils/formatName";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequalize.config";

const add = async ({ name, country_id }: IProvinces) => {
  try {
    const newProvince = await Province.create({
      name: formatName(name),
      country_id: uuidToBuffer(country_id)
    });

    if (!newProvince) {
      return null;
    };

    return { name: newProvince.name };
  } catch (error) {
    throw new Error("Error al agregar la nueva provincia");
  };
};

const getAll = async () => {
  try {
    const provinces = await Province.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id']
      ],
    });

    if (!provinces || provinces.length === 0) {
      return null;
    };

    return provinces.map(province => province.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las provincias");
  };
};

const getById = async (id: string) => {
  try {
    const province = await Province.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id']
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!province) {
      return null;
    };

    return province.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la provincia por id');
  };
};

const getByName = async (name: string) => {
  try {
    const province = await Province.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "=",
        name.toLowerCase()
      ),
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id']
      ],
    });

    if (!province) {
      return null;
    };

    return province.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la provincia por el nombre');
  };
};

const editById = async ({ id, name, country_id }: IProvinces) => {
  try {
    const updateData: any = {};

    if (name) updateData.name = formatName(name);
    if (country_id) updateData.country_id = sequelize.literal(`UUID_TO_BIN(${sequelize.escape(country_id)})`);

    const [updatedRowsCount] = await Province.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar la provincia');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Province.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la provincia");
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
