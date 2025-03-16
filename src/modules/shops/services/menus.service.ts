import { IMenus } from "../types/menus.types";
import Menus from "../models/menus.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequalize.config";

const add = async ({ shop_id, file_url }: IMenus) => {
  try {
    const result = await Menus.create({
      shop_id: uuidToBuffer(shop_id),
      file_url: file_url,
    });

    if (!result) {
      return null;
    };

    return { shop_id: result.shop_id, file_url: result.file_url };
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
        'file_url'
      ],
    });

    if (!result || result.length === 0) {
      return null;
    };

    return result.map(res => res.toJSON());
  } catch (error) {
    throw new Error("Error al obtener los menús.");
  };
};

const getByShopId = async (shop_id: string) => {
  try {
    const result = await Menus.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url'
      ],
      where: {
        shop_id: uuidToBuffer(shop_id)
      }
    });

    if (!result) {
      return null;
    };

    return result.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el menú por id de negocio.');
  };
};

const getById = async (id: string) => {
  try {
    const result = await Menus.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!result) {
      return null;
    };

    return result.toJSON();
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
        'file_url'
      ]
    });

    if (!result) {
      return null;
    };

    return result.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el menú por shop_id y file_url');
  };
};

const getByImageUrl = async (file_url: string) => {
  try {
    const result = await Menus.findOne({
      where: {
        file_url: file_url,
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'file_url'
      ],
    });

    if (!result) {
      return null;
    };

    return result.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el menú por file_url');
  };
};

const editById = async ({ id, file_url }: Pick<IMenus, "id" | "file_url">) => {
  try {
    const [updatedRowsCount] = await Menus.update({ file_url }, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar el menú');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Menus.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el menú");
  };
};

const deleteByShopId = async (shop_id: string) => {
  try {
    const result = await Menus.destroy({
      where: {
        shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
      }
    });

    if (!result) {
      return null;
    };

    return { success: true, deletedCount: result, };
  } catch (error) {
    throw new Error("Error al eliminar el menú por id de negocio.");
  };
};


export default { add, getAll, getById, getByShopId, lastCreatedEntry, getByImageUrl, editById, deleteById, deleteByShopId };
