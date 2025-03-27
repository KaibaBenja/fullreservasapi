import { IShopsAddresses } from "../types/shopsAddresses.types";
import ShopsAddresses from "../models/shopAddresses.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequalize.config";

const add = async ({ shop_id, address_id }: IShopsAddresses) => {
  try {
    const newShopAddress = await ShopsAddresses.create({
      shop_id: uuidToBuffer(shop_id),
      address_id: uuidToBuffer(address_id),
    });

    if (!newShopAddress) {
      return null;
    };

    return { shop_id: newShopAddress.shop_id, address_id: newShopAddress.address_id };
  } catch (error) {
    throw new Error("Error al agregar la dirección del negocio");
  };
};

const getAll = async () => {
  try {
    const shopsAddresses = await ShopsAddresses.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(address_id)'), 'address_id']
      ],
    });

    if (!shopsAddresses || shopsAddresses.length === 0) {
      return null;
    };

    return shopsAddresses.map(shopAddress => shopAddress.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las direcciones de los negocios");
  };
};

const getById = async (id: string) => {
  try {
    const shopAddress = await ShopsAddresses.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(address_id)'), 'address_id']
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!shopAddress) {
      return null;
    };

    return shopAddress.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la dirección del negocio por id');
  };
};

const getByShopAndAddress  = async ({ shop_id, address_id }: IShopsAddresses) => {
  try {
    const shopAddress = await ShopsAddresses.findOne({
      where: {
        shop_id: uuidToBuffer(shop_id),
        address_id: uuidToBuffer(address_id),
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(address_id)'), 'address_id']
      ]
    });

    if (!shopAddress) {
      return null;
    };

    return shopAddress.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la dirección del negocio por shop_id y address_id');
  };
};

const editById = async ({ id, shop_id, address_id }: IShopsAddresses) => {
  try {
    const updateData: any = {};

    if (shop_id) updateData.shop_id = uuidToBuffer(shop_id);
    if (address_id) updateData.address_id = uuidToBuffer(address_id);

    const [updatedRowsCount] = await ShopsAddresses.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error('Error al editar la dirección del negocio');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await ShopsAddresses.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la dirección del negocio");
  };
};


export default {
  add,
  getAll,
  getById,
  getByShopAndAddress,
  editById,
  deleteById
};
