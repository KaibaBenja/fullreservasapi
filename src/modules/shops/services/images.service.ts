import { IImages } from "../types/images.types";
import Images from "../models/images.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequalize.config";

const add = async ({ shop_id, image_url }: IImages) => {
  try {
    const newImages = await Images.create({
      shop_id: uuidToBuffer(shop_id),
      image_url: image_url,
    });

    if (!newImages) {
      return null;
    };

    return { shop_id: newImages.shop_id, image_url: newImages.image_url };
  } catch (error) {
    throw new Error("Error al agregar la imagen");
  };
};

const getAll = async () => {
  try {
    const images = await Images.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
    });

    if (!images || images.length === 0) {
      return null;
    };

    return images.map(image => image.toJSON());
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener las imagenes");
  };
};

const getByShopId = async (shop_id: string) => {
  try {
    const images = await Images.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
      where: {
        shop_id: uuidToBuffer(shop_id)
      }
    });

    if (!images || images.length === 0) {
      return null;
    };

    return images.map(image => image.toJSON());
  } catch (error) {
    throw new Error('Error al obtener la imagen por id');
  };
};

const getById = async (id: string) => {
  try {
    const image = await Images.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!image) {
      return null;
    };

    return image.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la imagen por id');
  };
};

const lastCreatedEntry = async ({ shop_id, image_url }: IImages) => {
  try {
    const image = await Images.findOne({
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

    if (!image) {
      return null;
    };

    return image.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la imagen por shop_id y image_url');
  };
};

const getByImageUrl = async (image_url: string) => {
  try {
    const image = await Images.findOne({
      where: {
        image_url: image_url,
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        'image_url'
      ],
    });

    if (!image) {
      return null;
    };

    return image.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la imagen por image_url');
  };
};

const editById = async ({ id, shop_id, image_url }: IImages) => {
  try {
    const updateData: any = {};

    if (shop_id) updateData.shop_id = uuidToBuffer(shop_id);
    if (image_url) updateData.image_url = image_url;

    const [updatedRowsCount] = await Images.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error('Error al editar la imagen');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Images.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la imagen");
  };
};


export default {
  add,
  getAll,
  getById,
  getByShopId,
  lastCreatedEntry,
  getByImageUrl,
  editById,
  deleteById
};
