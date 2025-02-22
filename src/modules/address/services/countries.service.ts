import { ICountries } from "../types/countries.types";
import Country from "../models/countries.model";
import { formatName } from "../utils/formatName";

import { sequelize } from "../../../config/sequalize.config";

const add = async ({ name }: ICountries) => {
  const formatedName = formatName(name);

  try {
    const newCountry = await Country.create({
      name: formatedName,
    });

    if (!newCountry) {
      return null;
    }

    return { name: newCountry.name };
  } catch (error) {
    console.log(error);
    throw new Error("Error al agregar el nuevo país");
  }
};

const getAll = async () => {
  try {
    const countries = await Country.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
      ],
    });

    if (!countries || countries.length === 0) {
      return null;
    }

    return countries.map(country => country.toJSON());
  } catch (error) {
    throw new Error("Error al obtener los países");
  }
};

const getById = async (id: string) => {
  try {
    const country = await Country.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!country) {
      return null;
    }

    return country.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el país por id');
  }
};

const getByName = async (name: string) => {
  try {
    const country = await Country.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "=",
        name.toLowerCase()
      ),
      attributes: [[sequelize.literal("BIN_TO_UUID(id)"), "id"], "name"],
    });

    if (!country) {
      return null;
    }

    return country.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el país por el nombre');
  }
};

const editById = async ({ id, name }: ICountries) => {
  try {
    const [updatedRowsCount] = await Country.update(
      { name: name }, 
      {
        where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
      }
    );

    if (updatedRowsCount === 0) {
      return null;
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error('Error al editar el país');
  }
};

const deleteById = async (id: string) => {
  try {
    const result = await Country.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    }

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el país");
  }
};


const countriesServices = {
  add,
  getAll,
  getById,
  getByName,
  editById,
  deleteById
};

export default countriesServices;