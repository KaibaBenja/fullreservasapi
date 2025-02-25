import { ISubcategories } from "../types/subcategories.types";
import Subcategories from "../models/countries.model";
import { formatName } from "../../..//utils/formatName";
import { sequelize } from "../../../config/sequalize.config";

const add = async ({ name, main_category }: ISubcategories) => {
  try {
    const newSubcategory = await Subcategories.create({
      name: formatName(name),
      main_category: main_category,
    });

    if (!newSubcategory) {
      return null;
    };

    return { name: newSubcategory.name, main_category: newSubcategory.main_category };
  } catch (error) {
    throw new Error("Error al agregar la subcategoria");
  };
};

const getAll = async () => {
  try {
    const subcategories = await Subcategories.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'main_category',
        'created_at',
        'updated_at'
      ],
    });

    if (!subcategories || subcategories.length === 0) {
      return null;
    };

    return subcategories.map(subcategory => subcategory.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las subcategorias");
  };
};

const getById = async (id: string) => {
  try {
    const subcategory = await Subcategories.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'main_category',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!subcategory) {
      return null;
    };

    return subcategory.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la subcategoria por id');
  };
};

const getByName = async (name: string) => {
  try {
    const subcategory = await Subcategories.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "=",
        name.toLowerCase()
      ),
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'main_category',
        'created_at',
        'updated_at'
      ],
    });

    if (!subcategory) {
      return null;
    };

    return subcategory.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la subcategoria por nombre');
  };
};

const getAllByMainCategory = async (main_category: string) => {
  try {
    const subcategories = await Subcategories.findAll({
      where: {
        main_category: main_category,
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        "name",
        "main_category",
        "created_at",
        "updated_at",
      ],
    });

    if (!subcategories || subcategories.length === 0) {
      return null;
    };

    return subcategories.map(subcategory => subcategory.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las subcategorias");
  };
};

const editById = async ({ id, name, main_category }: ISubcategories) => {
  try {
    const updateData: any = {};

    if (name) updateData.name = formatName(name);
    if (main_category) updateData.main_category = main_category;

    const [updatedRowsCount] = await Subcategories.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error('Error al editar la subcategoria');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Subcategories.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la subcategoria");
  };
};


export default {
  add,
  getAll,
  getById,
  getByName,
  getAllByMainCategory,
  editById,
  deleteById
};
