import { IMenus } from "../types/menus.types";
import Menus from "../models/menus.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequelize/sequalize.config";

const add = async ({ shop_id, file_url }: IMenus) => {
  try {
    const result = await Menus.create({
      shop_id: uuidToBuffer(shop_id),
      file_url: file_url,
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar el menú.");
  };
};

const getAll = async () => {
  try {
    const result = await Menus.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url',
        'created_at',
        'updated_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener los menús.");
  };
};

const getByShopId = async ({ shop_id }: Pick<IMenus, "shop_id">) => {
  try {
    const result = await Menus.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`shop_id = UUID_TO_BIN(?)`),
      replacements: [shop_id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el menú por id de negocio.');
  };
};

const getById = async ({ id }: Pick<IMenus, "id">) => {
  try {
    const result = await Menus.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el menú por id.');
  };
};

const lastCreatedEntry = async ({ shop_id, file_url }: IMenus) => {
  try {
    const result = await Menus.findOne({
      where: {
        shop_id: uuidToBuffer(shop_id),
        file_url: file_url,
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url',
        'created_at',
        'updated_at'
      ]
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el menú por shop_id y file_url');
  };
};

const getByImageUrl = async ({ file_url }: Pick<IMenus, "file_url">) => {
  try {
    const result = await Menus.findOne({
      where: { file_url: file_url },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url',
        'created_at',
        'updated_at'
      ],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el menú por URL.');
  };
};

const editById = async ({ id, file_url }: Pick<IMenus, "id" | "file_url">) => {
  try {
    const [updatedRowsCount] = await Menus.update({ file_url }, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el menú.');
  };
};

const deleteById = async ({ id }: Pick<IMenus, "id">) => {
  try {
    const result = await Menus.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el menú.");
  };
};

const deleteByShopId = async ({ shop_id }: Pick<IMenus, "shop_id">) => {
  try {
    const result = await Menus.destroy({
      where: { shop_id: sequelize.fn('UUID_TO_BIN', shop_id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el menú por id de negocio.");
  };
};


export default { add, getAll, getById, getByShopId, lastCreatedEntry, getByImageUrl, editById, deleteById, deleteByShopId };
