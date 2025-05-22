import { IProvinces } from "../types/provinces.types";
import Province from "../models/provinces.model";
import { formatName } from "../../../utils/formatName";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequelize/sequalize.config";


const add = async ({ name, country_id }: IProvinces) => {
  try {
    const result = await Province.create({
      name: formatName(name),
      country_id: uuidToBuffer(country_id)
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la provincia.");
  };
};

const getAll = async () => {
  try {
    const result = await Province.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id']
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las provincias.");
  };
};

const getById = async ({ id }: Pick<IProvinces, "id">) => {
  try {
    const result = await Province.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id']
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la provincia por id.');
  };
};

const getByName = async ({ name }: Pick<IProvinces, "name">) => {
  try {
    const result = await Province.findOne({
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

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la provincia por el nombre.');
  };
};

const getByCountryId = async ({ country_id }: Pick<IProvinces, "country_id">) => {
  try {
    const result = await Province.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        [sequelize.literal('BIN_TO_UUID(country_id)'), 'country_id']
      ],
      where: sequelize.literal(`country_id = UUID_TO_BIN(?)`),
      replacements: [country_id],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las provincias por el id del país.');
  };
};

const editById = async ({ id, name }: Pick<IProvinces, "id" | "name">) => {
  try {
    const [updatedRowsCount] = await Province.update(
      { name: formatName(name) },
      {
        where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
      }
    );

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la provincia.');
  };
};

const deleteById = async ({ id }: Pick<IProvinces, "id">) => {
  try {
    const result = await Province.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la provincia.");
  };
};


export default { add, getAll, getById, getByName, getByCountryId, editById, deleteById };
