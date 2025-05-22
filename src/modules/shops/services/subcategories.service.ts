import { ISubcategories } from "../types/subcategories.types";
import Subcategories from "../models/subcategories.model";
import { formatName } from "../../..//utils/formatName";
import { sequelize } from "../../../config/sequelize/sequalize.config";


const add = async ({ name, main_category, logo_url }: ISubcategories) => {
  try {
    const data: any = {
      name: formatName(name),
      main_category: main_category,
    };

    if (logo_url) data.logo_url = logo_url;

    const result = await Subcategories.create(data);

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la subcategoría.");
  };
};

const getAll = async () => {
  try {
    const result = await Subcategories.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'main_category',
        'logo_url',
        'created_at',
        'updated_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las subcategorías.");
  };
};

const getById = async ({ id }: Pick<ISubcategories, "id">) => {
  try {
    const result = await Subcategories.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'main_category',
        'logo_url',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la subcategoría por id.');
  };
};

const getByName = async ({ name }: Pick<ISubcategories, "name">) => {
  try {
    const result = await Subcategories.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "=",
        name.toLowerCase()
      ),
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'main_category',
        'logo_url',
        'created_at',
        'updated_at'
      ],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la subcategoría por nombre.');
  };
};

const getAllByMainCategory = async ({ main_category }: Pick<ISubcategories, "main_category">) => {
  try {
    const result = await Subcategories.findAll({
      where: {
        main_category: main_category,
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        "name",
        "main_category",
        "logo_url",
        "created_at",
        "updated_at",
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las subcategorías.");
  };
};

const editById = async ({ id, name, main_category, logo_url }: ISubcategories) => {
  try {
    const updateData: any = {};

    if (name) updateData.name = formatName(name);
    if (main_category) updateData.main_category = main_category;
    if (logo_url) updateData.logo_url = logo_url;

    const [updatedRowsCount] = await Subcategories.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la subcategoría.');
  };
};

const deleteById = async ({ id }: Pick<ISubcategories, "id">) => {
  try {
    const result = await Subcategories.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la subcategoría.");
  };
};


export default { add, getAll, getById, getByName, getAllByMainCategory, editById, deleteById };
