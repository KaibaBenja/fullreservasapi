import { IShopsAddresses } from "../types/shopsAddresses.types";
import ShopsAddresses from "../models/shopAddresses.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequelize/sequalize.config";


const add = async ({ shop_id, address_id }: IShopsAddresses) => {
  try {
    const result = await ShopsAddresses.create({
      shop_id: uuidToBuffer(shop_id),
      address_id: uuidToBuffer(address_id),
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la dirección del negocio.");
  };
};

const getAll = async () => {
  try {
    const result = await ShopsAddresses.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(address_id)'), 'address_id'],
        'created_at',
        'updated_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las direcciones de los negocios.");
  };
};

const getById = async ({ id }: Pick<IShopsAddresses, "id">) => {
  try {
    const result = await ShopsAddresses.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(address_id)'), 'address_id'],
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la dirección del negocio por id.');
  };
};

const getByShopAndAddress = async ({ shop_id, address_id }: IShopsAddresses) => {
  try {
    const result = await ShopsAddresses.findOne({
      where: {
        shop_id: uuidToBuffer(shop_id),
        address_id: uuidToBuffer(address_id),
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shop_id)'), 'shop_id'],
        [sequelize.literal('BIN_TO_UUID(address_id)'), 'address_id'],
        'created_at',
        'updated_at'
      ]
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la dirección del negocio por id de negoció y dirección.');
  };
};

const editById = async ({ id, address_id }: IShopsAddresses) => {
  try {
    const updateData: any = {};

    if (address_id) updateData.address_id = uuidToBuffer(address_id);

    const [updatedRowsCount] = await ShopsAddresses.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la dirección del negocio');
  };
};

const deleteById = async ({ id }: Pick<IShopsAddresses, "id">) => {
  try {
    const result = await ShopsAddresses.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la dirección del negocio.");
  };
};


export default { add, getAll, getById, getByShopAndAddress, editById, deleteById };
