import { ICountries } from "../types/countries.types";
import Country from "../models/countries.model";
import { formatName } from "../../../utils/formatName";
import { sequelize } from "../../../config/sequelize/sequalize.config";


const add = async ({ name }: ICountries) => {
  try {
    const result = await Country.create({
      name: formatName(name),
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar el país.");
  };
};

const getAll = async () => {
  try {
    const result = await Country.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'created_at',
        'updated_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener los países.");
  };
};

const getById = async ({ id }: Pick<ICountries, "id">) => {
  try {
    const result = await Country.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el país por id.');
  };
};

const getByName = async ({ name }: Pick<ICountries, "name">) => {
  try {
    const result = await Country.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "=",
        name.toLowerCase()
      ),
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        "name",
        "created_at",
        "updated_at"
      ],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el país por el nombre.');
  }
};

const editById = async ({ id, name }: ICountries) => {
  try {
    const [updatedRowsCount] = await Country.update(
      { name: formatName(name) },
      {
        where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
      }
    );

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el país.');
  };
};

const deleteById = async ({ id }: Pick<ICountries, "id">) => {
  try {
    const result = await Country.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el país");
  };
};


export default { add, getAll, getById, getByName, editById, deleteById };
