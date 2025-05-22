import { IFooter } from "../types/footer.types";
import Footer from "../models/footer.model";
import { sequelize } from "../../../config/sequelize/sequalize.config";

const add = async (data: IFooter) => {
  try {
    const result = await Footer.create({
      key: data.key,
      content: data.content
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    console.log(error);
    throw new Error("Error al agregar el contenido del sitio.");
  }
};

const getAll = async () => {
  try {
    const result = await Footer.findAll({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        "key",
        "content",
        "created_at",
        "updated_at"
      ]
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener el contenido del sitio.");
  }
};

const getById = async ({ id }: Pick<IFooter, "id">) => {
  try {
    const result = await Footer.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        "key",
        "content",
        "created_at",
        "updated_at"
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al obtener el contenido por ID.");
  }
};

const getByKey = async (key: IFooter["key"]) => {
  try {
    const result = await Footer.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        "key",
        "content",
        "created_at",
        "updated_at"
      ],
      where: { key }
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al obtener el contenido por clave.");
  }
};

const editById = async (data: IFooter) => {
  try {
    const { id, key, content } = data;

    const updateData: { key?: IFooter["key"], content?: string } = {};
    if (key) updateData.key = key;
    if (content) updateData.content = content;
    const [updatedRowsCount] = await Footer.update(updateData, {
      where: {
        id: sequelize.fn("UUID_TO_BIN", id)
      }
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al editar el contenido del sitio.");
  }
};

const deleteById = async ({ id }: Pick<IFooter, "id">) => {
  try {
    const result = await Footer.destroy({
      where: { id: sequelize.fn("UUID_TO_BIN", id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el contenido del sitio.");
  }
};

export default { add, getAll, getById, getByKey, editById, deleteById };