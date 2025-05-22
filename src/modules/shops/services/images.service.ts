import { IImages } from "../types/images.types";
import Images from "../models/images.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequelize/sequalize.config";

const add = async ({ shop_id, image_url }: IImages) => {
  try {
    const result = await Images.create({
      shop_id: uuidToBuffer(shop_id),
      image_url: image_url,
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la imagen.");
  };
};

const getAll = async () => {
  try {
    const result = await Images.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las imagenes.");
  };
};

const getByShopId = async ({ shop_id }: Pick<IImages, "shop_id">) => {
  try {
    const result = await Images.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
      where: sequelize.literal(`shop_id = UUID_TO_BIN(?)`),
      replacements: [shop_id],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener la imagen por id de negocio.');
  };
};

const getById = async ({ id }: Pick<IImages, "id">) => {
  try {
    const result = await Images.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la imagen por id');
  };
};

const lastCreatedEntry = async ({ shop_id, image_url }: IImages) => {
  try {
    const result = await Images.findOne({
      where: {
        shop_id: uuidToBuffer(shop_id),
        image_url: image_url,
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ]
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la imagen por shop_id y image_url');
  };
};

const getByImageUrl = async ({ image_url }: Pick<IImages, "image_url">) => {
  try {
    const result = await Images.findOne({
      where: {
        image_url: image_url,
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la imagen por image_url');
  };
};

const editById = async ({ id, image_url }: Pick<IImages, "id" | "image_url">) => {
  try {
    const [updatedRowsCount] = await Images.update({ image_url }, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la imagen');
  };
};

const deleteById = async ({ id }: Pick<IImages, "id">) => {
  try {
    const result = await Images.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la imagen");
  };
};

const deleteByShopId = async ({ shop_id }: Pick<IImages, "shop_id">) => {
  try {
    const result = await Images.destroy({
      where: {
        shop_id: sequelize.fn('UUID_TO_BIN', shop_id)
      }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar las imágenes por id de negocio.");
  };
};


export default { add, getAll, getById, getByShopId, lastCreatedEntry, getByImageUrl, editById, deleteById, deleteByShopId };
