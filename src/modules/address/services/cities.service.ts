import { ICities } from "../types/cities.types";
import City from "../models/cities.model";
import { formatName } from "../../../utils/formatName";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequelize/sequalize.config";

const add = async ({ name, zip_code, province_id }: ICities) => {
  try {
    const result = await City.create({
      name: formatName(name),
      zip_code: zip_code,
      province_id: uuidToBuffer(province_id)
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la ciudad.");
  };
};

const getAll = async () => {
  try {
    const result = await City.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'zip_code',
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id']
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las ciudades");
  };
};

const getById = async ({ id }: Pick<ICities, "id">) => {
  try {
    const result = await City.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'zip_code',
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id']
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la ciudad por id.');
  };
};

const getByName = async ({ name }: Pick<ICities, "name">) => {
  try {
    const result = await City.findOne({
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

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la ciudad por el nombre.');
  };
};

const getByZipCode = async ({ zip_code }: Pick<ICities, "zip_code">) => {
  try {
    const result = await City.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("zip_code")),
        "=",
        zip_code.toLowerCase()
      ),
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'zip_code',
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id']
      ],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la ciudad por el código postal.');
  };
};

const getByProvinceId = async ({ province_id }: Pick<ICities, "province_id">) => {
  try {
    const result = await City.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'zip_code',
        [sequelize.literal('BIN_TO_UUID(province_id)'), 'province_id']
      ],
      where: sequelize.literal(`province_id = UUID_TO_BIN(?)`),
      replacements: [province_id],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las ciudades por el id de la provincia.');
  };
};

const editById = async ({ id, name, zip_code }: Pick<ICities, "id" | "name" | "zip_code">) => {
  try {
    const updateData: any = {};

    if (name) updateData.name = formatName(name);
    if (zip_code) updateData.zip_code = zip_code.toUpperCase();

    const [updatedRowsCount] = await City.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la ciudad.');
  };
};

const deleteById = async ({ id }: Pick<ICities, "id">) => {
  try {
    const result = await City.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la ciudad.");
  };
};


export default { add, getAll, getById, getByName, getByZipCode, getByProvinceId, editById, deleteById };